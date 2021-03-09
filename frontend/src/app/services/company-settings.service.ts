import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppBackendService } from './app-backend.service';
import { CompanySettings } from '../model/company-settings';
import { map } from 'rxjs/operators';

@Injectable()
export class CompanySettingsService {
  constructor(
    private backendService: AppBackendService,
  ) {
  }

  public fetch(): Observable<CompanySettings> {
    return this.backendService.get<CompanySettings>('/company-settings').pipe(
      map(response => response.body),
    );
  }
}
