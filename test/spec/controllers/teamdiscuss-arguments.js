'use strict';

describe('Controller: TeamdiscussArgumentsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var TeamdiscussArgumentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeamdiscussArgumentsCtrl = $controller('TeamdiscussArgumentsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TeamdiscussArgumentsCtrl.awesomeThings.length).toBe(3);
  });
});
