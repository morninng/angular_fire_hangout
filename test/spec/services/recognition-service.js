'use strict';

describe('Service: RecognitionService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var RecognitionService;
  beforeEach(inject(function (_RecognitionService_) {
    RecognitionService = _RecognitionService_;
  }));

  it('should do something', function () {
    expect(!!RecognitionService).toBe(true);
  });

});
