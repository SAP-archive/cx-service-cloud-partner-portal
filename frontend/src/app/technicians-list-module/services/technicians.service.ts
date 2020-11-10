import { Injectable } from '@angular/core';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Technician } from '../models/technician.model';
import { CrowdApiResponse } from '../models/crowd-api-response.model';
import { TechniciansFacade } from '../state/technicians.facade';

@Injectable()
export class TechnicianService {
  constructor(
    private appBackend: AppBackendService,
    private techniciansFacade: TechniciansFacade) { }

  public loadTechnicians(): Observable<CrowdApiResponse<Technician>> {
    return this.techniciansFacade.fetchingParams.pipe(
      take(1),
      switchMap(
        (fetchingParams) => this.appBackend.post<CrowdApiResponse<Technician>>(
          '/search/technicians', {
            page: fetchingParams.pagesLoaded,
            size: 40,
            name: fetchingParams.name || ''
        })
      ),
      map(response => response.body),
    );
  }

  public searchTechnicians(name: string): Observable<CrowdApiResponse<Technician>> {
    return this.techniciansFacade.fetchingParams.pipe(
      take(1),
      switchMap(
        (fetchingParams) => this.appBackend.post<CrowdApiResponse<Technician>>(
          '/search/technicians', {
            page: 0,
            size: 40,
            name: name || ''
        })
      ),
      map(response => response.body),
    );
  }
}
