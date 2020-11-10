import request = require('request');
import assert = require('assert');

type assertResponseCallback = (body: any, header?: { [key: string]: string }) => void;

export class Tester {

  private defaults: any;
  private options: any;
  private assertResponseCallback: assertResponseCallback;

  constructor(defaults: any) {
    this.defaults = defaults;
    this.reset();
  }

  public get(path: string): Tester {
    this.requestAfterMethodCallChainEnds('get', path);
    return this;
  }

  public post(path: string): Tester {
    this.requestAfterMethodCallChainEnds('post', path);
    return this;
  }

  public put(path: string): Tester {
    this.requestAfterMethodCallChainEnds('put', path);
    return this;
  }

  public patch(path: string): Tester {
    this.requestAfterMethodCallChainEnds('patch', path);
    return this;
  }

  public delete(path: string): Tester {
    this.requestAfterMethodCallChainEnds('delete', path);
    return this;
  }

  public to(url: string, port: string): Tester {
    this.options.url = url;
    this.options.port = port;
    return this;
  }

  public with(entity: string, value: any): Tester {
    if (!this.options.entities) {
      this.options.entities = {};
    }
    this.options.entities[entity] = value;
    return this;
  }

  public send(body: string | object | null): Tester {
    if (body && typeof body !== 'string') {
      body = JSON.stringify(body);
    }
    this.options.body = body;
    return this;
  }

  public expectStatus(statusCode: number): Tester {
    this.options.expectedStatusCode = statusCode;
    return this;
  }

  public assertResponse(callback: assertResponseCallback): Tester {
    if (!callback) {
      throw new Error(`Assert response takes a callback function as an argument.`);
    }
    this.assertResponseCallback = callback;
    return this;
  }

  public reset(): Tester {
    if (!this.defaults.expectedStatusCode) {
      this.defaults.expectedStatusCode = 200;
    }
    this.options = JSON.parse(JSON.stringify(this.defaults));
    this.assertResponse(() => undefined);
    return this;
  }

  private requestAfterMethodCallChainEnds(method: 'get' | 'delete' | 'patch' | 'post' | 'put', path: string) {
    if (!request[method]) {
      throw new Error(`Method ${method} is not supported.`);
    }
    setImmediate(() => {
      assert(this.options.url, 'Missing url value for the test request.');
      const makeRequest: Function = request[method];
      const options: any = {};
      options.uri = this.options.url;
      options.method = method.toUpperCase();
      if (this.options.port) {
        options.uri += ':' + this.options.port;
        options.port = this.options.port;
      }
      options.uri += path;
      if (this.options.body) {
        options.body = this.options.body;
      }
      if (this.options.entities) {
        if (this.options.entities.headers) {
          options.headers = this.options.entities.headers;
        }
      }
      options.headers = options.headers ? options.headers : {};
      options.headers['content-type'] = options.headers['content-type'] ? options.headers['content-type'] : 'application/json';
      makeRequest(options, (error, response, body) => {
        assert(!error, JSON.stringify(error));
        assert.equal(response.statusCode, this.options.expectedStatusCode, body);

        let parsedResponse: any = null;
        try {
          parsedResponse = response
          && response.headers['content-type']
          && response.headers[`content-type`].indexOf('json') > -1
            ? (body
              ? JSON.parse(body)
              : parsedResponse)
            : body;

        } catch (ex) {

          const errorObject = new Error(`[${body}]  ${(ex as Error).message} ${JSON.stringify(options, null, 2)} `);
          console.error(errorObject);
          parsedResponse = errorObject;

        }

        this.assertResponseCallback(parsedResponse, response.headers);
      });
    });
  }
}
