import * as express from 'express';
import { clientConfiguration } from '../../../services/ClientConfiguration';

export function getConfig(request: express.Request, response: express.Response): void {
  const headers = {
    'Cache-Control': 'no-cache, must-revalidate',
  };

  try {
    response
      .set(headers)
      .jsonp(clientConfiguration ? clientConfiguration.getConfiguration() : {});
  } catch (e) {
    response.set(headers).jsonp({error: true});
  }
}
