'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StatusUpdateCtrl
 * @description
 * # StatusUpdateCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StatusUpdateCtrl',['$scope','MixideaSetting', function ($scope, MixideaSetting) {


  // var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  

  $scope.update_status = function(new_status){

  	if(new_status == "preparation"){
  		set_preparation_starttime();
  	}

    console.log(new_status);
    game_status_ref.set(new_status, function(error) {
	  if (error) {
	    console.log("saving status failed" + error);
	  } else {
	  }
	});
  }


  function set_preparation_starttime(){

  	var current_time = Date.now();

	  // var root_ref = new Firebase("https://mixidea.firebaseio.com/");
	  var prep_time_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/preparation_timer/")
	  prep_time_ref.set(current_time, function(error) {
	    if (error) {
	      console.log("setting time failed" + error);
	    } else {
	      console.log("set time succeed");
	    }
	  });
  }


}]);
