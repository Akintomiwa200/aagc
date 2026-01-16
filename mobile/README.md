# Apostolic Army Global Church Mobile App

Native mobile application for Apostolic Army Global Church built with React Native and Expo.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the mobile directory (or use `app.config.js` for Expo):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   API_URL=http://localhost:3001
   SOCKET_URL=http://localhost:3001
   ```
   
   For client-side access, use `EXPO_PUBLIC_` prefix:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3001
   EXPO_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on specific platform:**
   ```bash
   # iOS (requires macOS and Xcode)
   npm run ios
   
   # Android (requires Android Studio)
   npm run android
   
   # Web
   npm run web
   ```

## Project Structure

- `app/` - Expo Router file-based routing
- `components/` - Reusable React Native components
- `context/` - React Context providers (Theme, Socket)
- `hooks/` - Custom React hooks
- `pages/` - Screen components
- `services/` - API and service integrations
- `assets/` - Images, fonts, and other static assets

## Key Features

- **Expo Router** - File-based routing system
- **Real-time Communication** - Socket.io integration
- **Theme Support** - Dark/Light mode
- **Secure Storage** - Expo Secure Store for sensitive data
- **Notifications** - Push notification support
- **Camera & Media** - Image picker and camera access
- **Location Services** - Location-based features
- **Network Status** - Network connectivity monitoring

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues:**
   ```bash
   npx expo start --clear
   ```

2. **Node modules issues:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS build issues:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Android build issues:**
   - Ensure Android SDK is properly installed
   - Check that `ANDROID_HOME` is set correctly

## Environment Variables

Environment variables can be set in:
- `.env` file (loaded by `app.config.js`)
- `app.config.js` directly
- Use `EXPO_PUBLIC_` prefix for client-side variables

## Building for Production

See [Expo documentation](https://docs.expo.dev/build/introduction/) for building production apps.

## License

MIT
