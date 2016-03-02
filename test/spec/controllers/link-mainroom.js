'use strict';

describe('Controller: LinkMainroomCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var LinkMainroomCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LinkMainroomCtrl = $controller('LinkMainroomCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LinkMainroomCtrl.awesomeThings.length).toBe(3);
  });
});
