'use strict';

describe('Controller: VideodebateCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var VideodebateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideodebateCtrl = $controller('VideodebateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VideodebateCtrl.awesomeThings.length).toBe(3);
  });
});
