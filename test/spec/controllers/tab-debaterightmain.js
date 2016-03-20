'use strict';

describe('Controller: TabDebaterightmainCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var TabDebaterightmainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TabDebaterightmainCtrl = $controller('TabDebaterightmainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TabDebaterightmainCtrl.awesomeThings.length).toBe(3);
  });
});
