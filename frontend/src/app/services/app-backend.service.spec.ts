import { AppBackendService } from './app-backend.service';
import { of } from 'rxjs';
import { exampleAuthData } from '../auth-module/model/auth-data.model';
import { exampleAppConfig } from '../model/app-config.model';
import { environment } from '../../environments/environment';

describe('AppBackendService', () => {
  let appBackendService: AppBackendService, httpMock;
  const apiUrl = environment.appBackendUrl;
  const mockedResponse = 'mocked response from the service';
  const checkAuthData = (options: { headers: { [header: string]: string } }) => {
    expect(options.headers.Authorization).toEqual(exampleAuthData().authToken);
    expect(options.headers['X-Client-ID']).toEqual(exampleAppConfig().clientIdentifier);
    expect(options.headers['X-Client-Version']).toEqual(exampleAppConfig().version);
    expect(options.headers['X-Cloud-Account-Id']).toEqual(exampleAuthData().accountId.toString(10));
    expect(options.headers['X-Cloud-Account-Name']).toEqual(exampleAuthData().accountName);
    expect(options.headers['X-Cloud-Company-Id']).toEqual(exampleAuthData().companyId.toString(10));
    expect(options.headers['X-Cloud-Company-Name']).toEqual(exampleAuthData().companyName);
    expect(options.headers['X-Cloud-User-Id']).toEqual(exampleAuthData().userId.toString(10));
    expect(options.headers['X-Cloud-User-Name']).toEqual(exampleAuthData().userName);
  };

  beforeEach(() => {
    httpMock = {
      get: jasmine.createSpy().and.returnValue(mockedResponse),
      post: jasmine.createSpy().and.returnValue(mockedResponse),
      put: jasmine.createSpy().and.returnValue(mockedResponse),
      patch: jasmine.createSpy().and.returnValue(mockedResponse),
      delete: jasmine.createSpy().and.returnValue(mockedResponse),
    };
    const authFacadeMock = {authUserData: of(exampleAuthData())};
    const configFacadeMock = {appConfig: of(exampleAppConfig())};

    appBackendService = new AppBackendService(httpMock, authFacadeMock as any, configFacadeMock as any);
  });

  describe('get()', () => {
    const resourceUrl = '/resource';

    it('should call Http.get() once and forward its return value', () => {
      const result = appBackendService.get(resourceUrl);

      expect(httpMock.get.calledOnce).toBeTruthy;
      expect(result).toEqual(mockedResponse as any);
    });

    it('should enrich request with Crowd Api url', () => {
      appBackendService.get(resourceUrl);

      const call = httpMock.get.calls.first();
      expect(call.args[0]).toEqual(apiUrl + resourceUrl as any);
    });

    it('should enrich request with auth data', () => {
      appBackendService.get(resourceUrl);

      const call = httpMock.get.calls.first();
      checkAuthData(call.args[1]);
    });
  });

  describe('getBlob()', () => {
    const resourceUrl = '/resource';

    it('should call Http.get() once and forward its return value', () => {
      const result = appBackendService.getBlob(resourceUrl);

      expect(httpMock.get.calledOnce).toBeTruthy;
      expect(result).toEqual(mockedResponse as any);
    });

    it('should enrich request with Crowd Api url', () => {
      appBackendService.getBlob(resourceUrl);

      const call = httpMock.get.calls.first();
      expect(call.args[0]).toEqual(apiUrl + resourceUrl);
    });

    it('should enrich request with auth data', () => {
      appBackendService.getBlob(resourceUrl);

      const call = httpMock.get.calls.first();
      checkAuthData(call.args[1]);
    });

    it('should have blob as response type', () => {
      appBackendService.getBlob(resourceUrl);

      const call = httpMock.get.calls.first();
      expect(call.args[1].responseType).toEqual('blob');
    });
  });

  describe('post()', () => {
    const resourceUrl = '/resource';

    it('should call Http.post() once and forward its return value', () => {
      const body = {some: 'data'};
      const result = appBackendService.post(resourceUrl, body);

      expect(httpMock.post.calledOnce).toBeTruthy;
      expect(httpMock.post.calls.first().args[1]).toEqual(body);
      expect(result).toEqual(mockedResponse as any);
    });

    it('should enrich request with Crowd Api url', () => {
      appBackendService.post(resourceUrl, {});

      const call = httpMock.post.calls.first();
      expect(call.args[0]).toEqual(apiUrl + resourceUrl);
    });

    it('should enrich request with auth data', () => {
      appBackendService.post(resourceUrl, {});

      const call = httpMock.post.calls.first();
      checkAuthData(call.args[2]);
    });
  });

  describe('put()', () => {
    const resourceUrl = '/resource';

    it('should call Http.put() once and forward its return value', () => {
      const body = {some: 'data'};
      const result = appBackendService.put(resourceUrl, body);

      expect(httpMock.put.calledOnce).toBeTruthy;
      expect(httpMock.put.calls.first().args[1]).toEqual(body);
      expect(result).toEqual(mockedResponse as any);
    });

    it('should enrich request with Crowd Api url', () => {
      appBackendService.put(resourceUrl, {});

      const call = httpMock.put.calls.first(0);
      expect(call.args[0]).toEqual(apiUrl + resourceUrl);
    });

    it('should enrich request with auth data', () => {
      appBackendService.put(resourceUrl, {});

      const call = httpMock.put.calls.first();
      checkAuthData(call.args[2]);
    });
  });

  describe('patch()', () => {
    const resourceUrl = '/resource';

    it('should call Http.patch() once and forward its return value', () => {
      const body = {some: 'data'};
      const result = appBackendService.patch(resourceUrl, body);

      expect(httpMock.patch.calledOnce).toBeTruthy;
      expect(httpMock.patch.calls.first().args[1]).toEqual(body);
      expect(result).toEqual(mockedResponse as any);
    });

    it('should enrich request with Crowd Api url', () => {
      appBackendService.patch(resourceUrl, {});

      const call = httpMock.patch.calls.first();
      expect(call.args[0]).toEqual(apiUrl + resourceUrl);
    });

    it('should enrich request with auth data', () => {
      appBackendService.patch(resourceUrl, {});

      const call = httpMock.patch.calls.first();
      checkAuthData(call.args[2]);
    });
  });

  describe('delete()', () => {
    const resourceUrl = '/resource';

    it('should call Http.delete() once and forward its return value', () => {
      const result = appBackendService.delete(resourceUrl);

      expect(httpMock.delete.calledOnce).toBeTruthy;
      expect(result).toEqual(mockedResponse as any);
    });

    it('should enrich request with Crowd Api url', () => {
      appBackendService.delete(resourceUrl, {});

      const call = httpMock.delete.calls.first();
      expect(call.args[0]).toEqual(apiUrl + resourceUrl);
    });

    it('should enrich request with auth data', () => {
      appBackendService.delete(resourceUrl, {});

      const call = httpMock.delete.calls.first();
      checkAuthData(call.args[1]);
    });
  });
});
