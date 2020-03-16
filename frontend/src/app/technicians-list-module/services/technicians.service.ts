import { Injectable } from '@angular/core';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Technician } from '../models/technician.model';

@Injectable()
export class TechnicianService {
  constructor(
    private appBackend: AppBackendService,
  ) {}

  public getAll(): Observable<Technician[]> {
    return this.appBackend.get<Technician[]>('/data/technician')
      .pipe(map(response => response.body));
  }

  public deleteTechnician(technician: Technician): Observable<undefined> {
    return this.appBackend.delete<undefined>(`/data/technician/${technician.externalId}`, {}, {responseType: 'text'})
      .pipe(map(response => response.body));
  }
}
