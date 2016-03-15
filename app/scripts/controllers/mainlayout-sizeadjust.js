'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:MainlayoutSizeadjustCtrl
 * @description
 * # MainlayoutSizeadjustCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('MainlayoutSizeadjustCtrl',["$scope",'StatusMgrService','$timeout', function ($scope, StatusMgrService, $timeout) {



  	$scope.game_status_service = StatusMgrService;

	$scope.$watch('game_status_service.game_status', function(newValue, oldValue){
		console.log( "status:" + newValue);

		$timeout(function() {
			switch(newValue){
				case "introduction":
					$scope.top_right_width = {width:"0px"};
					$scope.main_left_above_left_width = {width:"300px"}
					$scope.main_left_above_right_width = {width:"250px"};
					$scope.main_left_below_width = {width:"550px"};
					$scope.main_right_width = {width:"550px"};
				break;
				case "preparation":
					$scope.top_right_width = {width:"0px"};
					$scope.main_left_above_left_width = {width:"300px"}
					$scope.main_left_above_right_width = {width:"250px"};
					$scope.main_left_below_width = {width:"550px"};
					$scope.main_right_width = {width:"550px"};
				break;
				case "debate":
					$scope.top_right_width = {width:"250px"};
					$scope.main_left_above_left_width = {width:"300px"}
					$scope.main_left_above_right_width = {width:"0px"};
					$scope.main_left_below_width = {width:"0px"};
					$scope.main_width = {width:"1000px"};
					$scope.main_right_width = {width:"700px"};


				break;
				case "reflection":
					$scope.top_right_width = {width:"250px"};
					$scope.main_left_above_left_width = {width:"0px"}
					$scope.main_left_above_right_width = {width:"0px"};
					$scope.main_left_below_width = {width:"0px"};
					$scope.main_width = {width:"100%"};
					$scope.main_right_width = {width:"100%"};
				break;
				case "complete":
					$scope.top_right_width = {width:"250px"};
				break;
			}
		});




	});




  }]);
