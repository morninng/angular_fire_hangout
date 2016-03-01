'use strict';

describe('Controller: LinkTeamdiscussCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var LinkTeamdiscussCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LinkTeamdiscussCtrl = $controller('LinkTeamdiscussCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LinkTeamdiscussCtrl.awesomeThings.length).toBe(3);
  });
});
