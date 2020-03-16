import assert = require('assert');
import nock = require('nock');

export const assertAllDone = (scopes: nock.Scope[], errorMessage = 'Not all nock scopes have been called!') =>
  scopes.forEach(scope =>
    assert(scope.isDone(), errorMessage));

