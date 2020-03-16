import { TestBed } from '@angular/core/testing';
import { TechnicianProfileService } from './technician-profile.service';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { of } from 'rxjs';
import { exampleTag } from '../models/tag.model';
import { exampleTechnicianProfile } from '../models/technician-profile.model';
import { omit } from 'src/app/utils/omit';

describe('TechnicianProfileService', () => {
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;
  let service: TechnicianProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TechnicianProfileService,
        {
          provide: AppBackendService,
          useValue: jasmine.createSpyObj(AppBackendService, ['get', 'put', 'post', 'delete']),
        },
      ],
    });

    service = TestBed.get(TechnicianProfileService);
    appBackendMockService = TestBed.get(AppBackendService);
  });

  describe('get()', () => {
    it('should use BackendService to make call', done => {
      const technicianId = '123';
      appBackendMockService.get.and.returnValue(of({body: 'test'} as any));
      service.get(technicianId).subscribe(() => {
        expect(appBackendMockService.get).toHaveBeenCalled();
        let { args } = appBackendMockService.get.calls.first();
        expect(args[0]).toEqual('/data/technician/123');
        done();
      });
    });
  });

  describe('getSkills()', () => {
    it('should use BackendService fetch skills', done => {
      const technicianId = '123';
      appBackendMockService.get.and.returnValue(of({body: 'test'} as any));
      service.getSkills(technicianId).subscribe(() => {
        expect(appBackendMockService.get).toHaveBeenCalled();
        let { args } = appBackendMockService.get.calls.first();
        expect(args[0]).toEqual('/data/technician/123/skills');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should use the AppBackendService to update technician', done => {
      const technician = exampleTechnicianProfile('123');
      appBackendMockService.put.withArgs('/data/technician/123', {
          profile: technician,
          skills: {
            add: [],
            remove: [],
          },
          certificates: {
            add: [],
            remove: [],
          },
        }).and.returnValue(of({body: technician} as any));
      service.update({
        profile: technician,
        skills: {add: [], remove: []},
        certificates: {add: [], remove: []},
      }).subscribe(result => {
        expect(appBackendMockService.put).toHaveBeenCalled();
        expect(result).toEqual(technician);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should use the AppBackendService to create technician', done => {
      const technician = exampleTechnicianProfile('123');
      appBackendMockService.post.withArgs('/data/technician', {
        profile: omit(technician, 'externalId', 'createdAt'),
        skills: [],
        certificates: [],
      }).and.returnValue(of({body: technician} as any));
      service.create({
        profile: omit(technician, 'externalId', 'createdAt'),
        skills: [],
        certificates: [],
      }).subscribe(result => {
        expect(result).toEqual(technician);
        expect(appBackendMockService.post).toHaveBeenCalled();
        done();
      });
    });
  });
});
