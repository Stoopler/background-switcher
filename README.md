# Background Changer

Background Changer is a desktop application that integrates with Twitch, OBS, and image generation APIs to change the background image of a specific OBS source based on Twitch channel point redemptions.

## Current Functionality

- Twitch OAuth integration:
  - Login and logout functionality
  - Display of user profile information
- OBS WebSocket connection:
  - Configurable WebSocket URL, port, and password
  - Connection status display
  - Option to choose between Image Source and Browser Source
  - For Image Source: Ability to list and select image sources from OBS
  - For Browser Source: Generates a static URL for use in OBS
- Twitch Channel Point Reward management:
  - Create, update, enable/disable, and delete custom rewards
  - Configure reward title, cost, and prompt
- Settings dialog for configuring Twitch, OBS, and Channel Point Reward settings
- Persistent storage of settings using local storage

## Outstanding Features

- OpenAI (or alternative image generation API) integration:
  - Configurable API endpoint selection
  - API key input
  - Prompt configuration
  - Image size selection
- Image generation based on channel point redemptions
- Automatic updating of OBS image source with generated images
- Web server for displaying generated images as a browser source in OBS
- Browser source URL display for easy copying into OBS

## How to Run the Current Implementation

1. Clone the repository:   ```
   git clone https://github.com/Stoopler/background-switcher.git
   cd background-changer   ```

2. Install dependencies:   ```
   npm install   ```

3. Create a `.env.local` file in the root directory with the following content:   ```
   NEXT_PUBLIC_TWITCH_CLIENT_ID=your_twitch_client_id
   TWITCH_CLIENT_SECRET=your_twitch_client_secret   ```
   Replace `your_twitch_client_id` and `your_twitch_client_secret` with your actual Twitch application credentials.

4. Run the development server:   ```
   npm run dev   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Configuration

1. Click the "Settings" button in the top menu to open the settings dialog.
2. In the Twitch Auth section, click "Connect" to authenticate with Twitch.
3. In the OBS Config section, enter your OBS WebSocket details and click "Connect".
4. In the Channel Point Config section, set up your custom reward for background changing.

## Notes

- This application is currently in development and not all features are implemented.
- Ensure you have OBS running with the WebSocket server enabled before attempting to connect.
- You need to have a Twitch Developer application set up to use the Twitch integration features.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
