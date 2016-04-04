'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:LinkTeamdiscussCtrl
 * @description
 * # LinkTeamdiscussCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('LinkTeamdiscussCtrl',['$scope','ParticipantMgrService','MixideaSetting','$timeout','SpeechStatusService', function ($scope, ParticipantMgrService, MixideaSetting, $timeout, SpeechStatusService) {

 
  	$scope.participant_mgr = ParticipantMgrService;
  	$scope.team_hangout_array = new Array();

  	var teamlist = new Object();
  	var url_list_array = new Array();


  	$scope.cancel_group_watch = $scope.$watch('participant_mgr.own_group', 
  		function(newValue, oldValue){
  			update_link();
  		}
  	);

  // var root_ref = new Firebase(MixideaSetting.firebase_url);
  var hangoutlist_team_ref = global_firebase_root_ref.child("event_related/game_hangout_obj_list/" + MixideaSetting.event_id + "/team_discussion");
  hangoutlist_team_ref.on("value", function(snapshot) {
  	url_list_array = snapshot.val();
  	update_link();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });


  function update_link(){

  	if(url_list_array.length==0 ){
  		return;
  	}
    $scope.team_hangout_array.length=0;


    var hangout_gid = "?gid=";
    var hangout_appid = MixideaSetting.hangout_appid;
    var hangout_query_key = "&gd=";
    var first_query_value = MixideaSetting.own_user_id;;
    var second_query_value = MixideaSetting.event_id;
    var third_query_value = "team_discussion";
    var fifth_query_value = $scope.participant_mgr.own_group;

 
  	if($scope.participant_mgr.is_audience_or_debater=="Audience"){
  		for(var i=0; i< $scope.participant_mgr.all_group_name_array.length; i++){
			var team_obj = new Object();
			team_obj.name = $scope.participant_mgr.all_group_name_array[i];
      var fourth_query_value = $scope.participant_mgr.all_group_name_array[i];
			var hangout_url = url_list_array[i];
			team_obj.hangout_url = hangout_url + hangout_gid + 
						            hangout_appid + hangout_query_key 
						         + first_query_value + "^" + second_query_value + "^" + third_query_value + 
                     "^" + fourth_query_value + "^" + fifth_query_value;
			$scope.team_hangout_array.push(team_obj);
  		}
  	}else{
  		var team_obj = new Object();
  		team_obj.name = $scope.participant_mgr.own_group;
      var fourth_query_value = $scope.participant_mgr.own_group;
  		var hangout_url = url_list_array[$scope.participant_mgr.own_group_id];
		team_obj.hangout_url = hangout_url + hangout_gid + 
						         hangout_appid + hangout_query_key 
                     + first_query_value + "^" + second_query_value + "^" + third_query_value + 
                     "^" + fourth_query_value + "^" + fifth_query_value;
  		$scope.team_hangout_array.push(team_obj);
  	}
    $timeout(function(){});
  }

  $scope.$on("$destroy", function() {
    hangoutlist_team_ref.off("value");
    $scope.cancel_group_watch();
  });


  $scope.show_explanation = false;

  $scope.teamlink_enter = function(){
    $scope.show_explanation = true;
    console.log("teamlink_enter");
  }

  $scope.teamlink_leave = function(){
    $scope.show_explanation = false;
    console.log("teamlink_leave");
  }

  SpeechStatusService.Finalize_Service();

  }]);
