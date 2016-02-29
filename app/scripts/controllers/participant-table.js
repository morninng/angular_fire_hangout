'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:ParticipantTableCtrl
 * @description
 * # ParticipantTableCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('ParticipantTableParentCtrl',['$scope','MixideaSetting','ParticipantMgrService',  function ($scope, MixideaSetting, ParticipantMgrService) {

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  	$scope.change_shown = false;
  	$scope.debate_style = null;

  	$scope.participant_mgr = ParticipantMgrService;




	$scope.show_change_style = function(){

	}

  	$scope.change_style = function(){

  	}

  }]);


angular.module('angularFireHangoutApp')
  .controller('ParticipantTableChildCtrl',['$scope','ParticipantMgrService', 'MixideaSetting',function ($scope, ParticipantMgrService,MixideaSetting) {

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.participant_mgr = ParticipantMgrService;
  $scope.own_user_id = MixideaSetting.own_user_id

	$scope.join = function(role_name){
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + role_name);
    role_participants_ref.transaction(function(current_value){
      if(current_value){
        alert("someone has already take this role")
        return;
      }
      return MixideaSetting.own_user_id;
    });
	}

	$scope.cancel = function(role_name){
    remove_user(role_name);
  }

  $scope.decline = function(role_name){
    remove_user(role_name);
  }

  function remove_user(role_name){
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + role_name);
    role_participants_ref.set(null,  function(error) {
      if (error) {
        console.log("cannot cancel" + error);
      } else {
        console.log("cancel succed");
      }
    });
  }


  }]);
