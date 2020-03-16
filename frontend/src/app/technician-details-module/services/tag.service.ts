import { Injectable } from '@angular/core';
import { AppBackendService } from '../../services/app-backend.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable()
export class TagService {
  constructor(
    private appBackendService: AppBackendService,
  ) {}

  public getAll(): Observable<Tag[]> {
    return this.appBackendService.get<Tag[]>('/data/tags')
      .pipe(map(response => response.body));
  }
}
