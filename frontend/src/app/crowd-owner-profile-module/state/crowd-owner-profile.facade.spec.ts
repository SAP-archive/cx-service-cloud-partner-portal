import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { State, initialState } from './crowd-owner-profile.reducer';
import { CrowdOwnerProfileFacade } from './crowd-owner-profile.facade';
import { loadCompanyContact, loadCompanyLogo } from './crowd-owner-profile.actions';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

describe('CrowdOwnerProfileFacade', () => {
  let store: jasmine.SpyObj<Store<State>>;
  let facade: CrowdOwnerProfileFacade;
  let dispatchSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrowdOwnerProfileFacade,
        provideMockStore({
          initialState,
        }),
      ],
    });

    store = TestBed.get(Store);
    facade = TestBed.get(CrowdOwnerProfileFacade);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  describe('loadContactInfo', () => {
    it('should dispatch loadCompanyContact action', () => {
      facade.loadContactInfo();
      expect(dispatchSpy).toHaveBeenCalledWith(loadCompanyContact());
    });
  });

  describe('loadCompanyLogo', () => {
    it('should dispatch loadCompanyLogo action', () => {
      facade.loadCompanyLogo();
      expect(dispatchSpy).toHaveBeenCalledWith(loadCompanyLogo());
    });
  });
});
