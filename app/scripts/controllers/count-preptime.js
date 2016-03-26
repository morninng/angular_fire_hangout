'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:CountPreptimeCtrl
 * @description
 * # CountPreptimeCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('CountPreptimeCtrl',['$scope','MixideaSetting', '$timeout',function ($scope, MixideaSetting, $timeout) {

	$scope.prep_time = "start preparation";
	var start_time = null;

	var root_ref = new Firebase("https://mixidea.firebaseio.com/");
	var preptime_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/preparation_timer/")
	preptime_ref.on("value", function(snapshot){
		start_time = snapshot.val();
	}, function(){
		console.log("fail to load timer data");
	});


	var timer = setInterval( function(){

		if(!start_time){
			return;
		}
		var current_time = Date.now();
		var elapsed_time = current_time - start_time;
		if(elapsed_time < 0){
			return;
		}
		var elapled_second = elapsed_time/1000
		var elapsed_hour = elapled_second/60/60;
		elapsed_hour = Math.floor(elapsed_hour);
		var elapsed_minute = (elapled_second - elapsed_hour*60*60)/60;
		elapsed_minute = Math.floor(elapsed_minute);
		elapled_second = elapled_second - elapsed_hour*60*60 - elapsed_minute*60;
		elapled_second = Math.floor(elapled_second);
		elapled_second = ("0" + elapled_second).slice(-2);
		elapsed_minute = ("0" + elapsed_minute).slice(-2);

		
		$scope.prep_time = elapsed_minute + ":" + elapled_second + " has passed";
		$timeout(function() {});

	}, 1000);


	$scope.$on("$destroy", function() {
		clearInterval(timer);
		preptime_ref.off("value")
	});



  }]);
