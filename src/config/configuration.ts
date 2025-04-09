export const config = {
  app: {
    env: process.env.ENV ?? "local",
    port: process.env.PORT || 3000,
  },
  discord: {
    appId: process.env.APP_ID,
    publicKey: process.env.PUBLIC_KEY,
    botKey: process.env.BOT_KEY,
  },
};
