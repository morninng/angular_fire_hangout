'use strict';

describe('Service: MixideaHangoutSetting', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var MixideaHangoutSetting;
  beforeEach(inject(function (_MixideaHangoutSetting_) {
    MixideaHangoutSetting = _MixideaHangoutSetting_;
  }));

  it('should do something', function () {
    expect(!!MixideaHangoutSetting).toBe(true);
  });

});
