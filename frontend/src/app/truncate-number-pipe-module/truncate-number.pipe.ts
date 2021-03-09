import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateNumber',
})
export class TruncateNumberPipe implements PipeTransform {
  public transform(value: number): string {
    return value > 999 ? '999+' : value.toString(10);
  }
}
