import { json } from "body-parser";
import { config } from "./config/configuration";
import express from "express";
import morgan from "morgan";
import { t } from "./i18n";
import { pingRouter } from "./routes/ping.route";

const app = express();

app.use(json());
app.use(morgan(config.app.env !== "prod" ? "dev" : "combined"));

app.use(t.init);

// Routes
app.use(pingRouter);

app.listen(config.app.port, () => {
  console.log("APP LISTENING PORT: " + config.app.port);
});
