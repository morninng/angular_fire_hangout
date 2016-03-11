'use strict';

describe('Service: UtilService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var UtilService;
  beforeEach(inject(function (_UtilService_) {
    UtilService = _UtilService_;
  }));

  it('should do something', function () {
    expect(!!UtilService).toBe(true);
  });

});
