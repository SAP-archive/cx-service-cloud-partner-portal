import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentsBoardComponent } from './assignments-board.component';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { AssignmentsListFacadeMockBuilder } from '../../state/assignments-list.facade.mock.spec';
import { marbles } from 'rxjs-marbles';
import SpyObj = jasmine.SpyObj;

describe('AssignmentsBoardComponent', () => {
  let component: AssignmentsBoardComponent;
  let fixture: ComponentFixture<AssignmentsBoardComponent>;
  let facadeMock: SpyObj<AssignmentsListFacade>;

  beforeEach(async(marbles(m => {
    facadeMock = new AssignmentsListFacadeMockBuilder().setIsUpdating(m.cold('tf', {t: true, f: false})).build();
    TestBed.configureTestingModule({
      declarations: [AssignmentsBoardComponent],
      providers: [
        {
          provide: AssignmentsListFacade,
          useValue: facadeMock,
        }
      ],
    })
      .compileComponents();
  })));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should share isUpdating info from facade', marbles(m => {
    m.expect(component.isUpdating).toBeObservable('tf', {t: true, f: false});
  }));
});
