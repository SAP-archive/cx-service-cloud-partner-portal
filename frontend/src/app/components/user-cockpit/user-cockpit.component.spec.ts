import { UserCockpitComponent } from './user-cockpit.component';
import { Router } from '@angular/router';

describe('UserCockpitComponent', () => {
  describe('logout()', () => {
    it('should logout', () => {
      const router: Router = jasmine.createSpyObj(['navigateByUrl']);
      const component = new UserCockpitComponent(router);

      component.logout();

      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });
});
