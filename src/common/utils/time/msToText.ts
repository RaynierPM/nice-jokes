class TimeParserHandlerBase {
  #next: TimeParserHandlerBase | undefined;

  get next() {
    return this.#next;
  }

  set next(handler) {
    if (handler instanceof TimeParserHandlerBase) {
      this.#next = handler;
    }
  }

  /**
   *
   * @param {number} time Time (ms/s/min...)
   */
  handle(time: number): string {
    if (this.#next) return this.#next.handle(time);
    else return `${time} ms`;
  }
}

class MsTimeParser extends TimeParserHandlerBase {
  /**
   * @param {number} time Time on ms
   * @returns {string} Seg on string format E.g: 20seg
   */
  handle(time: number) {
    if (time < 1000) {
      return `${time} ms`;
    } else {
      return super.handle(time);
    }
  }
}

class SegTimeParser extends TimeParserHandlerBase {
  /**
   * @param {number} time Time on ms
   * @returns {string} Seg on string format E.g: 20seg
   */
  handle(time: number) {
    const timeToSeg = Math.round(time / 1000);
    if (timeToSeg < 60) {
      return `${timeToSeg} seg`;
    } else {
      return super.handle(time);
    }
  }
}

class MinTimeParser extends TimeParserHandlerBase {
  /**
   * @param {number} time Time on ms
   * @returns {string} Mins on string format E.g: 20min
   */
  handle(time: number) {
    const timeToMin = Math.round(time / (1000 * 60));
    if (timeToMin < 60) {
      return timeToMin > 1 ? `${timeToMin} mins` : `${timeToMin} min`;
    } else {
      return super.handle(time);
    }
  }
}

class HourTimeParser extends TimeParserHandlerBase {
  /**
   * @param {number} time Time on ms
   * @returns {string} Hours on string format E.g: 2hours
   */
  handle(time: number) {
    const timeToHour = Math.round(time / (1000 * 60 * 60));
    if (timeToHour < 24) {
      return timeToHour > 1 ? `${timeToHour} hour` : `${timeToHour} hours`;
    } else {
      return super.handle(time);
    }
  }
}

class DayTimeParser extends TimeParserHandlerBase {
  /**
   * @param {number} time Time on ms
   * @returns {string} Days on string format E.g: 2dias
   */
  handle(time: number) {
    const TimeToDay = Math.round(time / (1000 * 60 * 60 * 24));

    if (TimeToDay < 30) {
      return TimeToDay > 1 ? `${TimeToDay} days` : `${TimeToDay} day`;
    } else {
      return super.handle(time);
    }
  }
}

class MonthTimeParser extends TimeParserHandlerBase {
  /**
   * @param {number} time Time on ms
   * @returns {string} Months on string format E.g: 3 months
   */
  handle(time: number) {
    const timeToMonth = time / (1000 * 60 * 60 * 24 * 30);

    if (timeToMonth < 12) {
      return timeToMonth > 1 ? `${time} months` : `${time} month`;
    } else {
      return super.handle(time);
    }
  }
}

class YearTimeParser extends TimeParserHandlerBase {
  /**
   * @param {number} time Time on ms
   * @returns {string} Years on string format E.g: 3 years
   */
  handle(time: number) {
    const timeToYear = Math.floor(time / (1000 * 60 * 60 * 24 * 30 * 12));
    return timeToYear > 1 ? `${timeToYear} years` : `${timeToYear} year`;
  }
}
const msParser = new MsTimeParser();
const segParser = new SegTimeParser();
const minParser = new MinTimeParser();
const hourParser = new HourTimeParser();
const dayParser = new DayTimeParser();
const monthParser = new MonthTimeParser();
const yearParser = new YearTimeParser();
msParser.next = segParser;
segParser.next = minParser;
minParser.next = hourParser;
hourParser.next = dayParser;
dayParser.next = monthParser;
monthParser.next = yearParser;

export const msParsers = {
  msParser,
  segParser,
  minParser,
  hourParser,
  dayParser,
  monthParser,
};
