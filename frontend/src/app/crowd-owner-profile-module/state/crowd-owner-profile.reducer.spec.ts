import { State, reducer, initialState } from './crowd-owner-profile.reducer';
import  * as actions from './crowd-owner-profile.actions';
import { exampleContactDetails, emptyContactDetails } from '../model/contact-details';
import { dummyBase64Image } from '../../utils/base64-image';


describe('CrowdOwnerProfile reducer', () => {
  describe('loadCompanyContact', () => {
    it('sets isLoadingContact to true', () => {
      expect (initialState.isLoadingContact).toBeFalse();
      const result = reducer(initialState, actions.loadCompanyContact());
      expect(result.isLoadingContact).toBeTrue();
    });
  });

  describe('loadCompanyContactSuccess', () => {
    let preparedState: State;

    beforeEach(() => {
      preparedState = {
        ...initialState,
        isLoadingContact: true,
      };
    });

    it('sets isLoadingContact to false', () => {
      const result = reducer(
          preparedState,
          actions.loadCompanyContactSuccess({contactDetails: exampleContactDetails()})
        );
      expect(result.isLoadingContact).toBeFalse();
    });

    it('sets contact data', () => {
      expect(preparedState.contactDetails).toEqual(emptyContactDetails());
      const result = reducer(
          preparedState,
          actions.loadCompanyContactSuccess({contactDetails: exampleContactDetails()})
        );
      expect(result.contactDetails).toEqual(exampleContactDetails());
    });
  });

  describe('loadCompanyContactFailure', () => {
    it('sets isLoadingContact to false', () => {
      const preparedState = {
        ...initialState,
        isLoading: true,
      };
      const result = reducer(preparedState, actions.loadCompanyContactFailure());
      expect(result.isLoadingContact).toBeFalse();
    });
  });

  describe('loadCompanyLogo', () => {
    it('sets isLoadingLogo to true', () => {
      expect (initialState.isLoadingLogo).toBeFalse();
      const result = reducer(initialState, actions.loadCompanyLogo());
      expect(result.isLoadingLogo).toBeTrue();
    });
  });

  describe('loadCompanyLogoSuccess', () => {
    let preparedState: State;

    beforeEach(() => {
      preparedState = {
        ...initialState,
        isLoadingLogo: true,
      };
    });

    it('sets isLoadingLogo to false', () => {
      const result = reducer(
          preparedState,
          actions.loadCompanyLogoSuccess({companyLogo: dummyBase64Image})
        );
      expect(result.isLoadingLogo).toBeFalse();
    });

    it('sets logo data', () => {
      expect(preparedState.companyLogo).toBeNull();
      const result = reducer(
          preparedState,
          actions.loadCompanyLogoSuccess({companyLogo: dummyBase64Image})
        );
      expect(result.companyLogo).toEqual(dummyBase64Image);
    });
  });

  describe('loadCompanyLogoFailure', () => {
    it('sets isLoadingLogo to false', () => {
      const preparedState = {
        ...initialState,
        isLoadingLogo: true,
      };
      const result = reducer(preparedState, actions.loadCompanyLogoFailure());
      expect(result.isLoadingLogo).toBeFalse();
    });
  });
});
