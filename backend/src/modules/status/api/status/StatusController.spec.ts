import assert = require('assert');
import http = require('http');
import express = require('express');
import { StatusController } from './StatusController';
import { ILogger } from '../../model/ILogger';
import { getNewTestServerPort } from '../../../../utils/getNewTestServerPort';


let server;
const port = getNewTestServerPort();

before(() => {
  server = express()
    .get('/portal/status', new StatusController(console as ILogger, () => null, () => null).handler)
    .listen(port);
});

after(() => server.close());

describe('StatusController', () => {

  it('should return 200', done => {

    const unauthorizedOptions = {
      host: '127.0.0.1',
      port: port,
      path: '/portal/status',
      method: 'GET',
      headers: {},
    };

    http.get(unauthorizedOptions, function (cloudResponse: http.IncomingMessage) {
      let bodyString = '';
      cloudResponse.on('data', (chunk) => bodyString += chunk);
      cloudResponse.on('end', () => {
        const result = JSON.parse(bodyString);

        assert.equal(cloudResponse.statusCode, 200);
        assert.equal(result.buildTimestamp, 'UNKNOWN');
        assert.equal(result.deployTimestamp, 'UNKNOWN');
        assert.equal(result.lastCommit, 'UNKNOWN');
        assert.equal(result.serviceName, 'UNKNOWN');
        assert.equal(result.status, 'buildInfoMissing');
        assert.equal(result.version, 'UNKNOWN');
        assert(result.startTimestamp);
        done();
      });
    });
  });
});
