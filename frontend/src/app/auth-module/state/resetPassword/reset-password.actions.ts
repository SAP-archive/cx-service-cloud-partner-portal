import { createAction, props } from '@ngrx/store';
import { RequestError } from '../../../auth-module/model/request-error.model';
import { ResetPasswordData } from '../../model/reset-password-data.model';

export const setData = createAction(
  '[ResetPassword] Set resetPassword data',
  props<{ data: Partial<ResetPasswordData> }>(),
);

export const fetchPartialEmailAddress = createAction(
  '[ResetPassword] Fetch Partial Email Address',
  props<{ accountName: string, userName: string }>(),
);

export const fetchPartialEmailAddressSuccess = createAction(
  '[ResetPassword] Fetch Partial Email Address Successfully',
  props<{ maskedEmail: string }>(),
);

export const fetchPartialEmailAddressFail = createAction(
  '[ResetPassword] Fetch Partial Email Address Failure',
  props<{ error: RequestError }>(),
);

export const sendVerificationCode = createAction(
  '[ResetPassword] Send Verification Code',
  props<{ email: string }>(),
);


export const sendVerificationCodeSuccess = createAction(
  '[ResetPassword] Send Verification Code Successfully',
);

export const sendVerificationCodeFailure = createAction(
  '[ResetPassword]  Send Verification Code Failure',
  props<{ error: RequestError }>(),
);

export const verifyVerificationCode = createAction(
  '[ResetPassword] Verify Verification Code',
  props<{ verificationCode: string }>(),
);

export const verifyVerificationCodeSuccess = createAction(
  '[ResetPassword] Verify Verification Code Successfully',
);

export const verifyVerificationCodeFailure = createAction(
  '[ResetPassword] Verify Verification Code Failure',
  props<{ error: RequestError }>(),
);

export const resendVerificationCode = createAction(
  '[ResetPassword] Resend Verification Code'
);

export const resetPassword = createAction(
  '[ResetPassword] Reset Password',
  props<{ newPassword: string }>(),
);

export const resetPasswordSuccess = createAction(
  '[ResetPassword] Reset Password Successfully'
);

export const resetPasswordFailure = createAction(
  '[ResetPassword] Reset Password Failure',
  props<{ error: RequestError }>(),
);

export const resetError = createAction(
  '[ResetPassword] Reset Error',
);


export const resetData = createAction(
  '[ResetPassword] Reset Data'
);
