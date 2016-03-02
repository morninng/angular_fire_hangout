'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:LinkMainroomCtrl
 * @description
 * # LinkMainroomCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('LinkMainroomCtrl',['$scope','MixideaSetting','$timeout', function ($scope, MixideaSetting,$timeout) {



	var hangout_gid = "?gid=";
	var hangout_appid = MixideaSetting.hangout_appid;
	var hangout_query_key = "&gd=";
	var first_query_value = MixideaSetting.own_user_id;;
	var second_query_value = MixideaSetting.event_id;
	var third_query_value = "main";


	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var hangoutlist_team_ref = root_ref.child("event_related/game_hangout_obj_list/" + MixideaSetting.event_id + "/main");
	hangoutlist_team_ref.on("value", function(snapshot) {
		$timeout(function() {
			var hangout_url = snapshot.val();
			$scope.hangout_url = hangout_url + hangout_gid + hangout_appid 
							+ hangout_query_key + first_query_value + "^" 
							+ second_query_value + "^" + third_query_value;
		});
	}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);

	});




  }]);
