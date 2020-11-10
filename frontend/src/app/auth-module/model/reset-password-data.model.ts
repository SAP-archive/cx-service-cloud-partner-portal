export interface ResetPasswordData {
  accountName: string | null;
  userName: string | null;
  maskedEmail: string | null;
  email: string | null;
  verificationCode: string | null;
  newPassword: string | null;
}

export const exampleResetPasswordData = (): ResetPasswordData => ({
  accountName: 'my-account',
  userName: 'my-name',
  maskedEmail: 'masked-email',
  email: 'email',
  verificationCode: 'verification-code',
  newPassword: 'new-password'
});

export const emptyResetPasswordData = (): ResetPasswordData => ({
  accountName: null,
  userName: null,
  maskedEmail: null,
  email: null,
  verificationCode: null,
  newPassword: null
});
