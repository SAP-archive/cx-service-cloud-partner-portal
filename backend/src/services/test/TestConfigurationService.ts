/// <reference path='../../../typings.d.ts' />
import _ = require('underscore');

import appConfig = require('../AppConfiguration');

/* tslint:disable:no-console */

const DATA_CLOUD_HOST = 'dc.mock.coresuite.com';
const DATA_CLOUD_PORT = 8888;
const CONFIG = {
  'dataCloudHost': DATA_CLOUD_HOST,
  'dataCloudPort': DATA_CLOUD_PORT,
  'listenPort': 8000,
  'mode': 'test',
  'directoryService': 'https://dc.mock.coresuite.com:8888',
  'auth': {
    'oauthUrl': 'https://dc.mock.coresuite.com:8888/api/oauth2/v1/',
    'clientId': 'test',
    'clientSecret': 'secret',
  },
  'realTimeRetryWaitTimeMS': 1,
};

appConfig.loadFromObject(CONFIG);

import { VaultService } from '../VaultService';
import { ClientRequestArgs } from 'http';

class TestConfigurationService {

  public static dataCloudHost = DATA_CLOUD_HOST;
  public static dataCloudPort = DATA_CLOUD_PORT;

  public static HEADERS = {
    'x-cloud-account-id': '1',
    'x-cloud-account-name': 'account-name',
    'x-cloud-company-id': '2',
    'x-cloud-company-name': 'company-name',
    'x-cloud-user-name': 'user-name',
    'x-cloud-user-id': '3',
    'x-cloud-host': 'https://my.host',
    authorization: 'bearer myToken',
    'content-type': 'application/json',
  };

  public static readonly requestQuerySuffix = (prefix: '?' | '&' = '?') =>
    `${prefix}account=${TestConfigurationService.HEADERS['x-cloud-account-name']}&user=${TestConfigurationService.HEADERS['x-cloud-user-name']}&company=${TestConfigurationService.HEADERS['x-cloud-company-name']}`;

  public static configureAppForTesting(options?: { [key: string]: string }) {
    TestConfigurationService.mockEnvVariables();
    VaultService.initializeEnvVars();

    options = options || {};
    appConfig.loadFromObject(_.extend({}, CONFIG, {
      mode: options.mode || 'test',
    }));
  }

  private static mockEnvVariables() {
    process.env.PROMETHEUS_USERNAME = 'username';
    process.env.PROMETHEUS_PASSWORD = 'password';
    process.env.CLIENT_IDENTIFIER = 'my-app';
    process.env.CLIENT_SECRET = 'my-secret';
    process.env.CLIENT_APP_CLUSTER = 'ET';
  }
}

const http = require('http');
const nock = require('nock');
const nock_http_ClientRequest = http.ClientRequest;
nock.missingRequestHandler = nock.missingRequestHandler ? nock.missingRequestHandler : (value) => {
  return value;
};
nock.interceptorsListHandler = nock.interceptorsListHandler ? nock.interceptorsListHandler : (interceptors) => {
  let missingRequest = [];
  if (interceptors.length) {
    if (nock.interceptorsListHandler.missingRequest) {
      missingRequest = nock.interceptorsListHandler.missingRequest.split('?')[0].split('/').slice(3);
    }
    console.log('\t>>> Registered nock interceptors:');
    interceptors.map(function (interceptor: any) {
      return {
        path: interceptor._key.split('/').slice(3),
        lineNumber: interceptor.__nock_scope.lineNumber,
      };
    }).sort(function (i1: { path: string[] }, i2: { path: string[] }) {
      const a = i1.path.slice();
      const b = i2.path.slice();
      let aIndex = 0;
      let bIndex = 0;
      if (a.length) {
        a[a.length - 1] = a[a.length - 1].split('?')[0];
        a.some(function (part: string, index: number) {
          if (missingRequest[index] !== part) {
            return true;
          }
          aIndex = index;
        });
      }
      if (b.length) {
        b[b.length - 1] = b[b.length - 1].split('?')[0];
        b.some(function (part: string, index: number) {
          if (missingRequest[index] !== part) {
            return true;
          }
          bIndex = index;
        });
      }
      return aIndex < bIndex;
    }).forEach(function (interceptor: { path: string[], lineNumber: string }) {
      let matchIndex = 0;
      const interceptorUrl = '/' + interceptor.path.join('/');
      if (interceptor.path.length) {
        interceptor.path[interceptor.path.length - 1] = interceptor.path[interceptor.path.length - 1].split('?')[0];
        interceptor.path.some(function (part: string, index: number) {
          if (missingRequest[index] !== part) {
            return true;
          }
          matchIndex = index;
        });
        let lineNumber = '';
        if (interceptor.lineNumber) {
          lineNumber = ':' + interceptor.lineNumber;
        }
        console.log('\t>>> [' + (++matchIndex) + ']' + lineNumber, interceptorUrl);
      } else {
        console.log('\t>>> base url');
      }
    });
    console.log(' ');
  }
};

