'use strict';

describe('Controller: DebaterbarCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var DebaterbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DebaterbarCtrl = $controller('DebaterbarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DebaterbarCtrl.awesomeThings.length).toBe(3);
  });
});
