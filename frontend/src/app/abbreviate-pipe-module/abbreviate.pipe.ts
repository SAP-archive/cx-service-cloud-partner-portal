import { Pipe, PipeTransform } from '@angular/core';
import * as XRegExp from 'xregexp';

@Pipe({name: 'abbreviate'})
export class AbbreviatePipe implements PipeTransform {
  public transform(name: string): string {
    if (!name) {
      return '--';
    }

    const unicodeWord = XRegExp('(\\pL|\\pN)[^\\pL|\\pN]*(\\pL|\\pN)');
    let result = unicodeWord.exec(name);
    const firstLetter = result && result[1] ? result[1].toUpperCase() : '';
    const secondLetter = result && result[2] ? result[2].toUpperCase() : '';
    return `${firstLetter}${secondLetter}`;
  }
}
