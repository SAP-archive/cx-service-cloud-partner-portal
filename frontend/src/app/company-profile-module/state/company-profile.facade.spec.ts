import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RecursivePartial } from '../../utils/recursive-partial';
import { initialState, State } from './company-profile.reducer';
import { CompanyProfileFacade } from './company-profile.facade';
import { exampleCompanyDetails } from '../model/company-profile.model';
import * as CompanyProfileActions from './company-profile.actions';
import { exampleDocument } from '../model/document.model';
import { exampleSaveCompanyProfileData } from '../model/save-company-profile-data';
import { companyProfileFeatureKey, CompanyProfileFeatureState } from './feature.selectors';

describe('CompanyProfileFacade', () => {
  type MockedState = RecursivePartial<{ [companyProfileFeatureKey]: CompanyProfileFeatureState }>;
  let store: MockStore<MockedState>;
  let facade: CompanyProfileFacade;

  const getState = (companyProfileState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    [companyProfileFeatureKey]: {companyDetails: companyProfileState},
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompanyProfileFacade,
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.inject(Store) as MockStore<MockedState>;
    facade = TestBed.inject(CompanyProfileFacade);
  });

  describe('isProfileLoaded', () => {
    it('should emit true if profile is not empty', () => {
      store.setState(getState());
      expect(facade.isProfileLoaded).toBeObservable(cold('a', {a: false}));

      store.setState(getState({companyDetails: exampleCompanyDetails()}));
      expect(facade.isProfileLoaded).toBeObservable(cold('a', {a: true}));
    });
  });

  describe('isSaving', () => {
    it('should select isSaving from state', () => {
      store.setState(getState({isSaving: true}));
      expect(facade.isSaving).toBeObservable(cold('a', {a: true}));

      store.setState(getState({isSaving: false}));
      expect(facade.isSaving).toBeObservable(cold('a', {a: false}));
    });
  });

  describe('name', () => {
    it('should select name from state', () => {
      store.setState(getState({companyDetails: exampleCompanyDetails()}));
      expect(facade.name).toBeObservable(cold('a', {a: exampleCompanyDetails().name}));
    });
  });

  describe('companyProfile', () => {
    it('should select companyProfile from state', () => {
      store.setState(getState({companyDetails: exampleCompanyDetails()}));
      expect(facade.companyDetails).toBeObservable(cold('a', {a: exampleCompanyDetails()}));
    });
  });

  describe('documents', () => {
    it('should select documents from state', () => {
      store.setState(getState({
        ids: [exampleDocument('1').id, exampleDocument('2').id],
        entities: {1: exampleDocument('1'), 2: exampleDocument('2')},
      }));
      expect(facade.documents).toBeObservable(cold('a', {
        a: [
          exampleDocument('1'),
          exampleDocument('2'),
        ],
      }));
    });
  });

  describe('loadCompanyProfile()', () => {
    it('should dispatch loadCompanyProfile action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.loadCompanyProfile();
      expect(spy).toHaveBeenCalledWith(CompanyProfileActions.loadCompanyProfile());
    });
  });

  describe('loadCompanyProfileIfNotLoadedAlready()', () => {
    describe('when company profile is loaded', () => {
      it('should not dispatch any action', () => {
        store.setState(getState({companyDetails: exampleCompanyDetails()}));
        const spy = spyOn(store, 'dispatch');

        facade.loadCompanyProfileIfNotLoadedAlready();

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('when company profile is not loaded', () => {
      it('should dispatch loadCompanyProfile action', () => {
        const spy = spyOn(store, 'dispatch');
        facade.loadCompanyProfileIfNotLoadedAlready();
        expect(spy).toHaveBeenCalledWith(CompanyProfileActions.loadCompanyProfile());
      });
    });
  });

  describe('saveCompanyProfile()', () => {
    it('should dispatch saveCompanyProfile action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.saveCompanyProfile(exampleSaveCompanyProfileData());
      expect(spy).toHaveBeenCalledWith(CompanyProfileActions.saveCompanyProfile({saveData: exampleSaveCompanyProfileData()}));
    });
  });

  describe('downloadDocument()', () => {
    it('should dispatch downloadDocument action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.downloadDocument(exampleDocument());
      expect(spy).toHaveBeenCalledWith(CompanyProfileActions.downloadDocument({document: exampleDocument()}));
    });
  });

  describe('terminateRelationship()', () => {
    it('should dispatch terminateRelationship action', () => {
      const spy = spyOn(store, 'dispatch');
      facade.terminateRelationship();
      expect(spy).toHaveBeenCalledWith(CompanyProfileActions.terminateRelationship());
    });
  });

});
