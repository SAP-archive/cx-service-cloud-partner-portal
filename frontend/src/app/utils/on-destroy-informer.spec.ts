import { OnDestroyInformer } from './on-destroy-informer';
import { take } from 'rxjs/operators';

class TestComponent extends OnDestroyInformer {
  public spy = jasmine.createSpy();

  constructor() {
    super();
    this.onDestroy.pipe(take(1)).subscribe(() => this.spy());
  }
}

describe('OnDestroyInformer', () => {
  describe('onDestroy()', () => {
    it('should inform when component is destroyed', () => {
      const component = new TestComponent();
      component.ngOnDestroy();
      expect(component.spy).toHaveBeenCalled();
    });
  });
});
