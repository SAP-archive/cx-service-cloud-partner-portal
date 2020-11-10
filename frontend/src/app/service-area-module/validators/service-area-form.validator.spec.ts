import { isServiceAreaValid, serviceAreaFormValidator } from './service-area-form.validator';
import { exampleServiceArea, ServiceArea, emptyServiceArea } from '../../model/service-area.model';
import { AbstractControl } from '@angular/forms';

describe('serviceAreaFormValidator()', () => {
  it('should return empty object for valid area', () => {
    const control = {value: exampleServiceArea()};
    expect(serviceAreaFormValidator(control as AbstractControl)).toEqual({});
  });

  it('should return empty object for control without value', () => {
    const control = {};
    expect(serviceAreaFormValidator(control as AbstractControl)).toEqual({});
  });

  it('should return empty object for area with empty googlePlaceId', () => {
    const control = {value: {...exampleServiceArea(), googlePlaceId: ''}};
    expect(serviceAreaFormValidator(control as AbstractControl)).toEqual({});
  });

  it('should return object with serviceAreaIsNotValid for area with NaN radius value', () => {
    const control = {value: {...exampleServiceArea(), radius: {value: NaN, unit: 'km'}}};
    expect(serviceAreaFormValidator(control as AbstractControl)).toEqual({serviceAreaIsNotValid: true});
  });

  it('should return object with serviceAreaIsValid for area with 0 radius value', () => {
    const control = {value: {...exampleServiceArea(), radius: {value: 0, unit: 'km'}}};
    expect(serviceAreaFormValidator(control as AbstractControl)).toEqual({});
  });

  it('should return true for valid area', () => {
    const area = exampleServiceArea();
    expect(isServiceAreaValid(area)).toEqual(true);
  });

  it('should return true for empty area', () => {
    const area = null;
    expect(isServiceAreaValid(area)).toEqual(true);
  });

  it('should return true for area with empty googlePlaceId and empty radius', () => {
    const area = emptyServiceArea();
    expect(isServiceAreaValid(area)).toEqual(true);
  });

  it('should return true for area with empty googlePlaceId', () => {
    const area = {...exampleServiceArea(), googlePlaceId: ''};
    expect(isServiceAreaValid(area)).toEqual(true);
  });

  it('should return false for area with NaN radius value', () => {
    const area = {...exampleServiceArea(), radius: {value: NaN, unit: 'km'}} as ServiceArea;
    expect(isServiceAreaValid(area)).toEqual(false);
  });
});
