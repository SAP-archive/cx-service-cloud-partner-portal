import { async } from '@angular/core/testing';

import { LocalisationSelectorComponent } from './localisation-selector.component';
import { Localisation } from './localisation';
import { cold } from 'jasmine-marbles';
import { selectLocalisation } from '../../state/user/user.actions';

describe('LocalisationSelectorComponent', () => {
  let component: LocalisationSelectorComponent;
  let storeMock;
  const english = (): Localisation => ({
    code: 'en',
    language: 'en',
    name: 'English (United States)',
  });

  const finnish = (): Localisation => ({
    code: 'fi',
    language: 'fi',
    name: 'Finnish',
  });

  beforeEach(async(() => {
    storeMock = cold('-a-b-', {
      a: {user: {localisation: english()}},
      b: {user: {localisation: finnish()}},
    });

    component = new LocalisationSelectorComponent(storeMock);
  }));

  describe('ngOnInit()', () => {
    it('should share currently selected localisation', () => {
      const expectedObservable = cold('-a-b-', {a: english(), b: finnish()});
      component.ngOnInit();
      expect(component.selectedLocalisation).toBeObservable(expectedObservable);
    });
  });

  describe('selectLanguage()', () => {
    it('should select localisation', () => {
      storeMock.dispatch = () => null;
      const spy = spyOn(storeMock, 'dispatch');

      const localisation = (): Localisation => ({
        code: 'fi',
        language: 'fi',
        name: 'Finnish',
      });
      component.selectLanguage(localisation().code);

      expect(spy).toHaveBeenCalledWith(selectLocalisation({localisation: localisation()}));
    });
  });
});
