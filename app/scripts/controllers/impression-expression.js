'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:ImpressionExpressionCtrl
 * @description
 * # ImpressionExpressionCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('ImpressionExpressionCtrl',['$scope','MixideaSetting','SoundPlayService','ParticipantMgrService','$timeout', function ($scope,MixideaSetting, SoundPlayService, ParticipantMgrService, $timeout) {

  	$scope.participant_mgr = ParticipantMgrService;

  	$scope.hearhear_users_array = new Array();
  	$scope.booboo_users_array = new Array();
	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var impression_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/impression_expression");
	var hearhear_ref = impression_ref.child("hearhear");
	var hearhear_own_ref = hearhear_ref.child(MixideaSetting.own_user_id)
	var booboo_ref = impression_ref.child("booboo");
	var booboo_own_ref = booboo_ref.child(MixideaSetting.own_user_id)



	$scope.click_hearhear = function(){
		console.log("hearhear");
		hearhear_own_ref.set(true);
		hearhear_own_ref.onDisconnect().set(null);
		setTimeout(function(){hearhear_own_ref.set(null)},2000);
	}

	$scope.click_booboo = function(){
		booboo_own_ref.set(true);
		booboo_own_ref.onDisconnect().set(null);
		setTimeout(function(){booboo_own_ref.set(null)},2000);
	}


	var current_hearhear_num = 0;
	var current_booboo_num = 0;


	hearhear_ref.on("value", function(snapshot){
		var hearhear_user_obj = snapshot.val();
		$scope.hearhear_users_array.length = 0;
		for(var key in hearhear_user_obj){
			$scope.hearhear_users_array.push(key);
		}
		if($scope.hearhear_users_array.length > current_hearhear_num){
			SoundPlayService.HearHear();
		}
		current_hearhear_num = $scope.hearhear_users_array.length;
		$timeout(function() {});

	}, function(error_obj){
		console.log(error_obj);
	})


	booboo_ref.on("value", function(snapshot){
		var booboo_user_obj = snapshot.val();
		$scope.booboo_users_array.length = 0;
		for(var key in booboo_user_obj){
			$scope.booboo_users_array.push(key);
		}
		if($scope.booboo_users_array.length > current_booboo_num){
			SoundPlayService.BooBoo();
		}
		current_booboo_num = $scope.booboo_users_array.length;
		$timeout(function() {});

	}, function(error_obj){
		console.log(error_obj);
	})

	$scope.$on("$destroy", function() {
		booboo_ref.off("value");
		hearhear_ref.off("value");
	});


  }]);
