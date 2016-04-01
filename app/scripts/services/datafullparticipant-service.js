'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.DataFullparticipantService
 * @description
 * # DataFullparticipantService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('DataFullparticipantService',['MixideaSetting','$rootScope', function (MixideaSetting,$rootScope) {
    // Service logic
    // ...

  var FullParticipant_Object = new Object();
  FullParticipant_Object.user_object_data = new Object();
  FullParticipant_Object.own_data = new Object();


  var full_participants_object = null;
  var total_number_participants = 0;
  //var ParticipantMgrService = $injector.get('ParticipantMgrService');


  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var full_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/full")
  full_participants_ref.on("value", function(snapshot) {
    var value  = snapshot.val();
    if(value){
      full_participants_object = value;
    }else{
      full_participants_object = new Object();
    }
    retrieve_participants_all(full_participants_object);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });




  function retrieve_participants_all(full_participants_object){

    for(key in FullParticipant_Object.user_object_data){
      delete FullParticipant_Object.user_object_data[key]
    }
    FullParticipant_Object.user_object_data = null;
    FullParticipant_Object.user_object_data = new Object();
    total_number_participants = 0;
    for(var key in full_participants_object){
      retrieve_participant(key);
      total_number_participants++;
    }
  }


  function retrieve_participant(participant_id){
    var user_obj_ref = root_ref.child("users/user_basic/" + participant_id);
    user_obj_ref.on("value", function(snapshot) {
      var user_obj  = snapshot.val();
      var user_key = snapshot.key();
      FullParticipant_Object.user_object_data[user_key] = user_obj;
      var user_object_data_len = check_object_length(FullParticipant_Object.user_object_data);
      if(user_key == MixideaSetting.own_user_id){
        FullParticipant_Object.own_data.first_name = user_obj.first_name;
        FullParticipant_Object.own_data.last_name = user_obj.last_name;
      }
      if(user_object_data_len == total_number_participants){
        //ParticipantMgrService.update_ParticipantMgr_Object();
        $rootScope.$broadcast('update_participant_data');
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  
  function check_object_length(obj){
    var len = 0;
    for(var key in obj){
      len++
    }
    return len;
  }



    return FullParticipant_Object;
  }]);
