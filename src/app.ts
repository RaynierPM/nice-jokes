import { json } from "body-parser";
import { config } from "./config/configuration";
import express from "express";
import morgan from "morgan";
import { t } from "./i18n";
import { scaffoldRoutes } from "./routes";

console.log({ config });

const app = express();

app.use(json());
app.use(morgan(config.app.env !== "prod" ? "dev" : "combined"));

app.use(t.init);

// Routes
scaffoldRoutes(app);

app.listen(config.app.port, () => {
  console.log("APP LISTENING PORT: " + config.app.port);
});
