'use strict';

describe('Service: StatusMgrService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var StatusMgrService;
  beforeEach(inject(function (_StatusMgrService_) {
    StatusMgrService = _StatusMgrService_;
  }));

  it('should do something', function () {
    expect(!!StatusMgrService).toBe(true);
  });

});
