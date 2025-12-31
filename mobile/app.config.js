export default ({ config }) => ({
  ...config,
  extra: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
});
