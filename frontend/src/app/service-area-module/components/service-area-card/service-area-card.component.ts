import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { GoogleMapsService } from '../../services/google-maps.service';
import { ServiceArea } from '../../../model/service-area.model';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { isServiceAreaValid } from '../../validators/service-area-form.validator';
import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;
import PlaceResult = google.maps.places.PlaceResult;
import GeocoderResult = google.maps.GeocoderResult;

export type ServiceAreaPosition = QueryAutocompletePrediction | GeocoderResult | string;

@Component({
  selector: 'pp-service-area-form',
  templateUrl: './service-area-card.component.html',
  styleUrls: ['./service-area-card.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ServiceAreaCardComponent,
    },
  ],
})
export class ServiceAreaCardComponent implements ControlValueAccessor, OnInit, OnDestroy {
  public form: FormGroup = this.formBuilder.group({
    searchInput: [''],
    radiusValue: ['', [Validators.min(0), Validators.pattern(/^\d*\.?\d*$/)]],
    radiusUnit: [''],
  });
  public area: ServiceArea;
  public autoCompleteValues: ServiceAreaPosition[] = [];
  private destroyed = new Subject();
  private onChange: Function;
  private currentGeolocation: GeocoderResult;

  constructor(private googleMapsService: GoogleMapsService,
              private formBuilder: FormBuilder) {
  }

  public isRadiusErrorEnabled(area: ServiceArea) {
    return !isServiceAreaValid(area);
  }

  public get radiusValueInput(): AbstractControl {
    return this.form.get('radiusValue');
  }

  public get searchInput(): AbstractControl {
    return this.form.get('searchInput');
  }

  public get radiusUnitInput(): AbstractControl {
    return this.form.get('radiusUnit');
  }

  public registerOnChange(onChange: Function): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: Function): void {
    return;
  }

  public writeValue(area: ServiceArea): void {
    this.area = area;
    this.setSearchInputBasedOnGooglePlaceId(area.googlePlaceId);
    this.radiusValueInput.setValue(area.radius.value);
    this.radiusUnitInput.setValue(area.radius.unit);
  }

  public ngOnInit(): void {
    this.loadCurrentGeoLocation();
    this.initializeAutocomplete();
    this.savePlaceChanges();
    this.saveRadiusValueChanges();
    this.saveRadiusUnitChanges();
  }

  public ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public displayAutocompletePrediction(location: ServiceAreaPosition) {
    return (location as QueryAutocompletePrediction).description ||
      (location as GeocoderResult).formatted_address ||
      location;
  }

  private setSearchInputBasedOnGooglePlaceId(googlePlaceId: string) {
    this.googleMapsService.getPlaceDetails(googlePlaceId)
      .then(value => this.searchInput.setValue(value.name, {emitEvent: false}));
  }

  private initializeAutocomplete() {
    this.searchInput.valueChanges
      .pipe(
        filter(value => typeof value === 'string'),
        tap(() => this.onChange(null)),
      ).subscribe(value =>
        !value ? this.resetAutocompleteValues() :
          this.googleMapsService.getSuggestions(value).then((suggestPlaces) => this.autoCompleteValues = suggestPlaces)
      ),
      catchError((error, caught) => {
        if (error !== 'ZERO_RESULTS') {
          console.error(error);
        }
        return caught;
      });
  }

  private savePlaceChanges() {
    this.searchInput.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        filter(value => this.isValidInput(value)),
        switchMap((queryPrediction: ServiceAreaPosition) => {
          return queryPrediction && typeof queryPrediction === 'object' ?
            this.googleMapsService.getPlaceDetails(queryPrediction.place_id) : Promise.resolve(null);
        }),
      )
      .subscribe((placeResult: PlaceResult) => {
        placeResult ? this.updateAreaWithPlaceResults(placeResult) : this.resetArea();
        this.updateComponentsValue();
      });
  }

  private saveRadiusValueChanges() {
    this.radiusValueInput.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((value: number) => {
        let newRadius = 0;
        if (value !== null) {
          newRadius = this.radiusValueInput.valid ? value : NaN;
        }
        this.area = {...this.area, radius: {...this.area.radius, value: newRadius}};
        this.updateComponentsValue();
      });
  }

  private saveRadiusUnitChanges() {
    this.radiusUnitInput.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(unit => {
        this.area = {...this.area, radius: {...this.area.radius, unit}};
        this.updateComponentsValue();
      });
  }

  private updateComponentsValue() {
    if (this.onChange) {
      this.onChange(this.area);
    }
  }

  private updateAreaWithPlaceResults(place: PlaceResult) {
    this.area = {...this.area, googlePlaceId: place.place_id};
    this.centerOnPlace(place);
  }

  private centerOnPlace({geometry}: PlaceResult) {
    this.area = {
      ...this.area,
      latitude: geometry.location.lat(),
      longitude: geometry.location.lng(),
    };
  }

  private isValidInput(input: ServiceAreaPosition): boolean {
    return (typeof input === 'string' && input === '') || typeof input !== 'string';
  }

  private resetArea() {
    this.area = {
      ...this.area,
      googlePlaceId: '',
      latitude: 0,
      longitude: 0,
    };
  }

  public ifStartInputFromNull() {
    if (!this.searchInput.value) {
      this.resetAutocompleteValues();
    }
  }

  private loadCurrentGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.googleMapsService.getAddressFromPosition(position).then(geocoderResult => this.currentGeolocation = geocoderResult);
      });
    }
  }

  private resetAutocompleteValues() {
    this.autoCompleteValues = this.currentGeolocation ? [this.currentGeolocation] : [];
  }
}
