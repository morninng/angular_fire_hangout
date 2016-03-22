'use strict';

describe('Service: HangoutService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var HangoutService;
  beforeEach(inject(function (_HangoutService_) {
    HangoutService = _HangoutService_;
  }));

  it('should do something', function () {
    expect(!!HangoutService).toBe(true);
  });

});
