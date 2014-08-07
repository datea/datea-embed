'use strict';

describe('Service: Piecluster', function () {

  // load the service's module
  beforeEach(module('dateaEmbedApp'));

  // instantiate service
  var Piecluster;
  beforeEach(inject(function (_Piecluster_) {
    Piecluster = _Piecluster_;
  }));

  it('should do something', function () {
    expect(!!Piecluster).toBe(true);
  });

});
