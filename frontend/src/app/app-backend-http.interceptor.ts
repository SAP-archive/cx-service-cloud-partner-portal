import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import * as uuid from 'uuid';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { getEmbeddedConfig } from '../environments/embedded-config';

@Injectable()
export class AppBackendHttpInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request.clone({
      setHeaders: {
        'X-Request-ID': uuid(),
        'X-Cloud-Host': this.getCloudHost(),
      }
    }));
  }

  private getCloudHost(): string {
    const clusterName = getEmbeddedConfig().clusterName;
    const clusterConfig = environment.clusterConfigs.find(config => config.code === clusterName);
    if (!clusterConfig) {
      throw new Error(`No cluster config for cluster ${clusterName}`);
    }
    return clusterConfig.cloudBaseUrl;
  }
}
