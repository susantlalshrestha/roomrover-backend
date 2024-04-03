import { inspect } from "util";

module Logger {
  export const error = (...args: any[]): void => {
    args = args.map((arg) => inspect(arg, false, null, true));
    console.error(...args);
  };

  export const log = (...args: any[]): void => {
    args = args.map((arg) => inspect(arg, false, null, true));
    console.log(...args);
  };

  export const warn = (...args: any[]): void => {
    args = args.map((arg) => inspect(arg, false, null, true));
    console.warn(...args);
  };
}

export default Logger;
