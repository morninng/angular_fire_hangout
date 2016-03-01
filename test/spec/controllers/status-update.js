'use strict';

describe('Controller: StatusUpdateCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var StatusUpdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatusUpdateCtrl = $controller('StatusUpdateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StatusUpdateCtrl.awesomeThings.length).toBe(3);
  });
});
