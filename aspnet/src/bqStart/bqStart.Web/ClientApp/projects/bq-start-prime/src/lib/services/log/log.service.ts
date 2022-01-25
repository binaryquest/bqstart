import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppInjector } from '../app-injector.service';
import moment from 'moment';


const PUBLISHERS_FILE = "/assets/log-publishers.json";

/**
 * Log Level Types
 *
 * @export
 * @enum {number}
 */
export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}


/**
 * Represents a Log Entry
 *
 * @export
 * @class LogEntry
 */
export class LogEntry {
  // Public Properties
  entryDate: Date = new Date();
  message: string = "";
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[];
  logWithDate: boolean = true;

  /**
   * Build the log entry as string
   *
   * @return {*}  {string}
   * @memberof LogEntry
   */
  buildLogString(): string {
    let value:string = "";

    if (this.logWithDate) {
      value = "[" +  moment().format("hh:mm:ss") + "] - ";
    }
    value += "[" + LogLevel[this.level] + "]";
    value += " - " + this.message;
    if (this.extraInfo !==undefined && this.extraInfo !== null && this.extraInfo.length > 0) {
      value += " - Extra Info: "
        + this.formatParams(this.extraInfo);
    }

    return value;
  }

  buildLogStringWithoutExtra(): string {
    let value:string = "";

    if (this.logWithDate) {
      value = "[" +  moment().format("hh:mm:ss") + "] - ";
    }
    value += "[" + LogLevel[this.level] + "]";
    value += " - " + this.message;

    return value;
  }

  private formatParams(params: any[]): string {
    let ret:string = params.join(",");

    // Is there at least one object in the array?
    if (params.some(p => typeof p == "object")) {
      ret = "";
      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }

    return ret;
  }
}


/**
 * Log Service class to write log entry. It will be published
 * to the configured publishers
 *
 * @export
 * @class LogService
 */
@Injectable({providedIn: 'root'})
export class LogService {


  constructor(protected publishersService: LogPublishersService) {
  }

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  /**
   * Publish Debug Log
   *
   * @param {string} msg
   * @param {...any[]} optionalParams
   * @memberof LogService
   */
  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  /**
   * Publish Info Message
   *
   * @param {string} msg
   * @param {...any[]} optionalParams
   * @memberof LogService
   */
  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  /**
   * Publish Warning Message
   *
   * @param {string} msg
   * @param {...any[]} optionalParams
   * @memberof LogService
   */
  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  /**
   * Publish Error Message
   *
   * @param {string} msg
   * @param {...any[]} optionalParams
   * @memberof LogService
   */
  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  /**
   * Publish Fatal Error Message
   *
   * @param {string} msg
   * @param {...any[]} optionalParams
   * @memberof LogService
   */
  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  /**
   * Publish General Log Entry
   *
   * @param {string} msg
   * @param {...any[]} optionalParams
   * @memberof LogService
   */
  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  /**
   * Clear Logs
   *
   * @memberof LogService
   */
  clear(): void {
    for (let logger of this.publishersService.publishers) {
      logger.clear()
        .subscribe(response => console.log(response));
    }
  }

  protected shouldLog(level: LogLevel): boolean {
    let ret: boolean = false;

    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      ret = true;
    }

    return ret;
  }

  protected writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      // Declare variables
      let entry: LogEntry = new LogEntry();

      // Build Log Entry
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (let logger of this.publishersService.publishers) {
        logger.log(entry)
        .subscribe(_ => {});
      }
    }
  }
}

let _singleton: InternalLogService | null = null;
@Injectable()
export class InternalLogService extends LogService {

  constructor(protected publishersService: LogPublishersService){
    super(publishersService);
  }

  protected writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      // Declare variables
      let entry: LogEntry = new LogEntry();

      // Build Log Entry
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (let logger of this.publishersService.publishers.filter(p => p.enableBqAdminLog)) {
        logger.log(entry)
          .subscribe(_ => {});
      }
    }
  }

  static logger():LogService{
    if (!_singleton){
      _singleton = AppInjector.getInjector().get(InternalLogService);
    }
    return _singleton;
  }
}

/**
 * Publisher Config
 * @export
 * @class LogPublisherConfig
 */
 export class LogPublisherConfig {
  loggerName: string;
  loggerLocation: string;
  isActive: boolean;
  enableBqAdminLog: boolean;
}



/**
 * Abstract base log publisher class. You can extend this if you want
 * to provide custom publishers
 *
 * @export
 * @abstract
 * @class LogPublisher
 */
 export abstract class LogPublisher {
  location: string;
  enableBqAdminLog: boolean;

  abstract log(record: LogEntry): Observable<boolean>
  abstract clear(): Observable<boolean>;
}

