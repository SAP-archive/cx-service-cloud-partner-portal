import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UnifiedPerson } from '../model/unified-person.model';
import { Observable } from 'rxjs';
import { AppBackendService } from './app-backend.service';

@Injectable()
export class UnifiedPersonService {
  constructor(
    private backendService: AppBackendService,
  ) {
  }

  public get(id: string): Observable<HttpResponse<UnifiedPerson>> {
    return this.backendService.get<UnifiedPerson>(`/data/unifiedPerson/${id}`);
  }
}
