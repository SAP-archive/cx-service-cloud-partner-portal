import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { Technician } from '../../technicians-list-module/models/technician.model';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';

@Injectable()
export class TechniciansListService {
    constructor(private appBackend: AppBackendService) { }

    public loadTechnicians(): Observable<Technician[]> {
        return this.appBackend.post<CrowdApiResponse<Technician>>(
            '/search/technicians', {
            page: 0,
            size: 1000,
            inactive: false
        }).pipe(
            map(response => response.body.results)
        );
    }
}
