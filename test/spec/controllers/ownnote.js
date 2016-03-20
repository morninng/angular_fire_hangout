'use strict';

describe('Controller: OwnnoteCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var OwnnoteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OwnnoteCtrl = $controller('OwnnoteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OwnnoteCtrl.awesomeThings.length).toBe(3);
  });
});
