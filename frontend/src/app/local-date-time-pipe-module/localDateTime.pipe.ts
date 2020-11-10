import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'localDateTimeFormat' })
export class LocalDateTimePipe implements PipeTransform {
    public transform(dateTime: string | Date, local?: string): string {
        if (local && moment.locale() !== local) {
            moment.locale(local);
        }
        return moment(dateTime).format('L') + ' ' + moment(dateTime).format('HH:mm:ss');
    }
}
