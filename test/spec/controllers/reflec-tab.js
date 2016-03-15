'use strict';

describe('Controller: ReflecTabCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var ReflecTabCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReflecTabCtrl = $controller('ReflecTabCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReflecTabCtrl.awesomeThings.length).toBe(3);
  });
});
