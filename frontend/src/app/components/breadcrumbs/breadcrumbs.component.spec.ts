import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  describe('isOnRootRoute()', () => {
    it('should return true if on root route', () => {
      expect(new BreadcrumbsComponent({url: '/'} as any).isOnRootRoute()).toBeTrue();
      expect(new BreadcrumbsComponent({url: '/other-route'} as any).isOnRootRoute()).toBeFalse();
    });
  });
});
