import { CompanyProfileTileComponent } from './company-profile-tile.component';
import { cold } from 'jasmine-marbles';

describe('CompanyProfileTileComponent', () => {
  it('should share name observable from CompanyProfileFacade', () => {
    const nameObservable = () => cold('a', {a: 'Serious Business and Partners'});
    const component = new CompanyProfileTileComponent({name: nameObservable()} as any, null);

    expect(component.name).toBeObservable(nameObservable());
  });

  describe('navigateToEditor()', () => {
    it('should navigate to company editor route', () => {
      const companyProfileService = jasmine.createSpyObj(['navigateToEditor']);
      const component = new CompanyProfileTileComponent({name: null} as any, companyProfileService);

      component.navigateToEditor();

      expect(companyProfileService.navigateToEditor).toHaveBeenCalled();
    });
  });
});
