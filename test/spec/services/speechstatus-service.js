'use strict';

describe('Service: SpeechStatusService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var SpeechStatusService;
  beforeEach(inject(function (_SpeechStatusService_) {
    SpeechStatusService = _SpeechStatusService_;
  }));

  it('should do something', function () {
    expect(!!SpeechStatusService).toBe(true);
  });

});
