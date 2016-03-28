'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TitleMgrCtrl
 * @description
 * # TitleMgrCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TitleMgrCtrl',['$scope', 'MixideaSetting','$timeout','TitleService', function ($scope, MixideaSetting, $timeout, TitleService) {


  	$scope.under_edit = false;
  	$scope.dynamic_width = new Object();
  	$scope.title_data = TitleService;



	function update_input_text_width(){

		var motion_length = TitleService.motion_screen.length;
		var input_width_em = 0;
		if(motion_length > 45){
			input_width_em = 45;
		}else if (motion_length > 20){
			input_width_em = motion_length;
		}else{
			input_width_em = 20;
		}
		var motion_length_str = String(input_width_em) + "em"
		$scope.dynamic_width = {width:motion_length_str} ;	
	}

	$scope.on_motion_change = function(){
		update_input_text_width()
	}

	$scope.edit_start = function(){
		TitleService.edit_start()
		$scope.under_edit = true;
		update_input_text_width();
	}

	$scope.save = function(){

		TitleService.save();
		$scope.under_edit = false;

	}

	$scope.cancel = function(){
		TitleService.cancel();
		$scope.under_edit = false;
	}




  }]);
