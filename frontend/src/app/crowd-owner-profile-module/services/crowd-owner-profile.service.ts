import { AppBackendService } from 'src/app/services/app-backend.service';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CrowdOwnerProfileModule } from '../crowd-owner-profile.module';
import { ContactDetails } from '../model/contact-details';

@Injectable({providedIn: CrowdOwnerProfileModule})
export class CrowdOwnerProfileService {
  constructor(private appBackendService: AppBackendService) {}

  public getContactInfo(): Observable<ContactDetails> {
    return this.appBackendService.get<ContactDetails>('/branding/crowdOwnerContact')
      .pipe(map(response => response.body));
  }

  public getCompanyLogo(): Observable<string> {
    return this.appBackendService.get<{logoString: string}>('/branding/crowdOwnerLogo')
      .pipe(map(({body}) => body.logoString));
  }
}
