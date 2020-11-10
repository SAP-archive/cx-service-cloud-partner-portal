import { marbles } from 'rxjs-marbles';
import { HttpResponse } from '@angular/common/http';
import { TechniciansListService } from './technicians-list.service';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';
import { Technician, exampleTechnician } from '../../technicians-list-module/models/technician.model';

describe('AssignmentsService', () => {
  let TechniciansListMockService: TechniciansListService;
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;

  beforeEach(() => {
    appBackendMockService = jasmine.createSpyObj(AppBackendService, ['post']);
    TechniciansListMockService = new TechniciansListService(appBackendMockService);
  });

  describe('loadTechnicians()', () => {
    it('should fetch technicians', marbles(m => {
      const exampleResponse = (): CrowdApiResponse<Technician> => ({
        results: [exampleTechnician()],
      });
      appBackendMockService.post
        .withArgs(`/search/technicians`, {
          page: 0,
          size: 1000,
          name: ''
        })
        .and.returnValue(m.cold('a|', {
          a: new HttpResponse({
            body: exampleResponse(),
          }),
        }));

      m.expect(TechniciansListMockService.loadTechnicians()).toBeObservable('a|', { a: exampleResponse().results });
    }));
  });
});
