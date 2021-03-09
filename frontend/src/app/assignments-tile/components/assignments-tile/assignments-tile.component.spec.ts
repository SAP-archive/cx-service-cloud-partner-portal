import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsTileComponent } from './assignments-tile.component';
import { AssignmentsTileFacade } from '../../state/assignments-tile.facade';
import { AssignmentsTileFacadeMockBuilder } from '../../state/assignments-tile.facade.mock.spec';
import { marbles } from 'rxjs-marbles';
import { TruncateNumberPipe } from '../../../truncate-number-pipe-module/truncate-number.pipe';
import { MatCardModule } from '@angular/material/card';
import SpyObj = jasmine.SpyObj;

describe('ComponentsAssignmentsTileComponent', () => {
  let component: AssignmentsTileComponent;
  let fixture: ComponentFixture<AssignmentsTileComponent>;

  beforeEach(marbles(m => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
      ],
      declarations: [
        AssignmentsTileComponent,
        TruncateNumberPipe,
      ],
      providers: [
        {
          provide: AssignmentsTileFacade,
          useValue: new AssignmentsTileFacadeMockBuilder()
            .setIsLoading(m.cold('ftf', {f: false, t: true}))
            .build(),
        },
        {
          provide: TruncateNumberPipe,
          useValue: {},
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide isLoading observable based on facade', marbles(m => {
    const assignmentsTileFacade = TestBed.inject(AssignmentsTileFacade) as SpyObj<AssignmentsTileFacade>;
    fixture.detectChanges();
    m.expect(assignmentsTileFacade.isLoading).toBeObservable('ftf', {f: false, t: true});
  }));

  describe('ngOnInit()', () => {
    it('should load assignments', () => {
      const assignmentsTileFacade = TestBed.inject(AssignmentsTileFacade) as SpyObj<AssignmentsTileFacade>;
      expect(assignmentsTileFacade.loadAssignmentsStats).toHaveBeenCalled();
    });
  });
});
