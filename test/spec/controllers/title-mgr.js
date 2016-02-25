'use strict';

describe('Controller: TitleMgrCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var TitleMgrCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TitleMgrCtrl = $controller('TitleMgrCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TitleMgrCtrl.awesomeThings.length).toBe(3);
  });
});
