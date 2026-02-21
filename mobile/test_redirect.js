const { makeRedirectUri } = require('expo-auth-session');
console.log(makeRedirectUri({ useProxy: true }));
