export class DiscordUnexpectedError extends Error {
  err: unknown | null;
  constructor(err: unknown = null) {
    super("Discord interaction unexpected error");
    this.err = err;
  }

  toString() {
    console.log({ type: this.message, error: this.err });
  }
}
