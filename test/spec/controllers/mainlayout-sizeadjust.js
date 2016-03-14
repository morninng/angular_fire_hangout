'use strict';

describe('Controller: MainlayoutSizeadjustCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var MainlayoutSizeadjustCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainlayoutSizeadjustCtrl = $controller('MainlayoutSizeadjustCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainlayoutSizeadjustCtrl.awesomeThings.length).toBe(3);
  });
});
