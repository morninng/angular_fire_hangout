'use strict';

describe('Controller: StatusbarCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var StatusbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatusbarCtrl = $controller('StatusbarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StatusbarCtrl.awesomeThings.length).toBe(3);
  });
});
