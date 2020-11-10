import { DateTimePickerComponent } from './date-time-picker.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalisationService } from '../../../services/localisation.service';
import { NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';

describe('DateTimePickerComponent', () => {
  let component: DateTimePickerComponent;
  let fixture: ComponentFixture<DateTimePickerComponent>;
  let locationServiceMock,
    dateTimeAdapterMock,
    onDateTimeChangeMock,
    isValidMock;

  beforeEach(async(() => {
    locationServiceMock = {
      localisation: {
        locale: 'en'
      }
    };
    dateTimeAdapterMock = jasmine.createSpyObj(NgxMatDateAdapter, ['setLocale']);
    onDateTimeChangeMock = jasmine.createSpyObj(EventEmitter, ['emit']);
    isValidMock = jasmine.createSpyObj(EventEmitter, ['emit']);

    TestBed.configureTestingModule({
      declarations: [DateTimePickerComponent],
      providers: [
        {
          provide: LocalisationService,
          useValue: locationServiceMock,
        },
        {
          provide: NgxMatDateAdapter,
          useValue: dateTimeAdapterMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DateTimePickerComponent);
    component = fixture.componentInstance;
    component.onDateTimeChange = onDateTimeChangeMock;
    component.isValid = isValidMock;
    fixture.detectChanges();
  }));

  describe('ngOnInit()', () => {
    it('should set timepicker locale', () => {
      expect(component).not.toBeNull();
      expect(dateTimeAdapterMock.setLocale).toHaveBeenCalledWith(locationServiceMock.localisation.locale);
    });

    it('should add validators for require if do not allow null dateTime', () => {
      component.allowNull = false;
      component.ngOnInit();
      expect(component.dtControl.validator).toEqual(Validators.required);
    });

    it('should not add validators for require if allow null dateTime', () => {
      component.allowNull = true;
      component.ngOnInit();
      expect(component.dtControl.validator).toBeNull;
    });
  });

  describe('ngOnChanges()', () => {
    it('should set a default datetime for dateTimeValue if no input datetime', () => {
      component.dateTimeValue = null;
      component.ngOnChanges();
      expect(component.dateTimeValue).not.toBeNull();
    });

    it('should transfer dateTimeValue string to Date()', () => {
      const dateTime = '2020-08-26 00:00:00';
      component.dateTimeValue = dateTime;
      component.ngOnChanges();
      expect(component.dateTimeValue).toEqual(new Date(dateTime) as any);
    });
  });

  describe('dateTimeChange()', () => {
    it('should emit new dateTime when valid dateTime comes', () => {
      component.allowNull = true;
      component.ngOnInit();
      const dateTime = '2020-08-26 00:00:00';
      component.dtControl.setValue('2020-08-26 00:00:00');
      component.dateTimeChange(new Date(dateTime));
      expect(onDateTimeChangeMock.emit).toHaveBeenCalledWith(new Date(dateTime));
      expect(isValidMock.emit).toHaveBeenCalledWith(true);
    });

    it('should emit isValid false when invalid dateTime comes', () => {
      component.allowNull = false;
      component.ngOnInit();
      component.dtControl.setValue('');
      component.dateTimeChange(null);
      expect(isValidMock.emit).toHaveBeenCalledWith(false);
    });
  });

});
