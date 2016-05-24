'use strict';

describe('Controller: TeamchatCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var TeamchatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeamchatCtrl = $controller('TeamchatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TeamchatCtrl.awesomeThings.length).toBe(3);
  });
});
