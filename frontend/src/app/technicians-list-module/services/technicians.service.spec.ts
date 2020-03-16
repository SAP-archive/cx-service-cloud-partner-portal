import { TestBed } from '@angular/core/testing';
import { TechnicianService } from './technicians.service';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { of } from 'rxjs';
import { exampleTechnician } from '../models/technician.model';
import { HttpResponse } from '@angular/common/http';
import { cold } from 'jasmine-marbles';

describe('TechniciansService', () => {
  let techniciansService: TechnicianService;
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;

  beforeEach(() => {
    appBackendMockService = jasmine.createSpyObj(AppBackendService, ['get', 'delete']);
    appBackendMockService.get.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        TechnicianService,
        {
          provide: AppBackendService,
          useValue: appBackendMockService,
        },
      ],
    });

    techniciansService = TestBed.get(TechnicianService);
  });

  describe('getAll()', () => {
    it('calls the backend service', () => {
      appBackendMockService.get
        .withArgs(`/data/technician`)
        .and.returnValue(cold('a', {a: new HttpResponse({body: 'response'})}));

      expect(techniciansService.getAll()).toBeObservable(cold('a', {a: 'response'}));
    });
  });

  describe('deleteTechnician()', () => {
    it('calls the backend service to delete a technician', () => {
      appBackendMockService.delete
        .withArgs(`/data/technician/${exampleTechnician().externalId}`, {}, {responseType: 'text'})
        .and.returnValue(cold('a', {a: new HttpResponse({body: 'response'})}));

      const result = techniciansService.deleteTechnician(exampleTechnician());

      expect(result).toBeObservable(cold('a', {a: 'response'}));
    });
  });
});
