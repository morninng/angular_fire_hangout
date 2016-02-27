'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StatusbarCtrl
 * @description
 * # StatusbarCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StatusbarCtrl',["$scope", function ($scope) {

  	$scope.status_intro = "status_bar_element";
  	$scope.status_prep = "status_bar_element";
  	$scope.status_debate = "status_bar_element_selected";
  	$scope.status_reflec = "status_bar_element";
  	$scope.status_complete = "status_bar_element_last";




  }]);
