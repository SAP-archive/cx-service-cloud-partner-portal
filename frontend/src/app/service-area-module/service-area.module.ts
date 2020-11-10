import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceAreaCardComponent } from './components/service-area-card/service-area-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MapWithCircleAreaComponent } from './components/map-with-circle-area/map-with-circle-area.component';
import { AgmCoreModule, LazyMapsAPILoaderConfigLiteral } from '@agm/core';
import { RadiusInMetersPipe } from './pipes/radius-in-meters.pipe';
import { GoogleMapsService } from './services/google-maps.service';

const agmConfig: LazyMapsAPILoaderConfigLiteral = {
  apiKey: '', // put your Google Maps API key here
  channel: '', // put your Google Maps API channel here
  libraries: ['places'],
};

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot(agmConfig),
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    ServiceAreaCardComponent,
    MapWithCircleAreaComponent,
    RadiusInMetersPipe,
  ],
  providers: [
    GoogleMapsService,
  ],
  exports: [
    ServiceAreaCardComponent,
  ],
})
export class ServiceAreaModule {
}
