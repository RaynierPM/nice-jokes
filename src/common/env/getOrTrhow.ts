import { EnvError } from "../../errors/envError";

export function getOrThrow(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new EnvError(`${key} not founded`);
  }

  return value;
}
