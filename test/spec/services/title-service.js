'use strict';

describe('Service: TitleService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var TitleService;
  beforeEach(inject(function (_TitleService_) {
    TitleService = _TitleService_;
  }));

  it('should do something', function () {
    expect(!!TitleService).toBe(true);
  });

});
