export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    apiUrl: process.env.API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.106:3001',
    socketUrl: process.env.SOCKET_URL || process.env.EXPO_PUBLIC_SOCKET_URL || 'http://192.168.1.106:3001',
  },
});
