'use strict';

describe('Service: SoundPlayService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var SoundPlayService;
  beforeEach(inject(function (_SoundPlayService_) {
    SoundPlayService = _SoundPlayService_;
  }));

  it('should do something', function () {
    expect(!!SoundPlayService).toBe(true);
  });

});
