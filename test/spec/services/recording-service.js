'use strict';

describe('Service: RecordingService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var RecordingService;
  beforeEach(inject(function (_RecordingService_) {
    RecordingService = _RecordingService_;
  }));

  it('should do something', function () {
    expect(!!RecordingService).toBe(true);
  });

});
