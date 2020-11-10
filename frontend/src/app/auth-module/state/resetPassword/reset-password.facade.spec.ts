import { ResetPasswordFacade } from './reset-password.facade';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { initialState, resetPasswordFeatureKey, State } from './reset-password.reducer';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RecursivePartial } from '../../../utils/recursive-partial';
import * as resetPasswordActions from './reset-password.actions';
import { exampleResetPasswordData } from '../../model/reset-password-data.model';
import { authRootKey } from '../../feature.selectors';
import { exampleRequestError } from '../../model/request-error.model';

describe('ResetPasswordFacade', () => {
  type MockedState = RecursivePartial<{
    [authRootKey]: {
      [resetPasswordFeatureKey]: State
    }
  }>;

  let store: MockStore<MockedState>;
  let facade: ResetPasswordFacade;

  const getState = (resetPasswordState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    [authRootKey]: { [resetPasswordFeatureKey]: resetPasswordState },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResetPasswordFacade,
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.inject(Store) as MockStore<MockedState>;
    facade = TestBed.inject(ResetPasswordFacade);
  });

  describe('isBusy', () => {
    it('should select isBusy from state', () => {
      store.setState(getState({isBusy: true}));
      expect(facade.isBusy$).toBeObservable(cold('a', {a: true}));
      store.setState(getState({isBusy: false}));
      expect(facade.isBusy$).toBeObservable(cold('a', {a: false}));
    });
  });

  describe('data$', () => {
    it('should select data$ from state', () => {
      store.setState(getState({data: exampleResetPasswordData()}));
      expect(facade.data$).toBeObservable(cold('a', {a: exampleResetPasswordData()}));
    });
  });

  describe('error$', () => {
    it('should select error$ from state', () => {
      store.setState(getState({error: exampleRequestError()}));
      expect(facade.error$).toBeObservable(cold('a', {a: exampleRequestError()}));
    });
  });

  describe('setData()', () => {
    it('should set data', () => {
      const spy = spyOn(store, 'dispatch');
      const setDataAction = resetPasswordActions.setData({
        data: exampleResetPasswordData()
      });
      facade.setData(exampleResetPasswordData());
      expect(spy).toHaveBeenCalledWith(setDataAction);
    });
  });

  describe('fetchPartialEmailAddress()', () => {
    it('should fetch partial email address', () => {
      const spy = spyOn(store, 'dispatch');
      const data = exampleResetPasswordData();
      const action = resetPasswordActions.fetchPartialEmailAddress({
        accountName: data.accountName,
        userName: data.userName
      });
      facade.fetchPartialEmailAddress(data.accountName, data.userName);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('fetchPartialEmailAddressSuccess()', () => {
    it('should fetch partial email address successfully', () => {
      const spy = spyOn(store, 'dispatch');
      const maskedEmail = '***@sap.com';
      const action = resetPasswordActions.fetchPartialEmailAddressSuccess({
        maskedEmail
      });
      facade.fetchPartialEmailAddressSuccess(maskedEmail);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('fetchPartialEmailAddressFail()', () => {
    it('Fail to fetch partial email address', () => {
      const spy = spyOn(store, 'dispatch');
      const error = exampleRequestError();
      const action = resetPasswordActions.fetchPartialEmailAddressFail({
       error
      });
      facade.fetchPartialEmailAddressFail(error);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('sendVerificationCode()', () => {
    it('should send verification code', () => {
      const spy = spyOn(store, 'dispatch');
      const email = 'test@sap.com';
      const action = resetPasswordActions.sendVerificationCode({
        email
      });
      facade.sendVerificationCode(email);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('verifyVerificationCode()', () => {
    it('should verify verification code', () => {
      const spy = spyOn(store, 'dispatch');
      const verificationCode = 'test@sap.com';
      const action = resetPasswordActions.verifyVerificationCode({
        verificationCode
      });
      facade.verifyVerificationCode(verificationCode);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('resendVerificationCode()', () => {
    it('should resend verification code', () => {
      const spy = spyOn(store, 'dispatch');
      const action = resetPasswordActions.resendVerificationCode();
      facade.resendVerificationCode();
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('resetPassword()', () => {
    it('should reset password', () => {
      const spy = spyOn(store, 'dispatch');
      const newPassword = 'new-password';
      const action = resetPasswordActions.resetPassword({
        newPassword
      });
      facade.resetPassword(newPassword);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('resetError()', () => {
    it('should reset error', () => {
      const spy = spyOn(store, 'dispatch');
      const action = resetPasswordActions.resetError();
      facade.resetError();
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('resetData()', () => {
    it('should reset data', () => {
      const spy = spyOn(store, 'dispatch');
      const action = resetPasswordActions.resetData();
      facade.resetData();
      expect(spy).toHaveBeenCalledWith(action);
    });
  });

});
