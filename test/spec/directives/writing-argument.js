'use strict';

describe('Directive: writingArgument', function () {

  // load the directive's module
  beforeEach(module('angularFireHangoutApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<writing-argument></writing-argument>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the writingArgument directive');
  }));
});
