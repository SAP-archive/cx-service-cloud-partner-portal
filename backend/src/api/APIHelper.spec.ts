import { ApiHelper, StatusCode } from './APIHelper';
import assert = require('assert');
import * as express from 'express';
import { clientConfigService, ClientConfiguration } from '@modules/common';
import sinon = require('sinon');
import { ClientError } from 'interfaces/ClientError';
import logger = require('../services/LoggerService');

const exampleConfiguration = (): ClientConfiguration => ({
  backendClusterDomain: 'google.com',
  backendClusterPort: '433',
  clientIdentifier: 'partner-portal',
  clientSecret: 'i-wont-tell-you',
  clientVersion: '1.0.0',
  debug: true,
  directoryServiceUrl: 'http://service.directory.net',
});

const requestFactory = ({
  clientIdentifier = 'partner-portal',
} = {}): Partial<express.Request> => {
  return {
    headers: {
      'X-Client-Id': clientIdentifier,
    }
  };
};

let mockResponse: {
  json: sinon.SinonSpy;
  status: sinon.SinonSpy;
};

describe('APIHelper', () => {
  describe('processError()', () => {
    beforeEach(() => {
      mockResponse = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
    });

    it('send error response', () => {
      const error: ClientError = {code: 400, message: 'Test error'};
      ApiHelper.processError(mockResponse as any, error);
      assert(mockResponse.json.called, 'json() was not called');
      assert.deepEqual(mockResponse.json.lastCall.args, [{message: error.message, details: undefined}], 'incorrect response content');
      assert(mockResponse.status.called, 'status() was not called');
      assert.deepEqual(mockResponse.status.lastCall.args, [error.code], 'incorrect status parameter');
    });

    it('returns generic error if not specified', () => {
      ApiHelper.processError(mockResponse as any);
      assert(mockResponse.json.called, 'json() was not called');
      assert.deepEqual(mockResponse.json.lastCall.args, [{message: 'BACKEND_ERROR_UNEXPECTED'}], 'incorrect response content');
      assert(mockResponse.status.called, 'status() was not called');
      assert.deepEqual(mockResponse.status.lastCall.args, [StatusCode.INTERNAL_ERROR], 'incorrect status parameter');
    });

    it('sends no response when asked not to', () => {
      const error: ClientError = {code: 400, message: 'Test error'};
      ApiHelper.processError(mockResponse as any, error, false);
      assert(!mockResponse.json.called, 'json() was called');
      assert(!mockResponse.status.called, 'status() was called');
    });

    it('logs some message to the console', () => {
      const error: ClientError = {code: 400, message: 'Test error'};
      const loggerSpy = sinon.spy(logger, 'error');
      ApiHelper.processError(mockResponse as any, error, false);
      assert(loggerSpy.called, 'console.error has not been called');
      assert.deepEqual(loggerSpy.lastCall.args, ['Unexpected Internal Error'], 'console.error not called with correct message');
      loggerSpy.restore();
    });
  });

  describe('isPublicClientRequest()', () => {
    it('returns true if not coming from partner-portal client', () => {
      clientConfigService.setConfig(exampleConfiguration());
      const request = requestFactory({clientIdentifier: 'test'});
      assert.equal(ApiHelper.isPublicClientRequest(request as any), true);
    });

    it('returns false if coming from partner-portal client', () => {
      clientConfigService.setConfig(exampleConfiguration());
      const request = requestFactory();
      assert.equal(ApiHelper.isPublicClientRequest(request as any), false);
    });
  });
});
