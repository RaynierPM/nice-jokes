import { EnvError } from "../../errors/envError";

export function getOrThrow(envs: NodeJS.ProcessEnv, key: string): string {
  const value = envs[key];

  if (!value) {
    throw new EnvError(`${key} not founded`);
  }

  return value;
}
