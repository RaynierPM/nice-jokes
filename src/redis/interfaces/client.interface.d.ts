type setConfig = {
  TTL?: number; // On minutes
};

interface RedisClientInterface {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: object | string,
    setConfig?: setConfig,
  ): Promise<void>;
  del(key: string): Promise<boolean>;
  init(): Promise<void>;
}
