import { documentsAdapter, initialState, reducer } from './company-profile.reducer';
import * as CompanyProfileActions from './company-profile.actions';
import { exampleCompanyDetails } from '../model/company-profile.model';
import { exampleCompanyProfile } from '../model/company.profile';
import { exampleSaveCompanyProfileData } from '../model/save-company-profile-data';

describe('CompanyProfile Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('on loadCompanyProfile', () => {
    it('should set isLoading to true', () => {
      const result = reducer(
        {...initialState, isLoading: false},
        CompanyProfileActions.loadCompanyProfile(),
      );

      expect(result.isLoading).toBeTrue();
    });
  });

  describe('on loadCompanyProfileSuccess', () => {
    it('should set isLoading to false', () => {
      const result = reducer(
        {...initialState, isLoading: true},
        CompanyProfileActions.loadCompanyProfileSuccess(exampleCompanyProfile()),
      );

      expect(result.isLoading).toBeFalse();
    });

    it('should fill profile with data from action', () => {
      const result = reducer(
        {...initialState, isLoading: true},
        CompanyProfileActions.loadCompanyProfileSuccess(exampleCompanyProfile()),
      );

      expect(result.companyDetails).toEqual(exampleCompanyDetails());
    });

    it('should add all documents from action', () => {
      const result = reducer(
        {...initialState, isLoading: true},
        CompanyProfileActions.loadCompanyProfileSuccess(exampleCompanyProfile()),
      );

      expect(documentsAdapter.getSelectors().selectAll(result)).toEqual(exampleCompanyProfile().documents);
    });
  });

  describe('on loadCompanyProfileFailure', () => {
    it('should set isLoading to false', () => {
      const result = reducer(
        {...initialState, isLoading: true},
        CompanyProfileActions.loadCompanyProfileFailure(),
      );

      expect(result.isLoading).toBeFalse();
    });
  });

  describe('on saveCompanyProfile', () => {
    it('should set isSaving to true', () => {
      const result = reducer(
        {...initialState, isSaving: false},
        CompanyProfileActions.saveCompanyProfile({saveData: exampleSaveCompanyProfileData()}),
      );

      expect(result.isSaving).toBeTrue();
    });
  });

  describe('on saveCompanyProfileSuccess', () => {
    it('should set isSaving to false', () => {
      const result = reducer(
        {...initialState, isSaving: true},
        CompanyProfileActions.saveCompanyProfileSuccess(exampleCompanyProfile()),
      );

      expect(result.isSaving).toBeFalse();
    });

    it('should update profile with company profile data from action', () => {
      const result = reducer(
        initialState,
        CompanyProfileActions.saveCompanyProfileSuccess(exampleCompanyProfile()),
      );

      expect(result.companyDetails).toEqual(exampleCompanyProfile().companyDetails);
    });
  });

  describe('on saveCompanyProfileFailure', () => {
    it('should set isSaving to false', () => {
      const result = reducer(
        {...initialState, isSaving: true},
        CompanyProfileActions.saveCompanyProfileFailure(),
      );

      expect(result.isSaving).toBeFalse();
    });
  });
});