/**
 * Console Log Publishers
 *
 * @export
 * @class LogConsole
 * @extends {LogPublisher}
 */
export class LogConsole extends LogPublisher {


  constructor(){
    super();
    console.log("%c📜 BQ-Start Console Logger",'font-variant: small-caps;font-weight: bold; font-size: 25px;color: #4AA775; text-shadow: 1px 1px 0 rgb(217,31,38) , 3px 3px 0 rgb(226,91,14) , 6px 6px 0 rgb(245,221,8)');
  }

  log(entry: LogEntry): Observable<boolean> {

    switch (entry.level) {
      case LogLevel.All:
        this.output(entry.buildLogStringWithoutExtra(), '', entry.extraInfo);
        break;
      case LogLevel.Debug:
        this.output(entry.buildLogStringWithoutExtra(), 'color:#6B675E', entry.extraInfo);
        break;
      case LogLevel.Info:
        this.output(entry.buildLogStringWithoutExtra(), 'color:#4A82A7', entry.extraInfo);
        break;
      case LogLevel.Warn:
        this.output(entry.buildLogStringWithoutExtra(), 'color:#A37D25', entry.extraInfo);
        break;
      case LogLevel.Error:
        this.output(entry.buildLogStringWithoutExtra(), 'color:#DA2620', entry.extraInfo);
        break;
      case LogLevel.Fatal:
        this.output(entry.buildLogStringWithoutExtra(), 'color:#6B0606', entry.extraInfo);
        break;
      case LogLevel.Off:
        break;
      default:
        // Log to console
        console.log(entry.buildLogString());
        break;
    }

    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();

    return of(true);
  }

  private output(msg:string, css:string, params: any[]){
    if (params !== undefined && params !== null && params.length>0) {
      console.groupCollapsed("%c" + msg, css);
      console.log(params);
      console.trace();
      console.groupEnd();
    }else{
      console.log("%c" + msg, css);
    }
  }
}

/**
 * Saves Log to local Storage
 *
 * @export
 * @class LogLocalStorage
 * @extends {LogPublisher}
 */
export class LogLocalStorage extends LogPublisher {
  constructor() {
    // Must call super() from derived classes
    super();
    // Set location
    this.location = "logging";
  }

  // Append log entry to local storage
  log(entry: LogEntry): Observable<boolean> {
    let ret: boolean = false;
    let values: LogEntry[];

    try {
      // Retrieve previous values from local storage
      values = JSON.parse(localStorage.getItem(this.location) || '{}') || [];
      // Add new log entry to array
      values.push(entry);
      // Store array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));

      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.log(ex);
    }

    return of(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}


/**
 * Configure Log Publishers With this service
 *
 * @export
 * @class LogPublishersService
 */
@Injectable(
  {providedIn: "root"}
)
export class LogPublishersService {

  private _publishers: LogPublisher[] = [];

  constructor(private http:HttpClient) {
    this.buildPublishers();
  }

  /**
   * Default Log Publishers
   *
   * @readonly
   * @type {LogPublisher[]}
   * @memberof LogPublishersService
   */
  public get publishers(): LogPublisher[] {
    return this._publishers;
  }

  /**
   * Build Publishers from Config File
   *
   * @memberof LogPublishersService
   */
  buildPublishers(): void {

    let logPub: LogPublisher;
    this._publishers = [];

    this.getLoggers().subscribe(response => {
      for (let pub of response.filter(p => p.isActive)) {

        switch (pub.loggerName.toLowerCase()) {
          case "console":
            logPub = new LogConsole();
            break;
          case "localstorage":
            logPub = new LogLocalStorage();
            break;
          default:
            console.log(`unknown log service type ${pub.loggerName}`);
            continue;
        }

        // Set location of logging
        logPub.location = pub.loggerLocation;
        logPub.enableBqAdminLog = pub.enableBqAdminLog;

        // Add publisher to array
        this.publishers.push(logPub);
      }
    }, (err) => this.handleErrors(err));
  }

  addPublisher(pub: LogPublisher){
    this.publishers.push(pub);
  }

  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get<LogPublisherConfig[]>(PUBLISHERS_FILE);
  }

  private handleErrors(error: any) {

    let errors: string[] = [];
    let msg: string = "";

    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    if (error) {
      msg += " - Exception Message: " + error;
    }
    errors.push(msg);

    console.error('An error occurred', errors);
  }
}
