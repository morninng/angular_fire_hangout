'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TitleMgrCtrl
 * @description
 * # TitleMgrCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TitleMgrCtrl',['$scope', 'MixideaSetting','$timeout', function ($scope, MixideaSetting, $timeout) {


  	$scope.under_edit = false;
  	$scope.data = new Object();
  	$scope.data.motion = "";

	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var title_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/motion")

	title_ref.on("value", function(snapshot) {
		$timeout(function() {
			$scope.data.motion = snapshot.val();

			if(!$scope.data.motion){
				$scope.motion_sentence = "motion_sentence_Red_xlarge";
  				$scope.data.motion = "input motion here";
  				$scope.data.motion_exist = false;
  				return;	
			}
			var title_len = $scope.data.motion.length;			
			if(title_len == 0){
				$scope.motion_sentence = "motion_sentence_Red_xlarge";
  				$scope.data.motion = "input motion here";
  				$scope.data.motion_exist = false;
			}if(title_len < 60 ){
				$scope.motion_sentence = "motion_sentence_large";
  				$scope.data.motion_exist = true;
			}else if (title_len < 100){
				$scope.motion_sentence = "motion_sentence_middle";
  				$scope.data.motion_exist = true;
			}else{
				$scope.motion_sentence = "motion_sentence_small";
  				$scope.data.motion_exist = true;
			}
		});
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});

	function update_input_text_width(){
		var motion_length = $scope.data.motion.length;
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
		update_input_text_width()
		if(!$scope.data.motion_exist){
			$scope.data.motion = "";
		}
		$scope.under_edit = true;
	}

	$scope.save = function(){
		title_ref.set($scope.data.motion);
		$scope.under_edit = false;

	}

	$scope.cancel = function(){
		$scope.under_edit = false;
	}


  }]);
