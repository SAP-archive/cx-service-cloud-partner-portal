import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentsListMaterialModule } from '../../assignments-list-material.module';
import { translateModule } from '../../../utils/translate.module';
import { TechniciansSelectorComponent } from './technicians-selector.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { exampleTechnician } from '../../../technicians-list-module/models/technician.model';
import { marbles } from 'rxjs-marbles';
import { EventEmitter } from '@angular/core';

describe('TechniciansSelectorComponent', () => {
  let component: TechniciansSelectorComponent;
  let fixture: ComponentFixture<TechniciansSelectorComponent>;
  let responsibleChangedMock,
    isValidMock;

  beforeEach(async(() => {
    isValidMock = jasmine.createSpyObj(EventEmitter, ['emit']);
    responsibleChangedMock = jasmine.createSpyObj(EventEmitter, ['emit']);
    TestBed.configureTestingModule({
      imports: [
        translateModule,
        AssignmentsListMaterialModule,
        BrowserAnimationsModule,
      ],
      declarations: [TechniciansSelectorComponent]
    })
      .compileComponents();
    fixture = TestBed.createComponent(TechniciansSelectorComponent);
    component = fixture.componentInstance;
    component.isValid = isValidMock;
    component.responsibleChanged = responsibleChangedMock;
  }));

  describe('ngOnChanges()', () => {
    it('should initialize fullNames array for autoComplete', () => {
      fixture.detectChanges();
      component.technicians = [exampleTechnician()];
      component.ngOnChanges();
      expect(component.fullNames).toEqual([`${exampleTechnician().firstName} ${exampleTechnician().lastName}`]);
    });

    it('should initialize filteredOptions to equal fullNames', marbles(m => {
      fixture.detectChanges();
      component.technicians = [exampleTechnician()];
      component.ngOnChanges();
      m.expect(component.filteredOptions).toBeObservable('f', { f: component.fullNames });
    }));
  });

  describe('validationCheck()', () => {
    it('should emit true when allow null and get null input', () => {
      fixture.detectChanges();
      component.allowNull = true;
      component.changeResponsiblePerson('');
      expect(component.isValid.emit).toHaveBeenCalledWith(true);
    });

    it('should emit false when do not allow null and get null input', () => {
      fixture.detectChanges();
      component.allowNull = false;
      component.changeResponsiblePerson('');
      expect(component.isValid.emit).toHaveBeenCalledWith(false);
    });

    it('should emit true when find matched technician', () => {
      fixture.detectChanges();
      const fullName = `${exampleTechnician().firstName} ${exampleTechnician().lastName}`;
      component.fullNames = [fullName];
      component.changeResponsiblePerson(fullName);
      expect(component.isValid.emit).toHaveBeenCalledWith(true);
    });

    it('should emit false when can not find matched technician', () => {
      fixture.detectChanges();
      const fullName = `${exampleTechnician().firstName} ${exampleTechnician().lastName}`;
      component.fullNames = [fullName];
      component.changeResponsiblePerson(fullName + 'x');
      expect(component.isValid.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('changeResponsiblePerson()', () => {
    it('should emit changeResponsiblePerson when valid technician is selected', () => {
      fixture.detectChanges();
      component.fullNames = ['admin one', 'technician two'];
      const selectedTechnician = () => ({ ...exampleTechnician('1'), firstName: 'admin', lastName: 'one' });
      component.technicians = [
       selectedTechnician(),
       { ...exampleTechnician('2'), firstName: 'technician', lastName: 'two' },
      ];
      component.changeResponsiblePerson('admin one');
      expect(component.responsibleChanged.emit).toHaveBeenCalledWith(selectedTechnician());
    });

    it('should not emit changeResponsiblePerson name when select current responsiblePerson', () => {
      fixture.detectChanges();
      fixture.detectChanges();
      component.fullNames = ['admin', 'technician'];
      component.changeResponsiblePerson('owner');
      expect(component.responsibleChanged.emit).not.toHaveBeenCalled();
    });
  });
});
