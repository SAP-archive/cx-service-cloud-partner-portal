import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { GoogleMapsService } from '../../services/google-maps.service';
import { ServiceArea } from '../../../model/service-area.model';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { isServiceAreaValid } from '../../validators/service-area-form.validator';
import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;
import PlaceResult = google.maps.places.PlaceResult;

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
    radiusValue: ['', [Validators.min(0.1), Validators.pattern(/^\d*\.?\d*$/)]],
    radiusUnit: [''],
  });
  public area: ServiceArea;
  public autocompleteValues: Observable<QueryAutocompletePrediction[]> = of([]);
  private destroyed = new Subject();
  private onChange: Function;

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
    this.initializeAutocomplete();
    this.savePlaceChanges();
    this.saveRadiusValueChanges();
    this.saveRadiusUnitChanges();
  }

  public ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public displayAutocompletePrediction(location: QueryAutocompletePrediction) {
    return location.description ? location.description : location;
  }

  private setSearchInputBasedOnGooglePlaceId(googlePlaceId: string) {
    this.googleMapsService.getPlaceDetails(googlePlaceId)
      .then(value => this.searchInput.setValue(value.name, {emitEvent: false}));
  }

  private initializeAutocomplete() {
    this.autocompleteValues = this.searchInput.valueChanges
      .pipe(
        filter(value => typeof value === 'string'),
        tap(() => this.onChange(null)),
        switchMap(value => this.googleMapsService.getSuggestions(value)),
        catchError((error, caught) => {
          if (error !== 'ZERO_RESULTS') {
            console.error(error);
          }
          return caught;
        }),
      );
  }

  private savePlaceChanges() {
    this.searchInput.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        filter(value => typeof value !== 'string'),
        switchMap((queryPrediction: QueryAutocompletePrediction) => this.googleMapsService.getPlaceDetails(queryPrediction.place_id)),
      )
      .subscribe((placeResult: PlaceResult) => {
        this.updateAreaWithPlaceResults(placeResult);
        this.updateComponentsValue();
      });
  }

  private saveRadiusValueChanges() {
    this.radiusValueInput.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((value: number) => {
        const newRadius = this.radiusValueInput.valid ? value : NaN;
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
}
