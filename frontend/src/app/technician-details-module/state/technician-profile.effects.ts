import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

import * as TechnicianProfileActions from './technician-profile.actions';
import { TechnicianProfileService } from '../services/technician-profile.service';
import * as reportingActions from '../../state/reporting/reporting.actions';
import { TagService } from '../services/tag.service';
import { Router } from '@angular/router';
import { saveAsInjectionToken } from '../injection-tokens';

@Injectable()
export class TechnicianProfileEffects {

  public loadTechnicianProfiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TechnicianProfileActions.loadTechnicianProfile),
      concatMap(({ technicianId }) =>
        this.profileService.get(technicianId).pipe(
          map(technician => TechnicianProfileActions.loadTechnicianProfileSuccess({ data: technician })),
          catchError(() =>
            of(
              TechnicianProfileActions.loadTechnicianProfileFailure(),
              reportingActions.reportError({ message: 'TECHNICIAN_PROFILE_LOAD_FAILED' })))))));

  public createTechnicianProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TechnicianProfileActions.createTechnicianProfile),
      concatMap(({ certificates, profile, skills }) =>
        this.profileService.create({
          certificates,
          profile,
          skills,
        }).pipe(
          switchMap(createdProfile => {
            setTimeout(() => {
              this.router.navigateByUrl(`technician-details/${createdProfile.externalId}`);
            }, 2000);
            return of(
              TechnicianProfileActions.createTechnicianProfileSuccess({ profile: createdProfile }),
              reportingActions.reportSuccess({ message: 'TECHNICIAN_PROFILE_CREATE_SUCCEED' })
            );
          }),
          catchError(() =>
            of(
              TechnicianProfileActions.createTechnicianProfileFailure(),
              reportingActions.reportError({ message: 'TECHNICIAN_PROFILE_CREATE_FAILED' })))))));


  public saveTechnicianProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TechnicianProfileActions.saveTechnicianProfile),
      concatMap(({ profile, skills, certificates }) =>
        this.profileService.update({
          profile,
          skills,
          certificates,
        }).pipe(
          switchMap(savedProfile => of(
            TechnicianProfileActions.loadSkills({ technicianExternalId: savedProfile.externalId }),
            TechnicianProfileActions.saveTechnicianProfileSuccess({ profile: savedProfile }),
            reportingActions.reportSuccess({ message: 'TECHNICIAN_PROFILE_UPDATE_SUCCEED' })
          )),
          catchError(() =>
            of(
              TechnicianProfileActions.saveTechnicianProfileFailure(),
              reportingActions.reportError({ message: 'TECHNICIAN_PROFILE_UPDATE_FAILED' })))))));

  public loadTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TechnicianProfileActions.loadTags),
      concatMap(() =>
        this.tagService.getAll().pipe(
          map(tags => TechnicianProfileActions.loadTagsSuccess({ data: tags })),
          catchError(() => of(
            TechnicianProfileActions.loadTagsFailure(),
            reportingActions.reportError({ message: 'UNEXPECTED_ERROR' })))))));

  public loadSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TechnicianProfileActions.loadSkills),
      concatMap(action =>
        this.profileService.getSkills(action.technicianExternalId).pipe(
          map(skills => TechnicianProfileActions.loadSkillsSuccess({ data: skills })),
          catchError(() => of(
            TechnicianProfileActions.loadSkillsFailure(),
            reportingActions.reportError({ message: 'UNEXPECTED_ERROR' })))))));

  public downloadCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TechnicianProfileActions.downloadCertificate),
      switchMap(({ technicianId, skill }) =>
        this.profileService.downloadCertificate(technicianId, skill).pipe(
          map(fileBlob => this.saveAs(fileBlob, skill.certificate.fileName)),
          catchError(() => of(reportingActions.reportError({ message: 'UNEXPECTED_ERROR' })))))
    ),
    { dispatch: false });

  constructor(
    private actions$: Actions,
    private profileService: TechnicianProfileService,
    private tagService: TagService,
    private router: Router,
    @Inject(saveAsInjectionToken) private saveAs: Function,
  ) {
  }
}
