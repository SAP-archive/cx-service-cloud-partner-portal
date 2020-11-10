import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  describe('onSubmit()', () => {
    it('should navigate to /login/account route', () => {
      const router = jasmine.createSpyObj(['navigateByUrl']);
      const component = new AccountComponent(router, null);
      component.account = 'my-account';
      component.onSubmit();
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/login/account/${component.account}`);
    });
  });
});
