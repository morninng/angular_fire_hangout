'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.StatusMgrService
 * @description
 * # StatusMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('StatusMgrService',['MixideaSetting','$state', function (MixideaSetting,$state) {

  var StatusMgr_Object = new Object()

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  game_status_ref.on("value", function(snapshot) {

    var value = snapshot.val();
    if(value !=StatusMgr_Object.game_status){
      StatusMgr_Object.game_status = value;
      $state.go('main.' + value);
    }

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });


  return StatusMgr_Object;
    
}]);
