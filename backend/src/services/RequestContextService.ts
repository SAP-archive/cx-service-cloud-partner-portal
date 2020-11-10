import cls = require('cls-hooked');
import { IAppHeaders } from '../models/IAppHeaders';
import Credentials = require('../models/Credentials');

interface INamespaceBase {
  run(callback: () => void): any;
  set<T>(key: string, value: T): T;
  get(key: string): any;
  bind(callback: () => void, context?: any): any;
}

interface IRequestParams {
  requestPath: string;
  requestMethod: string;
  traceId?: string;
  spanId?: string;
  sampledValue?: number;
}

const cloudHostWhiteList = [
  'et.dev.coresuite.com',
  'qt.dev.coresuite.com',
  'pt.dev.coresuite.com',
  'dt.dev.coresuite.com',
  'sb.dev.coresuite.com',
  'de.coresuite.com',
  'eu.coresuite.com',
  'us.coresuite.com',
  'cn.coresuite.cn',
  'au.coresuite.com',
];

class RequestContextService {
  private appNameSpace: INamespaceBase;
  private readonly REQUEST_ID = 'requestID';
  private readonly CLIENT_ID = 'clientID';
  private readonly CLIENT_VERSION = 'clientVersion';
  private readonly START = 'start';
  private readonly REQUEST_PATH = 'requestPath';
  private readonly REQUEST_METHOD = 'requestMethod';
  private readonly REQUEST_TRACE_ID = 'requestTraceId';
  private readonly REQUEST_SPAN_ID = 'requestSpanId';
  private readonly REQUEST_SAMPLED_VALUE = 'requestSampledValue';
  private readonly CREDENTIALS = 'credentials';
  private readonly FORWARDED_FOR = 'forwardedFor';
  private readonly CLOUD_HOST = 'cloudHost';
  private readonly NO_TOKEN_PROLONGATION = 'noTokenProlongation';

  constructor() {
    this.appNameSpace = cls.createNamespace('partner-portal');
  }

  public save(credentials: Credentials, requestParams: IRequestParams, appHeaders: IAppHeaders, cb: Function) {
    this.appNameSpace.run(() => {
      this.appNameSpace.set(this.REQUEST_ID, appHeaders.requestId);
      this.appNameSpace.set(this.CLIENT_ID, appHeaders.clientId);
      this.appNameSpace.set(this.CLIENT_VERSION, appHeaders.clientVersion);
      this.appNameSpace.set(this.START, new Date());
      this.appNameSpace.set(this.REQUEST_PATH, requestParams.requestPath);
      this.appNameSpace.set(this.REQUEST_METHOD, requestParams.requestMethod);
      this.appNameSpace.set(this.REQUEST_TRACE_ID, requestParams.traceId);
      this.appNameSpace.set(this.REQUEST_SPAN_ID, requestParams.spanId);
      this.appNameSpace.set(this.REQUEST_SAMPLED_VALUE, requestParams.sampledValue);
      this.appNameSpace.set(this.CREDENTIALS, credentials);
      this.appNameSpace.set(this.FORWARDED_FOR, appHeaders.forwardedFor);
      this.appNameSpace.set(this.CLOUD_HOST, this.ensureSaveCloudHost(appHeaders.cloudHost));
      this.appNameSpace.set(this.NO_TOKEN_PROLONGATION, appHeaders.noTokenProlongation);

      cb();
    });
  }

  public returnValue(key: string) {
    return this.appNameSpace.get(key);
  }

  public getRequestId(): string {
    return this.appNameSpace.get(this.REQUEST_ID);
  }

  public getRequestTraceId(): string {
    return this.appNameSpace.get(this.REQUEST_TRACE_ID);
  }

  public getRequestSpanId(): string {
    return this.appNameSpace.get(this.REQUEST_SPAN_ID);
  }

  public getRequestSampledValue(): string {
    return this.appNameSpace.get(this.REQUEST_SAMPLED_VALUE);
  }

  public getRequestMethod(): string {
    return this.appNameSpace.get(this.REQUEST_METHOD);
  }

  public getClientId(): string {
    return this.appNameSpace.get(this.CLIENT_ID);
  }

  public getClientVersion(): string {
    return this.appNameSpace.get(this.CLIENT_VERSION);
  }

  public getRequestPath(): string {
    return this.appNameSpace.get(this.REQUEST_PATH);
  }

  public getCredentials() {
    return this.appNameSpace.get(this.CREDENTIALS);
  }

  public setCredentials(credentials: Credentials) {
    return this.appNameSpace.set(this.CREDENTIALS, credentials);
  }

  public getStartTimestamp(): Date {
    return this.appNameSpace.get(this.START);
  }

  public bindCallback(callback: Function) {
    return this.appNameSpace.bind(callback as any);
  }

  public getForwardedFor(): string {
    return this.appNameSpace.get(this.FORWARDED_FOR);
  }

  public getCloudHost(): string {
    return this.appNameSpace.get(this.CLOUD_HOST);
  }

  public isNoTokenProlongation(): boolean {
    const value: undefined | string | boolean = this.appNameSpace.get(this.NO_TOKEN_PROLONGATION);
    return value && ((typeof value === 'string' && value === 'true') || value === true);
  }

  public ensureSaveCloudHost(headerString: string): string {
    const target = headerString.trim().toLowerCase();

    if (!target) {
      return '';
    }

    if (!Array.isArray(cloudHostWhiteList) || cloudHostWhiteList.indexOf(target) === -1) {
      return '';
    }

    return headerString;
  }
}

export const requestContextService = new RequestContextService();
