import { AbbreviatePipe } from './abbreviate.pipe';
import {cases} from 'jasmine-parameterized';

describe('AbbreviatePipe', () => {
  describe('transform()', () => {
    let abbreviator: AbbreviatePipe;

    beforeAll(() => {
      abbreviator = new AbbreviatePipe();
    });

    cases([
      {input: 'SAP', output: 'SA'},
      {input: '0 SAP', output: '0S'},
      {input: '01 SAP', output: '01'},
      {input: 'z1 SAP', output: 'Z1'},
      {input: 'z 3AP', output: 'Z3'},
      {input: '~ 123 partner', output: '12'},
      {input: '>23 partner', output: '23'},
      {input: ' 好> partner', output: '好P'},
      {input: 'Broup', output: 'BR'},
      {input: 'T-service', output: 'TS'},
      {input: 'T service', output: 'TS'},
      {input: 'T -> service', output: 'TS'},
      {input: '纵览', output: '纵览'},
      {input: '纵 - 览览览', output: '纵览'},
      {input: '可口', output: '可口'},
      {input: 'МцДоналдс', output: 'МЦ'},
      {input: '日本語', output: '日本'},
      {input: 'Ą Ęcki', output: 'ĄĘ'},
      {input: 'ć    ś company', output: 'ĆŚ'},
      {input: 'العربية', output: 'ال'},
      {input: 'إ نتاج الأثاث', output: 'إن'},
      {input: null, output: '--'},
      {input: undefined, output: '--'},
      {input: '', output: '--'},
    ])
    .it('should abbreviate names properly', (variant) => {
      expect(abbreviator.transform(variant.input)).toEqual(variant.output);
    });
  });
});
