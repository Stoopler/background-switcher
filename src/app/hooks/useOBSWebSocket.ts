import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import OBSWebSocket from 'obs-websocket-js'
import { useAppStore } from '../store/appStore'

interface OBSInput {
  inputKind: string
  inputName: string
}

export function useOBSWebSocket() {
  const {
    setObsConnected,
    obsWebsocketUrl,
    obsPort,
    obsPassword,
    setObsWebsocketUrl,
    setObsPort,
    setObsPassword,
  } = useAppStore()
  const obsRef = useRef<OBSWebSocket | null>(null)
  const [error, setError] = useState<string | null>(null)
  const reconnectInterval = useMemo(
    () =>
      process.env.OBS_RECONNECT_INTERVAL
        ? parseInt(process.env.OBS_RECONNECT_INTERVAL)
        : 5000,
    []
  )
  const heartbeatInterval = useMemo(
    () =>
      process.env.OBS_HEARTBEAT_INTERVAL
        ? parseInt(process.env.OBS_HEARTBEAT_INTERVAL)
        : 5000,
    []
  )
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isConnectingRef = useRef(false)

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

  const handleConnectionClosed = useCallback(() => {
    console.log('OBS connection closed')
    setObsConnected(false)
    setError('OBS connection closed')
    stopHeartbeat()

    if (obsRef.current) {
      obsRef.current.removeAllListeners()
      obsRef.current = null
    }
  }, [setObsConnected, setError, stopHeartbeat])

  const startHeartbeat = useCallback(() => {
    stopHeartbeat()
    heartbeatIntervalRef.current = setInterval(async () => {
      if (obsRef.current?.identified) {
        try {
          await obsRef.current.call('GetVersion')
        } catch (err) {
          console.error('Heartbeat failed:', err)
          handleConnectionClosed()
        }
      }
    }, heartbeatInterval)
  }, [heartbeatInterval, stopHeartbeat, handleConnectionClosed])

  const connectInternal = useCallback(
    async (url: string, port: string | number, password: string) => {
      if (isConnectingRef.current || obsRef.current?.identified) {
        console.log('Already connected or connecting to OBS')
        return
      }

      isConnectingRef.current = true
      try {
        if (!obsRef.current) {
          obsRef.current = new OBSWebSocket()
        }

        await obsRef.current.connect(`ws://${url}:${port}`, password)
        console.log('Connected to OBS')
        setObsConnected(true)
        setError(null)

        // Update store with successful connection details
        setObsWebsocketUrl(url)
        setObsPort(port.toString())
        setObsPassword(password)

        localStorage.setItem(
          'obsConnectionInfo',
          JSON.stringify({
            obsWebsocketUrl: url,
            obsPort: port,
            obsPassword: password,
          })
        )

        // Attach event listeners
        obsRef.current.on('ConnectionClosed', handleConnectionClosed)
        obsRef.current.on('ConnectionError', (err) => {
          console.error('OBS connection error:', err)
          setError('OBS connection error')
          handleConnectionClosed()
        })

        startHeartbeat()
      } catch (err) {
        console.error('Failed to connect to OBS:', err)
        setObsConnected(false)
        setError('Failed to connect to OBS')
        if (obsRef.current) {
          obsRef.current.removeAllListeners()
          obsRef.current = null
        }
      } finally {
        isConnectingRef.current = false
      }
    },
    [
      setObsConnected,
      setError,
      setObsWebsocketUrl,
      setObsPort,
      setObsPassword,
      handleConnectionClosed,
      startHeartbeat,
    ]
  )

  const connect = useCallback(
    async (url?: string, port?: string | number, password?: string) => {
      const connectUrl = url || obsWebsocketUrl
      const connectPort = port?.toString() || obsPort
      const connectPassword = password || obsPassword

      if (!connectUrl || !connectPort) {
        console.log('Missing OBS connection details')
        return
      }

      await connectInternal(connectUrl, connectPort, connectPassword)
    },
    [obsWebsocketUrl, obsPort, obsPassword, connectInternal]
  )

  const attemptConnection = useCallback(async () => {
    if (isConnectingRef.current || obsRef.current?.identified) {
      return
    }

    let url = obsWebsocketUrl
    let port = obsPort
    let password = obsPassword

    // If credentials are not in Zustand, check localStorage
    if (!url || !port) {
      const storedConnectionInfo = localStorage.getItem('obsConnectionInfo')
      if (storedConnectionInfo) {
        const storedCredentials = JSON.parse(storedConnectionInfo)
        url = storedCredentials.obsWebsocketUrl
        port = storedCredentials.obsPort
        password = storedCredentials.obsPassword
      }
    }

    if (url && port) {
      await connectInternal(url, port, password)
    } else {
      console.log('No OBS connection details found')
    }
  }, [obsWebsocketUrl, obsPort, obsPassword, connectInternal])

  const disconnect = useCallback(async () => {
    stopHeartbeat()
    if (reconnectIntervalRef.current) {
      clearInterval(reconnectIntervalRef.current)
      reconnectIntervalRef.current = null
    }

    if (obsRef.current) {
      try {
        await obsRef.current.disconnect()
        console.log('Disconnected from OBS')
      } catch (err) {
        console.error('Error disconnecting from OBS:', err)
      } finally {
        if (obsRef.current) {
          obsRef.current.removeAllListeners()
          obsRef.current = null
        }
        setObsConnected(false)
        localStorage.removeItem('obsConnectionInfo')
      }
    } else {
      // If obsRef.current is null, ensure the state is updated
      setObsConnected(false)
      localStorage.removeItem('obsConnectionInfo')
    }
  }, [setObsConnected, stopHeartbeat])

  const getImageSources = useCallback(async () => {
    if (!obsRef.current?.identified) {
      setError('Not connected to OBS')
      return []
    }
    try {
      const { inputs } = (await obsRef.current.call('GetInputList')) as unknown as {
        inputs: OBSInput[]
      }
      return inputs
        .filter((input) => input.inputKind === 'image_source')
        .map((input) => input.inputName)
    } catch (err) {
      console.error('Failed to fetch image sources:', err)
      setError('Failed to fetch image sources')
      return []
    }
  }, [setError])

  // Effect to attempt connection and reconnection
  useEffect(() => {
    let isUnmounted = false

    const attemptConnectionAsync = async () => {
      await attemptConnection()
    }

    // Attempt initial connection
    attemptConnectionAsync()

    // Set up interval to attempt reconnection
    reconnectIntervalRef.current = setInterval(() => {
      if (isUnmounted) return

      if (!isConnectingRef.current && !obsRef.current?.identified) {
        attemptConnectionAsync()
      }
    }, reconnectInterval)

    return () => {
      isUnmounted = true
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current)
      }
      disconnect()
    }
  }, [attemptConnection, disconnect, reconnectInterval])

  return {
    obs: obsRef.current,
    connect,
    disconnect,
    getImageSources,
    error,
    isConnected: obsRef.current?.identified || false,
  }
}
