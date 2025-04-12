import { json } from "body-parser";
import { config } from "./config/configuration";
import express from "express";
import morgan from "morgan";
import { t } from "./i18n";
import { scaffoldRoutes } from "./routes";
import { readFileSync } from "fs";
import https from "https";
import { handleDiscordError } from "./common/middlewares/discordErrorHandler";

console.log({ config });

const app = express();

app.use(json());
app.use(morgan(config.app.env !== "prod" ? "dev" : "combined"));

app.use(t.init);

// Routes
scaffoldRoutes(app);

// Discord error handler
app.use(handleDiscordError);

if (config.app.https && config.https.cert && config.https.key) {
  const options = {
    key: readFileSync(config.https.key),
    cert: readFileSync(config.https.cert),
  };
  https.createServer(options, app).listen(config.app.port, () => {
    console.log("APP LISTENING PORT: " + config.app.port);
  });
} else {
  app.listen(config.app.port, () => {
    console.log("APP LISTENING PORT: " + config.app.port);
  });
}
