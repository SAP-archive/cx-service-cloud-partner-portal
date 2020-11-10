export interface ILogger {
  log(...args: any[]);
  info(...args: any[]);
  debug(...args: any[]);
  warn(...args: any[]);
  error(...args: any[]);
}
