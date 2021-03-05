import { AssignmentsBoardSearchComponent } from './assignments-board-search.component';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { AssignmentsListFacadeMockBuilder } from '../../state/assignments-list.facade.mock.spec';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AssignmentsBoardSearchComponent', () => {
  const createComponent = (assignmentsListFacadeMock?: jasmine.SpyObj<AssignmentsListFacade>) => {
    if (!assignmentsListFacadeMock) {
      assignmentsListFacadeMock = new AssignmentsListFacadeMockBuilder().build();
    }
    return {
      component: new AssignmentsBoardSearchComponent(assignmentsListFacadeMock),
      assignmentsListFacadeMock,
    };
  };

  describe('search()', () => {
    it('should search after debounce', fakeAsync(() => {
      const {component, assignmentsListFacadeMock} = createComponent();
      const query = 'search query';
      component.ngOnInit();
      component.query = query;

      component.search();
      tick(300);

      expect(assignmentsListFacadeMock.search).toHaveBeenCalledWith(query);
    }));
  });

  describe('resetQuery()', () => {
    it('should reset search query and initialize search', fakeAsync(() => {
      const {component, assignmentsListFacadeMock} = createComponent();
      component.ngOnInit();
      component.query = 'some query';

      component.resetQuery();
      tick(300);

      expect(component.query).toEqual('');
      expect(assignmentsListFacadeMock.search).toHaveBeenCalledWith('');
    }));
  });
});
