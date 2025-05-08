import { msParsers } from "./msToText";

export class TimeParser {
  constructor() {}

  static fromMSToText(ms: number) {
    return msParsers.msParser.handle(ms);
  }

  static fromMSToSeg(ms: number) {
    return ms / 1000;
  }

  static fromMinToSeg(mins: number) {
    return mins * 60;
  }
}
