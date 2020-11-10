import { AssignmentsTileService } from './assignments-tile.service';
import { AppBackendService } from '../../services/app-backend.service';
import { marbles } from 'rxjs-marbles';
import { HttpResponse } from '@angular/common/http';
import { exampleAssignmentsStats } from '../model/assignments-stats';

describe('AssignmentsTileService', () => {
  let service: AssignmentsTileService;
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;

  beforeEach(() => {
    appBackendMockService = jasmine.createSpyObj(AppBackendService, ['get']);
    service = new AssignmentsTileService(appBackendMockService);
  });

  describe('loadAssignmentsStats()', () => {
    it('should load assignments stats ', marbles((m) => {
      appBackendMockService.get.withArgs('/assignments-stats').and.returnValue(m.cold(
        'a|',
        {
          a: new HttpResponse({
            body: exampleAssignmentsStats(),
          }),
        },
      ));
      m.expect(service.loadAssignmentsStats()).toBeObservable(
        'a|',
        {
          a: exampleAssignmentsStats(),
        },
      );
    }));
  });
});
