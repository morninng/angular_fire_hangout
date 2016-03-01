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


  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  

  $scope.update_status = function(new_status){
    console.log(new_status);
    game_status_ref.set(new_status, function(error) {
	  if (error) {
	    console.log("saving status failed" + error);
	  } else {
	    console.log("status is updated");
	  }
	});
  }


}]);
