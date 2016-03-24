'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:DebaterbarCtrl
 * @description
 * # DebaterbarCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('DebaterbarCtrl',['$scope','ParticipantMgrService','MixideaSetting','$timeout', function ($scope, ParticipantMgrService, MixideaSetting, $timeout) {


	$scope.participant_mgr = ParticipantMgrService;
	$scope.debater_array = [];
	$scope.$watch('participant_mgr.debate_style',function(){update_debater_array()} );


	var debater_array_NA = ["PM","LO","MG","MO","PMR","LOR"];
	var debater_array_Asian = ["PM","LO","DPM","DLO","GW","OW","LOR","PMR"];
	var debater_array_BP = ["PM","LO","DPM","DLO","MG","MO","GW","OW"];

	function update_debater_array(){
		if(!$scope.participant_mgr){
			return;
		}
		switch($scope.participant_mgr.debate_style){
			case "NA":
				for(var i=0; i< debater_array_NA.length; i++){
					$scope.debater_array.push({role_name:debater_array_NA[i], role_state:"normal"});
				}
			break;
			case "Asian":
				for(var i=0; i< debater_array_Asian.length; i++){
					$scope.debater_array.push({role_name:debater_array_Asian[i], role_state:"normal"});
				}
			break;
			case "BP":
				for(var i=0; i< debater_array_BP.length; i++){
					$scope.debater_array.push({role_name:debater_array_BP[i], role_state:"normal"});
				}
			break;
		}
	}



	function update_speaker(current_speaker_role){
		for(var i=0; i< $scope.debater_array.length; i++){
			$scope.debater_array[i].role_state = "normal";
			if($scope.debater_array[i].role_name == current_speaker_role){
				$scope.debater_array[i].role_state = "speaker";
			}
		}
		$timeout(function() {});
	}


	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var video_status_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
	var speaker_ref = video_status_ref.child("speaker");

	speaker_ref.on("value", function(snapshot){
		var speaker_obj = snapshot.val();
		if(!speaker_obj){
			current_speaker_role = null
			update_speaker(null);
		}else{
			var keys = Object.keys(speaker_obj);
			if(keys && keys[0]){
				var current_speaker_role = speaker_obj[keys[0]];
				var role_name = current_speaker_role.role;
				update_speaker(role_name);
			}
		}
		
	}, function(error){
		console.log("fail while to retrieve speaker obj" + error);
	})


  }]);
