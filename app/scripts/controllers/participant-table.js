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


  $scope.participant_mgr = ParticipantMgrService;

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.change_shown = false;
  $scope.participant_mgr = ParticipantMgrService;

 // var deb_style_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style");



  $scope.show_change_style = function(){
    $scope.change_shown = true;
  }

  $scope.change_style = function(style){
    console.log("change style clicked :  " + style);
    $scope.change_shown = false;
    $scope.participant_mgr.set_style(style);

    //deb_style_ref.set(style);
    //console.log("change style " + style);
  }

  $scope.mouseout_change_style = function(){
    remove_change_style_pain();
  }

  $scope.cancel_change_style = function(){
    remove_change_style_pain();
  }

  function remove_change_style_pain(){
    $scope.change_shown = false;
  }

}]);


angular.module('angularFireHangoutApp')
  .controller('ParticipantTableChildCtrl',['$scope','ParticipantMgrService', 'MixideaSetting',function ($scope, ParticipantMgrService,MixideaSetting) {

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.participant_mgr = ParticipantMgrService;
  $scope.own_user_id = MixideaSetting.own_user_id

	$scope.join = function(role_name){
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + $scope.participant_mgr.debate_style + "/" + role_name);
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
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + $scope.participant_mgr.debate_style + "/" + role_name);
    role_participants_ref.set(null,  function(error) {
      if (error) {
        console.log("cannot cancel" + error);
      } else {
        console.log("cancel succed");
      }
    });
  }


  }]);
