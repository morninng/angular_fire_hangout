'use strict';

describe('Service: ParticipantMgrService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var ParticipantMgrService;
  beforeEach(inject(function (_ParticipantMgrService_) {
    ParticipantMgrService = _ParticipantMgrService_;
  }));

  it('should do something', function () {
    expect(!!ParticipantMgrService).toBe(true);
  });

});
