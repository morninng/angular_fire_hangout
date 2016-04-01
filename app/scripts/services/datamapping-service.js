'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.DataMappingService
 * @description
 * # DataMappingService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('DataMappingService',['MixideaSetting','$rootScope', function (MixideaSetting,$rootScope) {

    var Mapping_Obj = new Object();
    Mapping_Obj.mapping_object = new Object();
    //var ParticipantMgrService = $injector.get('ParticipantMgrService');

    var root_ref = new Firebase(MixideaSetting.firebase_url);
    var mapping_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/mapping_data");
    mapping_ref.on("value", function(snapshot) {
      console.log("mapping data updated");
      var value  = snapshot.val();
      console.log(value);
      var key  = snapshot.key();
      if(value){
        Mapping_Obj.mapping_object = value;
      }else{
        Mapping_Obj.mapping_object = new Object();
      }
      check_ownexistence_addifnot();
      //ParticipantMgrService.update_ParticipantMgr_Object();
      $rootScope.$broadcast('update_participant_data');

    }, function (errorObject) {

      console.log("The read failed: " + errorObject.code);

    });


    if(MixideaSetting.hangout_execution){
      console.log("before api ready within participant mgr")
      gapi.hangout.onApiReady.add(function(e){
        console.log("api ready within participantmgr is called")
        if(e.isApiReady){
          console.log("become ready status within participant mgr");
          gapi.hangout.onParticipantsChanged.add(function(participant_change) {
            console.log("function added to participant changed");
            //update_hangout_participants();
            check_ownexistence_addifnot()
          });
        }
      });
    }

    window.addEventListener("online", 
      function(){
        console.log("online event");
        check_ownexistence_addifnot();
        setTimeout(function() {check_ownexistence_addifnot();}, 3000);
      }
    );


    function check_ownexistence_addifnot(){

      var own_exist = false;
      for(var key in Mapping_Obj.mapping_object){
        if(key == MixideaSetting.own_user_id){
          own_exist = true;
          return;
        }
      }
      if(!own_exist){
        var own_mapping_ref = mapping_ref.child(MixideaSetting.own_user_id);
        var own_hangout_id = global_own_hangout_id;
        if(!own_hangout_id){
          if(MixideaSetting.hangout_execution){
            own_hangout_id = gapi.hangout.getLocalParticipantId();
          }
        }
        own_mapping_ref.set(own_hangout_id);
      }
    }



    return Mapping_Obj;

  }]);
