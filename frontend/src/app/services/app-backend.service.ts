import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthData } from '../auth-module/model/auth-data.model';
import { AuthFacade } from '../auth-module/state/auth/auth.facade';
import { ConfigFacade } from '../state/config/config.facade';
import { AppConfig } from '../model/app-config.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppBackendService implements OnDestroy {
  protected authData: AuthData;
  private config: AppConfig;
  private destroyed$: Subject<undefined> = new Subject();

  constructor(private http: HttpClient,
              private authFacade: AuthFacade,
              private configFacade: ConfigFacade,
  ) {
    this.authFacade.authUserData.pipe(takeUntil(this.destroyed$)).subscribe(authData => this.authData = authData);
    this.configFacade.appConfig.pipe(takeUntil(this.destroyed$)).subscribe(config => this.config = config);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public get<T>(url: string, params: { [param: string]: string } = {}): Observable<HttpResponse<T>> {
    const options = {
      params,
      headers: this.getAuthHeaders(),
      observe: 'response' as 'response',
    };

    return this.http.get<T>(this.addBasePath(url), options);
  }

  public post<T>(url: string,
                 body: any,
                 params: { [param: string]: string } = {},
                 headers: { [header: string]: string } = {}): Observable<HttpResponse<T>> {
    const options = {
      params,
      headers: {...this.getAuthHeaders(), ...headers},
      observe: 'response' as 'response',
    };

    return this.http.post<T>(this.addBasePath(url), body, options);
  }

  public put<T>(url: string, body: any, params: { [param: string]: string } = {}): Observable<HttpResponse<T>> {
    const options = {
      params,
      headers: this.getAuthHeaders(),
      observe: 'response' as 'response',
    };

    return this.http.put<T>(this.addBasePath(url), body, options);
  }

  public patch<T>(url: string, body: any, params: { [param: string]: string } = {}): Observable<HttpResponse<T>> {
    const options = {
      params,
      headers: this.getAuthHeaders(),
      observe: 'response' as 'response',
    };

    return this.http.patch<T>(this.addBasePath(url), body, options);
  }

  public delete<T>(url: string, params: { [param: string]: string } = {}, additionalOptions: { [param: string]: any } = {}): Observable<HttpResponse<T>> {
    const options = {
      params,
      headers: this.getAuthHeaders(),
      observe: 'response' as 'response',
      ...additionalOptions,
    };

    return this.http.delete<T>(this.addBasePath(url), options);
  }

  public getBlob(url: string, params: { [param: string]: string } = {}): Observable<HttpResponse<Blob>> {
    const options = {
      params,
      headers: this.getAuthHeaders(),
      observe: 'response' as 'response',
      responseType: 'blob' as 'blob',
    };

    return this.http.get(this.addBasePath(url), options);
  }

  protected getAuthHeaders(): { [header: string]: string } {
    return {
      Authorization: this.authData.authToken ? this.authData.authToken : '',
      'X-Client-ID': this.config.clientIdentifier,
      'X-Client-Version': this.config.version,
      'X-Cloud-Account-Id': this.authData.accountId ? this.authData.accountId.toString(10) : '',
      'X-Cloud-Account-Name': this.authData.accountName ? this.authData.accountName : '',
      'X-Cloud-Company-Id': this.authData.companyId ? this.authData.companyId.toString(10) : '',
      'X-Cloud-Company-Name': this.authData.companyName ? this.authData.companyName : '',
      'X-Cloud-User-Id': this.authData.userId ? this.authData.userId.toString(10) : '',
      'X-Cloud-User-Name': this.authData.userName ? this.authData.userName : '',
    };
  }

  private addBasePath(url: string): string {
    const prefix = environment.appBackendUrl;
    return url.startsWith('/') ? prefix + url : `${prefix}/${url}`;
  }
}
