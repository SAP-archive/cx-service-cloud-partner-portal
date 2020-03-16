import { Pipe, PipeTransform } from '@angular/core';
import { ServiceArea } from '../../model/service-area.model';
import { UnitsConverterService } from '../services/units-converter.service';

@Pipe({name: 'radiusInMeters'})
export class RadiusInMetersPipe implements PipeTransform {
  public transform(value: number, unit: ServiceArea['radius']['unit']): number {
    if (unit === 'km') {
      return UnitsConverterService.kilometersToMeters(value);
    } else {
      return UnitsConverterService.milesToMeters(value);
    }
  }
}
