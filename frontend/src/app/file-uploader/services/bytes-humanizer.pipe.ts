import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'humanizeBytes'})
export class BytesHumanizerPipe implements PipeTransform {
  public transform(bytes: number): string {
    if (bytes < 1000000) {
      return Math.round(bytes / 1000) + 'kb';
    } else {
      return Math.round(bytes / 1000000) + 'mb';
    }
  }
}
