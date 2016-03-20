'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:OwnnoteCtrl
 * @description
 * # OwnnoteCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('OwnnoteCtrl',[ '$scope','MixideaSetting','$timeout','ParticipantMgrService', function ($scope, MixideaSetting, $timeout, ParticipantMgrService) {

	console.log("own_note");
	$scope.role_obj_array = new Array();
	$scope.current_role = null;
	$scope.participant_mgr = ParticipantMgrService;

	var NA_team_obj = [
		{name:"PM", shown_name: "Prime Minister"},
		{name:"LO", shown_name: "Leader Opposition"},
		{name:"MG", shown_name: "Member Government"},
		{name:"MO", shown_name: "Member Opposition"},
		{name:"LOR", shown_name: "Leader Opposition Reply"},
		{name:"PMR", shown_name: "Prime Minister Reply"}
	];
	var Asian_team_obj = [
		{name:"PM", shown_name: "Prime Minister"},
		{name:"LO", shown_name: "Leader Opposition"},
		{name:"DPM", shown_name:"Depty Prime Minister"},
		{name:"DLO", shown_name:"Depty Leader Opposition"},
		{name:"GW", shown_name:"Government Whip"},
		{name:"OW", shown_name:"Opposition Whip"},
		{name:"LOR", shown_name:"Leader Opposition Reply"},
		{name:"PMR", shown_name:"Prime Minister Reply"}
	];
	var BP_team_obj = [
		{name:"PM", shown_name: "Prime Minister"},
		{name:"LO", shown_name: "Leader Opposition"},
		{name:"DPM", shown_name:"Depty Prime Minister"},
		{name:"DLO", shown_name:"Depty Leader Opposition"},
		{name:"MG", shown_name: "Member Government"},
		{name:"MO", shown_name: "Member Opposition"},
		{name:"GW", shown_name:"Government Whip"},
		{name:"OW", shown_name:"Opposition Whip"},
	];

	$scope.$watch('participant_mgr.debate_style',function(){update_own_role_array();} );

	function update_own_role_array(){

		switch($scope.participant_mgr.debate_style){
			case "NA":
				$scope.role_obj_array = NA_team_obj;
			break;
			case "Asian":
				$scope.role_obj_array = Asian_team_obj;
			break;
			case "BP":
				$scope.role_obj_array = BP_team_obj;
			break;
		}
	}


	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var video_status_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
	var speaker_ref = video_status_ref.child("speaker");

	speaker_ref.on("value", function(snapshot){
  		var updated_speaker_obj = snapshot.val();
  		var role = null;
  		if(updated_speaker_obj){
			for(var key in updated_speaker_obj){
				var role = updated_speaker_obj[key].role;
			}
		}
		$timeout(function() {
			$scope.current_role = role;
		});


  	}, function(error){
  		console.log("fail while to retrieve speaker obj" + error);
  	})




  }]);
