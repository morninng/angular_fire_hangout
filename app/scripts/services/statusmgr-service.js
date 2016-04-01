'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.StatusMgrService
 * @description
 * # StatusMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('StatusMgrService',['MixideaSetting','$state','HangoutService','SoundPlayService', function (MixideaSetting,$state, HangoutService, SoundPlayService) {

  var StatusMgr_Object = new Object()
  StatusMgr_Object.game_status = null;

  //var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  game_status_ref.on("value", function(snapshot) {

    var value = snapshot.val();
    if(value !=StatusMgr_Object.game_status){
      StatusMgr_Object.game_status = value;
      if(value=="reflection"){
        $state.go('main.reflection.write_article');
      }else{
        $state.go('main.' + value);
      }

      if(value =='reflection' || value=='complete'){
        HangoutService.set_video_visible(false);
      }
      SoundPlayService.Cursol();
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });


  return StatusMgr_Object;
    
}]);