Object.keys(require.cache).forEach(key => {
  if (/\/nock\/node_modules\/lodash\/dist\/lodash\.js$/.test(key)) {
    const lodash = require.cache[key].exports;
    const lodash_every = lodash.every;
    const defaultInterceptorRe = new RegExp(':' + TestConfigurationService.dataCloudPort + '$');
    lodash.every = function (list: { [key: string]: any }, callback: Function) {
      const caller = new Error().stack.split('\n').slice(2)[0];
      const interceptors = [];
      if (caller && /isDone$/.test(caller.trim().split(' ')[1])) {
        for (const listKey in list) {
          if (!list.hasOwnProperty(listKey)) {
            continue;
          }
          nock.interceptorsListHandler(list[listKey].filter(function (interceptor: { _key: string }) {
            return !defaultInterceptorRe.test(interceptor._key);
          }));
        }
      }
      return lodash_every(list, callback);
    };
  } else if (/\/nock\/index\.js$/.test(key)) {
    const nock_lib = require.cache[key].exports;
    const nock_proxy = function () {
      let stack = new Error().stack.split('\n');
      const interceptor = nock_lib.apply(null, [].slice.call(arguments));
      stack = stack.filter(function (call: string) {
        return !/node_modules/.test(call) && /\.spec\.js[^\/]+$/.test(call);
      });
      if (stack[0]) {
        const match = stack[0].match(/(\.spec\.js:[0-9]+)/);
        if (match) {
          const lineNumber = match[0].split(':')[1];
          interceptor.lineNumber = lineNumber;
        }
      }
      return interceptor;
    };
    for (const prop in nock_lib) {
      if (!nock_lib.hasOwnProperty(prop)) {
        continue;
      }
      nock_proxy[prop] = nock_lib[prop];
    }
    require.cache[key].exports = nock_proxy;
  }
});

let counter = 0;
http.ClientRequest = function (options: ClientRequestArgs) {
  const req = new nock_http_ClientRequest(options);
  const separator = new Array(81).join('=');
  const separatorChars = separator.split('');
  req.on('error', function (error: Error) {
    const separatorTitle = ' ' + (++counter) + ' ';
    const separatorTitleIndex = Math.floor(separatorChars.length / 2) - Math.floor(separatorTitle.length / 2);
    const separatorTitleEndPosition = separatorTitleIndex + separatorTitle.length;
    let i = separatorTitleIndex, j = 0;
    while (i < separatorTitleEndPosition && j < separatorTitle.length) {
      separatorChars[i] = separatorTitle[j];
      i++;
      j++;
    }
    console.log(separatorChars.join(''));
    console.log('\tNock request error', error);
    const errorParts = error.toString().split(' ');
    const missingRequest = [errorParts[6], errorParts[7]].join(' ');
    nock.missingRequestHandler(missingRequest);
    nock.interceptorsListHandler.missingRequest = missingRequest;
    nock.isDone();
    console.log(separator);
    console.log(' ');
  });
  return req;
};
nock('https://' + TestConfigurationService.dataCloudHost + ':' + TestConfigurationService.dataCloudPort, {
  requireDone: false,
}).get('/').reply(0, {'TestConfigurationService.ts': 'Nock library always has an interceptor.'});

export = TestConfigurationService;
