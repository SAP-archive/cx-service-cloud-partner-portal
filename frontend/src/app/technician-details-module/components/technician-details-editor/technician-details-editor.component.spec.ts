import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianDetailsEditorComponent, WorkingMode } from './technician-details-editor.component';
import {
  emptyTechnicianProfile,
  exampleTechnicianProfile,
  TechnicianProfile,
} from '../../models/technician-profile.model';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechnicianProfileFacade } from '../../state/technician-profile.facade';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TechnicianDetailsMaterialModule } from '../../technician-details-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { AbbreviatePipeModule } from 'src/app/abbreviate-pipe-module/abbreviate-pipe.module';
import { RecursivePartial } from 'src/app/utils/recursive-partial';
import { initialState, State, technicianProfileFeatureKey } from '../../state/technician-profile.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { SkillsCardComponent } from '../skills-card/skills-card.component';
import { ApprovalDecisionStatusModule } from 'src/app/approval-decision-status-module/approval-decision-status.module';
import { FileUploaderModule } from 'src/app/file-uploader/file-uploader.module';
import { HttpClientModule } from '@angular/common/http';
import { ReportingFacade } from 'src/app/state/reporting/reporting.facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { examplePerson } from '../../../model/unified-person.model';
import { UserState } from '../../../state/user/user.reducer';
import { omit } from '../../../utils/omit';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMockBuilder } from '../../../utils/mat-dialog-mock.spec';
import { of } from 'rxjs';

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
  type MockedState = RecursivePartial<{ [technicianProfileFeatureKey]: State, user: RecursivePartial<UserState> }>;
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
    user: {
      person: examplePerson(),
    },
  });

  const mapToTechnicianData = (profile: TechnicianProfile) => ({
    externalId: undefined,
    lastName: profile.lastName,
    firstName: profile.firstName,
    email: profile.email,
    mobilePhone: profile.mobilePhone,
    inactive: profile.inactive,
    address: profile.address,
    crowdType: profile.crowdType,
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
        HttpClientModule,
      ],
      declarations: [
        TechnicianDetailsEditorComponent,
        SkillsCardComponent,
      ],
      providers: [
        FormBuilder,
        TechnicianProfileFacade,
        provideMockStore({
          initialState: getState({
            isLoadingProfile: true,
            profileData: null,
          }),
        }),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: MatDialog,
          useValue: new MatDialogMockBuilder().withResponse(of(true)).build(),
        },
      ],
    })
      .compileComponents();

    store = TestBed.inject(Store) as MockStore<MockedState>;
    technicianFacade = TestBed.inject(TechnicianProfileFacade);
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
        expect(component.isActive).toEqual(!exampleProfile.inactive);
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

      describe('when technician is blocked', () => {
        it('should set isBlocked to true', () => {
          component.ngOnInit();
          const exampleProfile: TechnicianProfile = {
            ...exampleTechnicianProfile(),
            syncStatus: 'BLOCKED',
          };
          store.setState(getState({
            isLoadingProfile: false,
            profileData: exampleProfile,
          }));
          expect(component.isBlocked).toEqual(true);
        });

        it('should report warning', () => {
          const reportingFacade = TestBed.inject(ReportingFacade);
          const spy = spyOn(reportingFacade, 'reportWarning');
          component.ngOnInit();
          const exampleProfile: TechnicianProfile = {
            ...exampleTechnicianProfile(),
            syncStatus: 'BLOCKED',
          };
          store.setState(getState({
            isLoadingProfile: false,
            profileData: exampleProfile,
          }));
          expect(spy).toHaveBeenCalled();
        });
      });

      describe('when technician is not blocked', () => {
        it('should set isBlocked to false', () => {
          component.ngOnInit();
          const exampleProfile: TechnicianProfile = {
            ...exampleTechnicianProfile(),
            syncStatus: 'IN_CLOUD',
          };
          store.setState(getState({
            isLoadingProfile: false,
            profileData: exampleProfile,
          }));
          expect(component.isBlocked).toEqual(false);
        });
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

      describe('should check if role changed', () => {
        it('should clear crowdType attribute if role not changed', (done) => {
          store.setState(getState({
            profileData: exampleTechnicianProfile(),
          }));
          component.ngOnInit();
          const spy = spyOn(technicianFacade, 'saveProfile');
          component.onSubmit().then(() => {
            expect(spy).toHaveBeenCalledWith({
              ...mapToTechnicianData(exampleTechnicianProfile()),
              crowdType: '',
            });
            done();
          });
        });

        it('should keep crowdType attribute if role changed', (done) => {
          store.setState(getState({
            profileData: exampleTechnicianProfile(),
          }));
          component.ngOnInit();
          component.onRoleChanged('PARTNER_ADMIN');
          const spy = spyOn(technicianFacade, 'saveProfile');
          component.onSubmit().then(() => {
            expect(spy).toHaveBeenCalledWith({...mapToTechnicianData(exampleTechnicianProfile())});
            done();
          });
        });
      });
    });

    describe('onToggleActive()', () => {
      it('should toggle active and mark form as dirty', () => {
        component.ngOnInit();
        component.isActive = true;
        component.person = {
          id: '111',
          firstName: 'firstName',
          lastName: 'lastName',
          inactive: false,
        };
        component.technicianProfile = exampleTechnicianProfile('123');
        component.onToggleActive();
        expect(component.isActive).toEqual(false);
        expect(component.profileForm.dirty).toEqual(true);
      });

      it('should not toggle active if technician is current logged in user', () => {
        component.ngOnInit();
        component.isActive = true;
        component.person = {
          id: '111',
          firstName: 'firstName',
          lastName: 'lastName',
          inactive: false,
        };
        component.technicianProfile = exampleTechnicianProfile('111');
        component.onToggleActive();
        expect(component.isActive).toEqual(true);
        expect(component.profileForm.dirty).toEqual(false);
      });
    });

    describe('ngOnDestroy()', () => {
      it('calls facade to clear form data', () => {
        const spy = spyOn(technicianFacade, 'clearProfileData');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
      });

      it('dismisses snack bar', () => {
        const snackBar = TestBed.inject(MatSnackBar);
        const spy = spyOn(snackBar, 'dismiss');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('deleteTechnician()', () => {
      it('should open a confirmation dialog', () => {
        const deleteSpy = spyOn(technicianFacade, 'deleteProfile');
        component.technicianProfile = exampleTechnicianProfile();
        component.deleteTechnician();
        expect(deleteSpy).toHaveBeenCalledWith(currentTechnicianId);
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

      it('should remove .crowdType and .address.id attribute', (done) => {
        store.setState(getState({
          profileData: exampleTechnicianProfile(),
        }));
        component.ngOnInit();
        const spy = spyOn(technicianFacade, 'createProfile');
        component.onSubmit().then(() => {
          let profile = mapToTechnicianData(exampleTechnicianProfile());
          expect(spy).toHaveBeenCalledWith(omit({...profile, address: omit(profile.address, 'id')}, 'crowdType'));
          done();
        });
      });
    });
  });
});
