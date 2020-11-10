export interface AuthData {
  accountId: number;
  accountName: string;
  companyId: number;
  companyName: string;
  userId: number;
  userName: string;
  authToken: string;
  password?: string;
}

export const emptyAuthData = (): AuthData => ({
  accountId: null,
  accountName: null,
  companyId: null,
  companyName: null,
  userId: null,
  userName: null,
  authToken: null,
  password: null,
});

export const exampleAuthData = (): AuthData => ({
  accountId: 1,
  accountName: 'account',
  companyId: 2,
  companyName: 'Company Ltd',
  userId: 3,
  userName: 'User',
  authToken: 'token',
  password: 'old-password'
});
