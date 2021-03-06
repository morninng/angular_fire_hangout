'use strict';

describe('Directive: oneArgument', function () {

  // load the directive's module
  beforeEach(module('angularFireHangoutApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<one-argument></one-argument>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the oneArgument directive');
  }));
});
