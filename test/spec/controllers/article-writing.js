'use strict';

describe('Controller: ArticleWritingCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFireHangoutApp'));

  var ArticleWritingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArticleWritingCtrl = $controller('ArticleWritingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ArticleWritingCtrl.awesomeThings.length).toBe(3);
  });
});
