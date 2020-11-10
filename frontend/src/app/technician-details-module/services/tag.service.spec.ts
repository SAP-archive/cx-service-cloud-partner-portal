import { TestBed } from '@angular/core/testing';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { of } from 'rxjs';
import { TagService } from './tag.service';
import SpyObj = jasmine.SpyObj;

describe('TagService', () => {
  let appBackendMockService: jasmine.SpyObj<AppBackendService>;
  let service: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TagService,
        {
          provide: AppBackendService,
          useValue: jasmine.createSpyObj(AppBackendService, ['get']),
        },
      ],
    });

    service = TestBed.inject(TagService);
    appBackendMockService = TestBed.inject(AppBackendService) as SpyObj<AppBackendService>;
  });

  describe('getAll()', () => {
    it('should use app backend to fetch tags', done => {
      appBackendMockService.get.and.returnValue(of({body: 'test'} as any));
      service.getAll().subscribe(() => {
        expect(appBackendMockService.get).toHaveBeenCalled();
        let { args } = appBackendMockService.get.calls.first();
        expect(args[0]).toEqual('/data/tags');
        done();
      });
    });
  });
});
