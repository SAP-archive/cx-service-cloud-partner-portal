import { Component, Input, ViewChild } from '@angular/core';
import { AgmCircle, LatLngBounds } from '@agm/core';
import { ServiceArea } from '../../../model/service-area.model';

@Component({
  selector: 'pp-map-with-circle-area',
  templateUrl: './map-with-circle-area.component.html',
  styleUrls: ['./map-with-circle-area.component.scss'],
})
export class MapWithCircleAreaComponent {
  @Input() public area: ServiceArea;
  @Input() public height: number;
  @Input() public width: number;
  @Input() public showZoomControls: boolean = true;
  @ViewChild(AgmCircle) public circle: AgmCircle;
  public bounds: Promise<LatLngBounds>;

  public onChange() {
    this.updateBounds();
  }

  private updateBounds() {
    if (this.circle) {
      this.bounds = this.circle.getBounds();
    }
  }
}
