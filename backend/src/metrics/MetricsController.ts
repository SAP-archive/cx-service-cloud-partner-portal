import express = require('express');

/**
 * You can use this controller to export metrics about your application, for example for Prometheus to consume.
 * It is highly recommended to hide them behind some authentication (like HTTP basic Auth)
 */
export class MetricsController {
  public static async getMetrics(req: express.Request, res: express.Response, next: Function) {
    res.end();
    next();
  }
}
