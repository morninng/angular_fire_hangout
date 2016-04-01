'use strict';

describe('Service: DataDebstyleService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var DataDebstyleService;
  beforeEach(inject(function (_DataDebstyleService_) {
    DataDebstyleService = _DataDebstyleService_;
  }));

  it('should do something', function () {
    expect(!!DataDebstyleService).toBe(true);
  });

});
