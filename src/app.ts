import { raw } from "body-parser";
import { config } from "./config/configuration";
import express from "express";
import morgan from "morgan";
import { t } from "./i18n";
import { scaffoldRoutes } from "./routes";
import { readFileSync } from "fs";
import https from "https";
import { handleDiscordError } from "./common/middlewares/discordErrorHandler";
import path from "path";
import { unexpectedErrorHandler } from "./common/middlewares/unexpectedErrorHandler";
import { RedisManager } from "./redis";

const app = express();

app.use(raw());
app.use(
  morgan(config.app.env?.toLocaleLowerCase() !== "prod" ? "dev" : "combined"),
);

app.use(t.init);

// Routes
scaffoldRoutes(app);

// Discord error handler
app.use(handleDiscordError);
app.use(unexpectedErrorHandler);

// Check if translations are available
fetch(config.translations.translationAPIURL)
  .then(() => (config.translations.isAvailable = true))
  .catch(() => (config.translations.isAvailable = false));

RedisManager.init();

if (config.app.https && config.https.fullChain && config.https.key) {
  const options = {
    key: readFileSync(path.join(process.cwd(), ".ssl/", config.https.key)),
    cert: readFileSync(
      path.join(process.cwd(), ".ssl/", config.https.fullChain),
    ),
  };
  https.createServer(options, app).listen(config.app.port, () => {
    console.log("APP LISTENING PORT: " + config.app.port);
    console.log("With HTTPS built-in");
  });
} else {
  app.listen(config.app.port, () => {
    console.log("APP LISTENING PORT: " + config.app.port);
    console.log("Without HTTPS built-in");
  });
}
