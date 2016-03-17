'use strict';

describe('Directive: writingDefintro', function () {

  // load the directive's module
  beforeEach(module('angularFireHangoutApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<writing-defintro></writing-defintro>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the writingDefintro directive');
  }));
});
