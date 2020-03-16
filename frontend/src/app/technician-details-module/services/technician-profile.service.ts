import { Injectable } from '@angular/core';
import { AppBackendService } from '../../services/app-backend.service';
import { TechnicianProfile } from '../models/technician-profile.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill.model';
import { NewSkillCertificate } from '../models/skill-certificate.model';

@Injectable()
export class TechnicianProfileService {
  constructor(
    private appBackendService: AppBackendService,
  ) {
  }

  public get(id: string): Observable<TechnicianProfile> {
    return this.appBackendService.get<TechnicianProfile>(`/data/technician/${id}`)
      .pipe(map(response => response.body));
  }

  public getSkills(technicianExternalId: string): Observable<Skill[]> {
    return this.appBackendService.get<Skill[]>(`/data/technician/${technicianExternalId}/skills`)
      .pipe(map(response => response.body));
  }

  public update(data: {
    profile: Partial<TechnicianProfile>,
    skills: {
      add: Skill[],
      remove: Skill[],
    },
    certificates: {
      add: NewSkillCertificate[],
      remove: Skill[],
    },
  }): Observable<TechnicianProfile> {
    return this.appBackendService.put<TechnicianProfile>(`/data/technician/${data.profile.externalId}`, data)
      .pipe(map(response => response.body));
  }

  public create(data: {
    profile: Partial<TechnicianProfile>,
    skills: Skill[],
    certificates: NewSkillCertificate[],
  }): Observable<TechnicianProfile> {
    return this.appBackendService.post<TechnicianProfile>(`/data/technician`, data)
      .pipe(map(response => response.body));
  }

  public downloadCertificate(technicianId: string, skill: Skill): Observable<Blob> {
    return this.appBackendService.getBlob(`/data/technician/${technicianId}/skills/${skill.uuid}/certificate/download`)
      .pipe(map(response => response.body));
  }
}
