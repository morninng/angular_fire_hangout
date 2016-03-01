'use strict';

describe('Controller: CountPreptimeCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var CountPreptimeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CountPreptimeCtrl = $controller('CountPreptimeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CountPreptimeCtrl.awesomeThings.length).toBe(3);
  });
});
