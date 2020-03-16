import { ServiceAreaCardComponent } from './service-area-card.component';
import { GoogleMapsService } from '../../services/google-maps.service';
import { exampleServiceArea } from '../../../model/service-area.model';
import { FormBuilder } from '@angular/forms';
import { RecursivePartial } from '../../../utils/recursive-partial';
import { fakeAsync, tick } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import PlaceResult = google.maps.places.PlaceResult;
import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;

describe('ServiceAreaCardComponent', () => {
  const placeResult = (): RecursivePartial<PlaceResult> => ({
    place_id: exampleServiceArea().googlePlaceId,
    formatted_address: 'some address',
    name: 'Gdańsk',
    geometry: {
      location: {
        lat: () => exampleServiceArea().latitude,
        lng: () => exampleServiceArea().longitude,
      },
    },
  });

  const createComponentWithDependencies = () => {
    const googleMapsService = jasmine.createSpyObj<GoogleMapsService>([
      'getPlaceDetails',
      'getSuggestions',
    ]);
    googleMapsService.getPlaceDetails.withArgs(exampleServiceArea().googlePlaceId)
      .and.returnValue(Promise.resolve(placeResult() as PlaceResult));

    const formBuilder = new FormBuilder();

    const component = new ServiceAreaCardComponent(
      googleMapsService,
      formBuilder,
    );

    const onChange = jasmine.createSpy();
    component.registerOnChange(onChange);

    return {
      component,
      googleMapsService,
      formBuilder,
      onChange,
    };
  };

  describe('writeValue()', () => {
    it('should store and expose the passed area', () => {
      const {component} = createComponentWithDependencies();

      component.writeValue(exampleServiceArea());

      expect(component.area).toEqual(exampleServiceArea());
    });

    it('should set search input value based on google place id', fakeAsync(() => {
      const {component} = createComponentWithDependencies();

      component.writeValue(exampleServiceArea());

      tick();
      expect(component.searchInput.value).toEqual(placeResult().name);
    }));
  });

  describe('ngOnInit()', () => {
    describe('autocomplete', () => {
      const autocompleteValues = (): QueryAutocompletePrediction[] => [
        {
          description: 'Gdańsk City',
          place_id: '1',
          matched_substrings: [],
          terms: [],
        },
        {
          description: 'Gdańsk Central Station',
          place_id: '2',
          matched_substrings: [],
          terms: [],
        },
      ];

      it('should be initialized on searchInput field and set value of component to null', (done) => {
        const {component, googleMapsService, onChange} = createComponentWithDependencies();
        const query = 'Gdańsk';
        googleMapsService.getSuggestions.withArgs(query).and.returnValue(Promise.resolve(autocompleteValues()));

        component.ngOnInit();

        component.autocompleteValues.pipe(take(1))
          .subscribe(values => {
            expect(values).toEqual(autocompleteValues());
            expect(onChange).toHaveBeenCalledWith(null);
            done();
          });

        component.searchInput.setValue(query);
      });

      it('should swallow errors and keep observable going', (done) => {
        const {component, googleMapsService, onChange} = createComponentWithDependencies();
        const spy = googleMapsService.getSuggestions;
        spy.and.returnValues(
          Promise.reject('ZERO_RESULTS'),
          Promise.resolve(autocompleteValues()),
        );

        component.ngOnInit();

        component.autocompleteValues.pipe(take(1))
          .subscribe(values => {
            expect(values).toEqual(autocompleteValues());
            expect(onChange).toHaveBeenCalledWith(null);
            done();
          });

        component.searchInput.setValue('something out of this planet');
        component.searchInput.setValue('Gdańsk');
      });
    });

    it('should save place changes to area and change component value', fakeAsync(() => {
      const {component, onChange} = createComponentWithDependencies();
      const queryAutocompletePrediction: QueryAutocompletePrediction = {
        description: 'Gdańsk City',
        place_id: exampleServiceArea().googlePlaceId,
        matched_substrings: [],
        terms: [],
      };

      component.ngOnInit();

      component.searchInput.setValue(queryAutocompletePrediction);
      tick();

      expect(component.area.googlePlaceId).toEqual(exampleServiceArea().googlePlaceId);
      expect(component.area.longitude).toEqual(exampleServiceArea().longitude);
      expect(component.area.latitude).toEqual(exampleServiceArea().latitude);
      expect(onChange).toHaveBeenCalledWith(component.area);
    }));

    describe('radius', () => {
      it('should be saved to area and component value should be changed', fakeAsync(() => {
        const {component, onChange} = createComponentWithDependencies();

        component.writeValue(exampleServiceArea());
        component.ngOnInit();

        component.radiusValueInput.setValue(5);
        tick();

        expect(component.area.radius.value).toEqual(5);
        expect(onChange).toHaveBeenCalledWith(component.area);
      }));

      it('should replace invalid radius inputs with NaN', fakeAsync(() => {
        const {component} = createComponentWithDependencies();

        component.writeValue(exampleServiceArea());
        component.ngOnInit();

        component.radiusValueInput.setValue(-5);
        tick();
        expect(component.area.radius.value).toBeNaN();

        component.radiusValueInput.setValue('wrong value');
        tick();
        expect(component.area.radius.value).toBeNaN();
      }));
    });

    it('should save radius unit changes to area and change component value', fakeAsync(() => {
      const {component, onChange} = createComponentWithDependencies();

      component.writeValue(exampleServiceArea());
      component.ngOnInit();

      component.radiusUnitInput.setValue('cucumbers');
      tick();

      expect(component.area.radius.unit).toEqual('cucumbers');
      expect(onChange).toHaveBeenCalledWith(component.area);
    }));
  });

  describe('radius value field', () => {
    it('should be marked as invalid if value is less than 0.1', () => {
      const {component} = createComponentWithDependencies();

      component.radiusValueInput.setValue('0.1');
      expect(component.radiusValueInput.valid).toBeTrue();

      component.radiusValueInput.setValue('0.09');
      expect(component.radiusValueInput.valid).toBeFalse();
      expect(component.radiusValueInput.errors.min).toBeDefined();
    });

    it('should be marked as invalid if value is not a valid, positive number', () => {
      const {component} = createComponentWithDependencies();

      component.radiusValueInput.setValue('123.456');
      expect(component.radiusValueInput.valid).toBeTrue();

      component.radiusValueInput.setValue('-5');
      expect(component.radiusValueInput.valid).toBeFalse();
      expect(component.radiusValueInput.errors.pattern).toBeDefined();

      component.radiusValueInput.setValue('1..23');
      expect(component.radiusValueInput.valid).toBeFalse();
      expect(component.radiusValueInput.errors.pattern).toBeDefined();
    });
  });
});
