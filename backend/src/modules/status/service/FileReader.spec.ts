import assert = require('assert');
import { ILogger } from '../model/ILogger';
import { FileReader } from './FileReader';

describe('FileReader', function () {
  const logger = console as Readonly<ILogger>;

  it('should not throw if the file can not be found and should return null', () => {
    const reader = new FileReader(logger);
    const result = reader.tryReadJsonFile('./randomfile.json', false);

    assert.deepEqual(result, null);
  });
});
