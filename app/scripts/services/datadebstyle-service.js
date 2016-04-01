'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.DataDebstyleService
 * @description
 * # DataDebstyleService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('DataDebstyleService',['MixideaSetting','$rootScope', function ( MixideaSetting, $rootScope) {


   var DebateStyle_Object = new Object();
   DebateStyle_Object.deb_style = null;
  //var ParticipantMgrService = $injector.get('ParticipantMgrService');


    var root_ref = new Firebase(MixideaSetting.firebase_url);
    var deb_style_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style");

    deb_style_ref.on("value", function(snapshot) {
      var style_val  = snapshot.val();
      DebateStyle_Object.deb_style = style_val;
      //ParticipantMgrService.update_ParticipantMgr_Object();
      $rootScope.$broadcast('update_participant_data');

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


    DebateStyle_Object.set_style = function(value){
      deb_style_ref.set(value);
    }

    return DebateStyle_Object;

  }]);
