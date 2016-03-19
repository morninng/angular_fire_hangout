'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StatusbarCtrl
 * @description
 * # StatusbarCtrl 
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StatusbarCtrl',["$scope",'StatusMgrService','$timeout', function ($scope, StatusMgrService, $timeout) {

  	$scope.status_intro = "status_bar_element";
  	$scope.status_prep = "status_bar_element";
  	$scope.status_debate = "status_bar_element";
  	$scope.status_reflec = "status_bar_element";
  	$scope.status_complete = "status_bar_element_last";
  	$scope.game_status_service = StatusMgrService;

  	$scope.$watch('game_status_service.game_status', function(newValue, oldValue){
  		console.log( "status:" + newValue);
		$scope.status_intro = "status_bar_element";
		$scope.status_prep = "status_bar_element";
		$scope.status_debate = "status_bar_element";
		$scope.status_reflec = "status_bar_element";
		$scope.status_complete = "status_bar_element_last";

		$timeout(function() {
			switch(newValue){
				case "introduction":
				$scope.status_intro = "status_bar_element_selected";
				break;
				case "preparation":
				$scope.status_prep = "status_bar_element_selected";
				break;
				case "debate":
				$scope.status_debate = "status_bar_element_selected";
				break;
				case "reflection":
				$scope.status_reflec = "status_bar_element_selected";
				break;
				case "complete":
				$scope.status_complete = "status_bar_element_selected";
				break;
			}
		});
  	})


  }]);
