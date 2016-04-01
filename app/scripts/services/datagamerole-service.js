'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.DataGameroleService
 * @description
 * # DataGameroleService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('DataGameroleService',['MixideaSetting','$rootScope', function (MixideaSetting,$rootScope) {

    var GameRole_Object = new Object();
    GameRole_Object.all_style_roledata = new Object();
    //var ParticipantMgrService = $injector.get('ParticipantMgrService');

    var root_ref = new Firebase(MixideaSetting.firebase_url);
    var game_role_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/");
    game_role_ref.on("value", function(snapshot) {
      var value  = snapshot.val();
      if(value){
        GameRole_Object.all_style_roledata = value;
      }else{
        GameRole_Object.all_style_roledata = new Object()
      }
      //ParticipantMgrService.update_ParticipantMgr_Object();
      $rootScope.$broadcast('update_participant_data');

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });



    return GameRole_Object;

  }]);
