'use strict';

describe('Service: DataGameroleService', function () {

  // load the service's module
  beforeEach(module('angularFireHangoutApp'));

  // instantiate service
  var DataGameroleService;
  beforeEach(inject(function (_DataGameroleService_) {
    DataGameroleService = _DataGameroleService_;
  }));

  it('should do something', function () {
    expect(!!DataGameroleService).toBe(true);
  });

});
