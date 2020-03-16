
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianDetailsEditorComponent, WorkingMode } from './technician-details-editor.component';
import { exampleTechnicianProfile, TechnicianProfile, emptyTechnicianProfile } from '../../models/technician-profile.model';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechnicianProfileFacade } from '../../state/technician-profile.facade';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TechnicianDetailsMaterialModule } from '../../technician-details-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { AbbreviatePipeModule } from 'src/app/abbreviate-pipe-module/abbreviate-pipe.module';
import { RecursivePartial } from 'src/app/utils/recursive-partial';
import { State, initialState, technicianProfileFeatureKey } from '../../state/technician-profile.reducer';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TechnicianProfileService } from '../../services/technician-profile.service';
import { SkillsCardComponent } from '../skills-card/skills-card.component';
import { ApprovalDecisionStatusModule } from 'src/app/approval-decision-status-module/approval-decision-status.module';
import { FileUploaderModule } from 'src/app/file-uploader/file-uploader.module';

interface RouteSnapshot {
  params: {};
  data: {};
}

class ActivatedRouteMock {
  private snapshotData: RouteSnapshot = {
    params: {},
    data: {},
  };

  constructor(snapshotData?: RouteSnapshot) {
    if (!!snapshotData) {
      this.snapshotData = snapshotData;
    }
  }

  get snapshot() {
    return this.snapshotData;
  }

  set snapshot(value: RouteSnapshot) {
    this.snapshotData = value;
  }
}

describe('TechnicianDetailsEditorComponent', () => {
  type MockedState = RecursivePartial<{ [technicianProfileFeatureKey]: State }>;
  let store: MockStore<MockedState>;
  let component: TechnicianDetailsEditorComponent;
  let fixture: ComponentFixture<TechnicianDetailsEditorComponent>;
  let currentTechnicianId: string;
  let technicianFacade: TechnicianProfileFacade;
  let activatedRouteMock;

  const getState = (profileState: RecursivePartial<State>): RecursivePartial<MockedState> => ({
    [technicianProfileFeatureKey]: {
      ...initialState,
      ...profileState,
    },
  });

  beforeEach((() => {
    activatedRouteMock = new ActivatedRouteMock({
      params: {
        technicianId: currentTechnicianId,
      },
      data: {
        mode: 'EDIT' as WorkingMode,
      },
    });

    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        AbbreviatePipeModule,
        TechnicianDetailsMaterialModule,
        ApprovalDecisionStatusModule,
        FileUploaderModule,
      ],
      declarations: [
        TechnicianDetailsEditorComponent,
        SkillsCardComponent,
      ],
      providers: [
        FormBuilder,
        TechnicianProfileFacade,
        TechnicianProfileService,
        provideMockStore({
          initialState: getState({
            isLoadingProfile: true,
            profileData: null,
          }),
        }),
        {
          provide: Router,
          useClass: class {},
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ]
    })
    .compileComponents();

    store = TestBed.get(Store);
    technicianFacade = TestBed.get(TechnicianProfileFacade);
    fixture = TestBed.createComponent(TechnicianDetailsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('in EDIT mode', () => {
    describe('ngOnInit()', () => {
      it('should update technicianProfile on state change', () => {
        component.ngOnInit();
        expect(component.technicianProfile).toEqual(undefined);
        const exampleProfile = exampleTechnicianProfile();
        store.setState(getState({
          isLoadingProfile: false,
          profileData: exampleProfile,
        }));
        expect(component.technicianProfile).toEqual(exampleProfile);
      });

      it('should stop updating technicianProfile after destruction', () => {
        component.ngOnInit();
        expect(component.technicianProfile).toEqual(undefined);
        component.ngOnDestroy();
        store.setState(getState({
          isLoadingProfile: false,
          profileData: exampleTechnicianProfile(),
        }));
        expect(component.technicianProfile).toEqual(undefined);
      });

      it('should fetch technician', () => {
        const spy = spyOn(technicianFacade, 'fetchTechnicianProfile');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledWith(currentTechnicianId);
      });
    });


    describe('getFullName()', () => {
      it('should return the full name', () => {
        const expectedName = `${exampleTechnicianProfile().firstName} ${exampleTechnicianProfile().lastName}`;
        component.technicianProfile = exampleTechnicianProfile();
        expect(component.getFullName()).toEqual(expectedName);
      });

      it('should return `Unnamed` when name is not specified', () => {
        component.technicianProfile = emptyTechnicianProfile();
        expect(component.getFullName()).toEqual('Unnamed');
      });
    });

    describe('onSubmit()', () => {
      it('calls facade service save method', done => {
        store.setState(getState({
          profileData: exampleTechnicianProfile(),
        }));
        const spy = spyOn(technicianFacade, 'saveProfile');
        component.onSubmit().then(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('ngOnDestroy()', () => {
      it('calls facade to clear form data', () => {
        const spy = spyOn(technicianFacade, 'clearProfileData');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('in CREATE mode', () => {
    beforeEach(() => {
      activatedRouteMock.snapshot = {
        data: {
          mode: 'CREATE',
        },
        params: {},
      };
      fixture = TestBed.createComponent(TechnicianDetailsEditorComponent);
      component = fixture.componentInstance;
    });

    describe('onSubmit()', () => {
      it('calls facade service`s create method', done => {
        store.setState(getState({
          profileData: exampleTechnicianProfile(),
        }));
        const spy = spyOn(technicianFacade, 'createProfile');
        component.onSubmit().then(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });
    });
  });

});
