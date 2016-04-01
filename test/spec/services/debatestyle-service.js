'use strict';

describe('Service: DebateStyleService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var DebateStyleService;
  beforeEach(inject(function (_DebateStyleService_) {
    DebateStyleService = _DebateStyleService_;
  }));

  it('should do something', function () {
    expect(!!DebateStyleService).toBe(true);
  });

});
