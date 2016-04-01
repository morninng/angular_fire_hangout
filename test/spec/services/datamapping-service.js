'use strict';

describe('Service: DataMappingService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var DataMappingService;
  beforeEach(inject(function (_DataMappingService_) {
    DataMappingService = _DataMappingService_;
  }));

  it('should do something', function () {
    expect(!!DataMappingService).toBe(true);
  });

});
