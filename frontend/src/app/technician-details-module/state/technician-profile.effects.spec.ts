import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { TechnicianProfileEffects } from './technician-profile.effects';
import { TechnicianProfileService } from '../services/technician-profile.service';
import { TagService } from '../services/tag.service';
import { RecursivePartial } from 'src/app/utils/recursive-partial';
import { State, initialState, technicianProfileFeatureKey } from './technician-profile.reducer';
import * as profileActions from './technician-profile.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { translateModule } from '../../utils/translate.module';
import { HttpClientModule } from '@angular/common/http';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { TechnicianProfile, exampleTechnicianProfile } from '../models/technician-profile.model';
import { reportSuccess, reportError } from 'src/app/state/reporting/reporting.actions';
import { exampleSkill } from '../models/skill.model';
import { exampleTag } from '../models/tag.model';
import { take, toArray } from 'rxjs/operators';
import { Router } from '@angular/router';
import { saveAsInjectionToken } from '../injection-tokens';

describe('TechnicianProfileEffects', () => {
  type MockedState = RecursivePartial<{ [technicianProfileFeatureKey]: State }>;
  let actions$: Observable<any>;
  let effects: TechnicianProfileEffects;
  let technicianProfileMockService: jasmine.SpyObj<TechnicianProfileService>;
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;
  let tagService: jasmine.SpyObj<TagService>;

  const getState = (profileState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    [technicianProfileFeatureKey]: profileState,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        translateModule,
        HttpClientModule,
      ],
      providers: [
        {
          provide: Router,
          useClass: class { public navigateByUrl = jasmine.createSpy('navigateByUrl'); }
        },
        TechnicianProfileEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: getState(),
        }),
        {
          provide: AppBackendService,
          useValue: jasmine.createSpyObj(AppBackendService, ['get', 'post', 'delete', 'put'])
        },
        {
          provide: TechnicianProfileService,
          useValue: jasmine.createSpyObj(TechnicianProfileService, [
            'get', 'create', 'update', 'getSkills', 'downloadCertificate'
          ]),
        },
        {
          provide: TagService,
          useValue: jasmine.createSpyObj(TagService, ['getAll']),
        },
        {provide: saveAsInjectionToken, useValue: jasmine.createSpy()},
      ],
    });

    effects = TestBed.get<TechnicianProfileEffects>(TechnicianProfileEffects);
    technicianProfileMockService = TestBed.get<TechnicianProfileService>(TechnicianProfileService);
    appBackendMockService = TestBed.get<AppBackendService>(AppBackendService);
    tagService = TestBed.get(TagService);
  });

  describe('loadTechnicianProfiles$', () => {
    it('should fetch the profile data', done => {
      const expectedResponse: Partial<TechnicianProfile> = {firstName: 'lalaland'};
      technicianProfileMockService.get.and.returnValue(of(expectedResponse as any));
      actions$ = of(profileActions.loadTechnicianProfile);
      effects.loadTechnicianProfiles$.subscribe(profile => {
        expect(technicianProfileMockService.get).toHaveBeenCalled();
        expect(profile).toEqual(profileActions.loadTechnicianProfileSuccess({data: expectedResponse as any}));
        done();
      });
    });

    it('report any errors', done => {
      technicianProfileMockService.get.and.returnValue(throwError('test'));
      actions$ = of(profileActions.loadTechnicianProfile);
      effects.loadTechnicianProfiles$.pipe(toArray()).subscribe(actions => {
        expect(technicianProfileMockService.get).toHaveBeenCalled();
        expect(actions).toEqual([
          profileActions.loadTechnicianProfileFailure(),
          reportError({message: 'TECHNICIAN_PROFILE_LOAD_FAILED'}),
        ]);
        done();
      });
    });
  });

  describe('saveTechnicianProfile$', () => {
    it('should save the profile data', done => {
      const technician = exampleTechnicianProfile();
      technicianProfileMockService.update.and.returnValue(of(technician as any));
      actions$ = of(profileActions.saveTechnicianProfile({
        profile: technician,
        skills: {
          add: [],
          remove: [],
        },
        certificates: {
          add: [],
          remove: [],
        },
      }));
      effects.saveTechnicianProfile$.pipe(toArray()).subscribe(profile => {
        expect(technicianProfileMockService.update).toHaveBeenCalledWith({
          profile: technician,
          skills: {
            add: [],
            remove: [],
          },
          certificates: {
            add: [],
            remove: [],
          },
        });
        expect(profile).toEqual([
          profileActions.loadSkills({technicianExternalId: technician.externalId}),
          profileActions.saveTechnicianProfileSuccess({profile: technician} as any),
          reportSuccess({ message: 'TECHNICIAN_PROFILE_UPDATE_SUCCEED' })
        ]);
        done();
      });
    });

    it('report any errors', done => {
      technicianProfileMockService.update.and.returnValue(throwError('test'));
      actions$ = of(profileActions.saveTechnicianProfile);
      effects.saveTechnicianProfile$.pipe(toArray()).subscribe(results => {
        expect(technicianProfileMockService.update).toHaveBeenCalled();
        expect(results).toEqual([
          profileActions.saveTechnicianProfileFailure(),
          reportError({message: 'TECHNICIAN_PROFILE_UPDATE_FAILED'}),
        ]);
        done();
      });
    });
  });

  describe('createTechnicianProfile$', () => {
    it('should create the technician profile', done => {
      const technician = exampleTechnicianProfile();
      technicianProfileMockService.create.and.returnValue(of(technician as any));
      actions$ = of(profileActions.createTechnicianProfile({
        profile: technician,
        skills: [],
        certificates: [],
      }));
      effects.createTechnicianProfile$.subscribe(profile => {
        expect(technicianProfileMockService.create).toHaveBeenCalledWith({
          profile: technician,
          skills: [],
          certificates: [],
        });
        expect(profile).toEqual(profileActions.createTechnicianProfileSuccess({profile: technician} as any));
        done();
      });
    });

    it('report any errors', done => {
      technicianProfileMockService.create.and.returnValue(throwError('test'));
      actions$ = of(profileActions.createTechnicianProfile);
      effects.createTechnicianProfile$.pipe(toArray()).subscribe(results => {
        expect(technicianProfileMockService.create).toHaveBeenCalled();
        expect(results).toEqual([
          profileActions.createTechnicianProfileFailure(),
          reportError({message: 'TECHNICIAN_PROFILE_CREATE_FAILED'}),
        ]);
        done();
      });
    });
  });

  describe('loadTags$', () => {
    it('fetches all tags', done => {
      tagService.getAll.and.returnValue(of([exampleTag()]));
      actions$ = of(profileActions.loadTags());
      effects.loadTags$.subscribe(action => {
        expect(tagService.getAll).toHaveBeenCalled();
        expect(action).toEqual(profileActions.loadTagsSuccess({data: [exampleTag()]}));
        done();
      });
    });

    it('report any errors', done => {
      tagService.getAll.and.returnValue(throwError('test'));
      actions$ = of(profileActions.loadTags());
      effects.loadTags$.pipe(toArray()).subscribe(actions => {
        expect(tagService.getAll).toHaveBeenCalled();
        expect(actions).toEqual([
          profileActions.loadTagsFailure(),
          reportError({message: 'UNEXPECTED_ERROR'}),
        ]);
        done();
      });
    });
  });

  describe('loadSkills$', () => {
    it('fetches all tags and expand details', done => {
      const expectedSkill = exampleSkill();
      technicianProfileMockService.getSkills.and.returnValue(of([expectedSkill]));
      actions$ = of(profileActions.loadSkills({technicianExternalId: '123'}));
      effects.loadSkills$.pipe(take(1)).subscribe(action => {
        expect(technicianProfileMockService.getSkills).toHaveBeenCalled();
        expect(action).toEqual(profileActions.loadSkillsSuccess({data: [expectedSkill]}));
        done();
      });
    });

    it('report any errors', done => {
      technicianProfileMockService.getSkills.and.returnValue(throwError('test'));
      actions$ = of(profileActions.loadSkills({technicianExternalId: '123'}));
      effects.loadSkills$.pipe(toArray()).subscribe(actions => {
        expect(technicianProfileMockService.getSkills).toHaveBeenCalled();
        expect(actions).toEqual([
          profileActions.loadSkillsFailure(),
          reportError({message: 'UNEXPECTED_ERROR'}),
        ]);
        done();
      });
    });
  });

  describe('downloadCertificate$', () => {
    it('calls the profileService to download certificate', done => {
      const skill = exampleSkill();
      technicianProfileMockService.downloadCertificate.withArgs('123', skill).and.returnValue(of(new Blob(['test'])));
      actions$ = of(profileActions.downloadCertificate({
        technicianId: '123',
        skill,
      }));
      effects.downloadCertificate$.subscribe(() => {
        expect(technicianProfileMockService.downloadCertificate).toHaveBeenCalled();
        done();
      });
    });

    it('report any errors', done => {
      const skill = exampleSkill();
      technicianProfileMockService.downloadCertificate
        .withArgs('123', skill)
        .and.returnValue(throwError('failed'));
      actions$ = of(profileActions.downloadCertificate({
        technicianId: '123',
        skill,
      }));
      effects.downloadCertificate$.subscribe(action => {
        expect(technicianProfileMockService.downloadCertificate).toHaveBeenCalled();
        expect(action).toEqual(reportError({message: 'UNEXPECTED_ERROR'}));
        done();
      });
    });
  });
});
