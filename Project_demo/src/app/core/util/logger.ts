import { environment } from 'environments/environment';

export class logger {
  static logEnabled = true;
  static debugEnabled = !environment.production;
  static infoEnabled = !environment.production;
  static warnEnabled = true;
  static errorEnabled = true;

  static _log(message: any | (() => any), logger: ((message: any)=>void)) {
    if (typeof message === 'function') {
      message = message();
    }
    logger(message);
  }

  static log(message: any | (() => any)) {
    if (logger.logEnabled) {
      logger._log(message, console.log);
    }
  }

  static debug(message: any | (() => any)) {
    if (logger.debugEnabled) {
      logger._log(message, console.debug);
    }
  }

  static info(message: any | (() => any)) {
    if (logger.infoEnabled) {
      logger._log(message, console.info);
    }
  }

  static warn(message: any | (() => any)) {
    if (logger.warnEnabled) {
      logger._log(message, console.warn);
    }
  }

  static error(message: any | (() => any)) {
    if (logger.errorEnabled) {
      logger._log(message, console.error);
    }
  }

  static stopForDebugging() {
    if (logger.debugEnabled){
      debugger;
    }
  }
}

