'use strict';

describe('Controller: ImpressionExpressionCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var ImpressionExpressionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImpressionExpressionCtrl = $controller('ImpressionExpressionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ImpressionExpressionCtrl.awesomeThings.length).toBe(3);
  });
});
