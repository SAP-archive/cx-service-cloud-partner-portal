import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import PlaceResult = google.maps.places.PlaceResult;
import PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;
import GeocoderResult = google.maps.GeocoderResult;
import GeocoderStatus = google.maps.GeocoderStatus;

@Injectable()
export class GoogleMapsService extends GoogleMapsAPIWrapper {
  constructor(private __loader: MapsAPILoader, private __zone: NgZone) {
    super(__loader, __zone);
  }

  public getSuggestions(address: string): Promise<QueryAutocompletePrediction[]> {
    return new Promise((resolve, reject) => {
      if (!address || address.length === 0) {
        resolve([]);
        return;
      }

      this.__loader.load().then(() => {
        let autocomplete = new google.maps.places.AutocompleteService();
        const callback = (predictions: QueryAutocompletePrediction[], status: PlacesServiceStatus) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            reject(status);
            return;
          }
          resolve(predictions);
        };
        autocomplete.getQueryPredictions({input: address}, callback);
      });
    });
  }

  public getAddressFromPosition(position: Position): Promise<GeocoderResult> {
    return new Promise((resolve, reject) => {
      this.__loader.load().then(() => {
        const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        const geocoder = new google.maps.Geocoder();
        const callback = (results: GeocoderResult[], status: GeocoderStatus) => {
          if (status !== google.maps.GeocoderStatus.OK) {
            reject(status);
            return;
          }
          resolve(results[0]);
        };
        geocoder.geocode({location: latlng}, callback);
      });
    });
  }

  public getPlaceDetails(placeId: string): Promise<PlaceResult> {
    return new Promise((resolve, reject) => {
      this.__loader.load().then(() => {
        const dummyDiv = document.createElement('div');
        let places = new google.maps.places.PlacesService(dummyDiv);
        const callback = (result: PlaceResult, status: PlacesServiceStatus) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            reject(status);
            return;
          }
          resolve(result);
        };

        if (placeId) {
          places.getDetails({placeId}, callback);
        }
      });
    });
  }

  public getPlaceIdFromAddress(address: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.__loader.load().then(() => {
        let geocoder = new google.maps.Geocoder();
        const callback = (results: GeocoderResult[], status: GeocoderStatus) => {
          if (status !== google.maps.GeocoderStatus.OK) {
            reject(status);
            return;
          }
          resolve(results[0].place_id);
        };
        geocoder.geocode({address}, callback);
      });
    });
  }
}
