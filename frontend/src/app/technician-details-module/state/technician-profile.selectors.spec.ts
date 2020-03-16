import * as fromTechnicianProfile from './technician-profile.reducer';
import { selectSkillViewModels, selectTechnicianProfileState } from './technician-profile.selectors';
import { exampleSkillViewModel } from '../models/skill-view.model';
import { async, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RecursivePartial } from 'src/app/utils/recursive-partial';
import { take } from 'rxjs/operators';
import { skillViewModelsAdapter } from 'src/app/technician-details-module/state/technician-profile.reducer';

describe('TechnicianProfile Selectors', () => {
  type MockedState = RecursivePartial<{ [fromTechnicianProfile.technicianProfileFeatureKey]: fromTechnicianProfile.State }>;
  let store: MockStore<MockedState>;

  const getState = (profileState: RecursivePartial<fromTechnicianProfile.State>): RecursivePartial<MockedState> => ({
    [fromTechnicianProfile.technicianProfileFeatureKey]: {
      ...fromTechnicianProfile.initialState,
      ...profileState,
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: getState(fromTechnicianProfile.initialState),
        }),
      ],
    });

    store = TestBed.get(Store);
  }));

  it('should select the feature state', () => {
    const result = selectTechnicianProfileState({
      [fromTechnicianProfile.technicianProfileFeatureKey]: fromTechnicianProfile.initialState,
    });
    expect(result).toEqual(fromTechnicianProfile.initialState);
  });

  it('selectSkillViewModels should work without tag', fakeAsync(() => {
    const skillViewModelWithoutTag = {
      ...exampleSkillViewModel('without tag'),
      tag: null,
    };
    store.setState(getState({
      skillViewModels: skillViewModelsAdapter.addAll(
        [
          skillViewModelWithoutTag,
        ],
        skillViewModelsAdapter.getInitialState()),
    }));

    let skills;
    store.select(selectSkillViewModels).pipe(take(1)).subscribe(skillViewModels => {
      skills = skillViewModels;
    });
    tick();

    expect(skills.length).toBe(0);
  }));
});
