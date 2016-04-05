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

/*hangout status will be added*/

  if(MixideaSetting.hangout_execution){
    gapi.hangout.onApiReady.add(function(e){
      if(e.isApiReady){
        gapi.hangout.data.onStateChanged.add(hangout_game_status);
      }
    });
  }
  function hangout_game_status(){
    var game_status_str = gapi.hangout.data.getValue("game_status");
    console.log("game status from hangout : " + game_status_str);
    if(!game_status_str){
      return;
    }
    update_ui_router(game_status_str);
  }

/*********************/


  //var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  game_status_ref.on("value", function(snapshot) {

    var value = snapshot.val();
    update_ui_router(value);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  function update_ui_router(value){

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
  }


  return StatusMgr_Object;
    
}]);
