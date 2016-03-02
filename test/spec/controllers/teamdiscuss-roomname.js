'use strict';

describe('Controller: TeamdiscussRoomnameCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var TeamdiscussRoomnameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeamdiscussRoomnameCtrl = $controller('TeamdiscussRoomnameCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TeamdiscussRoomnameCtrl.awesomeThings.length).toBe(3);
  });
});
