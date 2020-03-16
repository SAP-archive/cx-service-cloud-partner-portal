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

const agmConfig: LazyMapsAPILoaderConfigLiteral = {
  /**
   * This token only works on coresystem.net domains.
   * Please replace it with your own Google Maps API key.
   */
  apiKey: 'AIzaSyArjJMCoH1iCUyi2qP7Pr4MA8jX16v3KdQ',
  channel: 'FSM-partner-portal',
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
  exports: [
    ServiceAreaCardComponent,
  ],
})
export class ServiceAreaModule {
}
