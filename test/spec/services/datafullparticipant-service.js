'use strict';

describe('Service: DataFullparticipantService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var DataFullparticipantService;
  beforeEach(inject(function (_DataFullparticipantService_) {
    DataFullparticipantService = _DataFullparticipantService_;
  }));

  it('should do something', function () {
    expect(!!DataFullparticipantService).toBe(true);
  });

});
