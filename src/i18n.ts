import { I18n } from "i18n";
import path from "path";

export const t = new I18n({
  defaultLocale: "en",
  fallbacks: { "es-*": "es", "en-*": "en" },
  locales: ["en", "es"],
  directory: path.join(process.cwd(), "locales"),
  queryParameter: "lang",
});
