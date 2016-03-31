'use strict';

describe('Service: SocketStreamsService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var SocketStreamsService;
  beforeEach(inject(function (_SocketStreamsService_) {
    SocketStreamsService = _SocketStreamsService_;
  }));

  it('should do something', function () {
    expect(!!SocketStreamsService).toBe(true);
  });

});
