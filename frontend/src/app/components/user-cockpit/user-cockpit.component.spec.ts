import { UserCockpitComponent } from './user-cockpit.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UserCockpitComponent', () => {
  let component: UserCockpitComponent;

  function setup() {
    const router: Router = jasmine.createSpyObj(['navigateByUrl']);
    const companyProfileFacade = jasmine.createSpyObj(['terminateRelationship']);
    const dialog = jasmine.createSpyObj(['open']);
    component = new UserCockpitComponent(router, dialog, companyProfileFacade);
    return {router, companyProfileFacade, dialog};
  }
  describe('logout()', () => {
    it('should logout', () => {
      const { router } = setup();
      component.logout();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('openTerminateDialog', () => {
    it('should open terminate dialog', () => {
      const { dialog, companyProfileFacade } = setup();
      dialog.open.and.returnValue({
        afterClosed: () => {
          return of('confirm');
        }
      });

      component.openTerminateDialog();
      expect(companyProfileFacade.terminateRelationship).toHaveBeenCalled();
    });
  });

});
