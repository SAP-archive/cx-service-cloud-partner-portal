export interface Credentials {
  accountName: string;
  userName: string;
  password: string;
}

export const emptyCredentials = (): Credentials => ({
  accountName: '',
  userName: '',
  password: '',
});

export const exampleCredentials = (): Credentials => ({
  accountName: 'my-account',
  userName: 'my-username',
  password: 'my-password',
});
