import { AppBackendService } from '../../services/app-backend.service';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ContactDetails } from '../model/contact-details';

@Injectable()
export class CrowdOwnerProfileService {
  constructor(
    private appBackendService: AppBackendService,
  ) { }

  public getContactInfo(): Observable<ContactDetails> {
    return this.appBackendService.get<ContactDetails>('/crowdOwnerContact').pipe(
      map(response => response.body)
    );
  }

  public getCompanyLogo(): Observable<string> {
    return this.appBackendService.get<{ logoString: string }>('/branding/crowdOwnerLogo')
      .pipe(map(({ body }) => body.logoString));
  }

  public getCrowdName(): Observable<string> {
    return this.appBackendService.get<{ crowdName: string }>('/branding/crowdOwnerName')
      .pipe(map(({ body }) => body.crowdName));
  }
}
