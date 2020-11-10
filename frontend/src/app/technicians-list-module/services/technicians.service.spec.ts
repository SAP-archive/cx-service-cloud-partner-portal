import { TestBed } from '@angular/core/testing';
import { TechnicianService } from './technicians.service';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { exampleSearchTechniciansResult } from '../models/crowd-api-response.model';
import { HttpResponse } from '@angular/common/http';
import { cold } from 'jasmine-marbles';
import { TechniciansFacadeMockBuilder } from '../state/technicians.facade.mock.spec';

describe('TechniciansService', () => {
  let techniciansService: TechnicianService;
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;
  let mockTechniciansFacade: any = new TechniciansFacadeMockBuilder().build();

  beforeEach(() => {
    appBackendMockService = jasmine.createSpyObj(AppBackendService, ['post']);
    techniciansService = new TechnicianService(appBackendMockService, mockTechniciansFacade);
  });

  describe('loadTechnicians()', () => {
    it('calls the backend service', () => {
      appBackendMockService.post
        .and.returnValue(cold('a|', {a: new HttpResponse({body: exampleSearchTechniciansResult()})}));

      expect(techniciansService.loadTechnicians()).toBeObservable(cold('a|', {a: exampleSearchTechniciansResult()}));
    });
  });

  describe('searchTechnicians()', () => {
    it('calls the backend service', () => {
      appBackendMockService.post
        .and.returnValue(cold('a|', {a: new HttpResponse({body: exampleSearchTechniciansResult()})}));

      expect(techniciansService.searchTechnicians('first name')).toBeObservable(cold('a|', {a: exampleSearchTechniciansResult()}));
    });
  });
});
