import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppBackendService } from '../../services/app-backend.service';
import { map } from 'rxjs/operators';
import { CompanyProfile } from '../model/company.profile';
import { SaveCompanyProfileData } from '../model/save-company-profile-data';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class CompanyProfileService {
  constructor(private router: Router,
              private appBackendService: AppBackendService) {
  }

  public navigateToEditor(): void {
    this.router.navigateByUrl('/company-profile-editor');
  }

  public loadProfile(): Observable<CompanyProfile> {
    return this.appBackendService.get<CompanyProfile>('/companyProfile/read').pipe(
      map(response => this.formatCompanyProfile(response.body)),
    );
  }

  public terminateRelationship(partnerId: string): Observable<HttpResponse<undefined>> {
    return this.appBackendService.get<undefined>(
      `/partners/${partnerId}/action/terminate`);
  }

  public saveProfile(saveData: SaveCompanyProfileData) {
    return this.appBackendService.put<CompanyProfile>('/companyProfile/save', saveData).pipe(
      map(response => this.formatCompanyProfile(response.body)),
    );
  }

  public downloadDocument(id: string): Observable<Blob> {
    return this.appBackendService.getBlob(`/documents/${id}/download`)
      .pipe(map(response => response.body));
  }

  private formatCompanyProfile(companyProfile: CompanyProfile) {
    try {
      if (companyProfile.companyDetails.serviceArea.radius.value === 0) {
        companyProfile.companyDetails.serviceArea.radius.value = null;
      }

    } catch (e) {
      console.error('set raiuds value failed');
    }
    return companyProfile;
  }
}
