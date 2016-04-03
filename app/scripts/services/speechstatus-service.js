'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.SpeechStatusService
 * @description
 * # SpeechStatusService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('SpeechStatusService',['MixideaSetting', '$firebaseObject','ParticipantMgrService','UtilService','$timeout','SoundPlayService', function (MixideaSetting,$firebaseObject, ParticipantMgrService, UtilService, $timeout, SoundPlayService) {


  var SpeechStatus_object = new Object();
  SpeechStatus_object.speaker_obj = new Object();
  SpeechStatus_object.poi_speaker_obj = new Object();
  SpeechStatus_object.current_speaker = null
  SpeechStatus_object.speech_start_time = 0;
  SpeechStatus_object.watch_counter = 0;
  SpeechStatus_object.poi_candidate_userobj_array = new Array();

  var video_status_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
  var video_status_fireobj = $firebaseObject(video_status_ref);
  var speaker_ref = video_status_ref.child("speaker");
  var speaker_fireobj = $firebaseObject(speaker_ref);

  var speaker_ref_own = video_status_ref.child("speaker/" + MixideaSetting.own_user_id);
  var speaker_fireobj_own = $firebaseObject(speaker_ref_own);


  var poi_ref = video_status_ref.child("poi");
  var poi_fireobj = $firebaseObject(poi_ref);

  var poi_candidate_ref = video_status_ref.child("poi/candidate");
  var poi_candidate_fireobj = $firebaseObject(poi_candidate_ref);

  var poi_candidate_ref_own = video_status_ref.child("poi/candidate/" + MixideaSetting.own_user_id);
  var poi_candidate_fireobj_own = $firebaseObject(poi_candidate_ref_own);

  var poi_taken_ref = video_status_ref.child("poi/taken");
  var poi_taken_fireobj = $firebaseObject(poi_taken_ref);
  var poi_taken_ref_own = video_status_ref.child("poi/taken/" + MixideaSetting.own_user_id);
  var poi_taken_fireobj_own = $firebaseObject(poi_taken_ref_own);



  SpeechStatus_object.speech_start = function(role){
      var own_side = ParticipantMgrService.own_side;
      var own_name = ParticipantMgrService.own_first_name;
      var full_role_name = UtilService.get_full_role_name(role);
      var speech_start_time_value = Date.now();

      var speaker_obj = {
        role: role,
        name:own_name,
        side: own_side,
        full_role_name: full_role_name,
        speech_start_time: speech_start_time_value
      }
      var own_speaker_obj = new Object();

      
      speaker_fireobj[MixideaSetting.own_user_id] = speaker_obj;
      speaker_fireobj.$save();    
      //speaker_ref_own.onDisconnect().set(null);
  }

  SpeechStatus_object.complete_speech = function(){
    speaker_fireobj.$remove();
    poi_candidate_fireobj.$remove();
    poi_taken_fireobj.$remove()
  }




/**/




  speaker_fireobj.$watch(function(){
      var updated_speaker_obj = speaker_fireobj;
      var keys = Object.keys(updated_speaker_obj);
      var filtered_key = keys.filter(function(element){return (element.charAt(0) !="$");});

      if(filtered_key.length ==0){
        for(var key in SpeechStatus_object.speaker_obj){
        delete SpeechStatus_object.speaker_obj[key]
        }
      }else{
        var key = filtered_key[0];
        SpeechStatus_object.speaker_obj.id = key;
        SpeechStatus_object.speaker_obj.name = updated_speaker_obj[key].name;
        SpeechStatus_object.speaker_obj.role = updated_speaker_obj[key].role;
        SpeechStatus_object.current_speaker = updated_speaker_obj[key].role;
        SpeechStatus_object.speaker_obj.side = updated_speaker_obj[key].side;
        SpeechStatus_object.speaker_obj.full_role_name = updated_speaker_obj[key].full_role_name;
        SpeechStatus_object.speech_start_time = updated_speaker_obj[key].speech_start_time;
      }
      SpeechStatus_object.watch_counter++; 
      //update_video_status()
  });





  SpeechStatus_object.poi = function(role){

    var own_group = ParticipantMgrService.own_group;
    poi_candidate_fireobj_own.$value = own_group;
    poi_candidate_fireobj_own.$save();
    poi_candidate_ref_own.onDisconnect().set(null);
    poi_taken_ref_own.onDisconnect().set(null);

  }
  SpeechStatus_object.finish_poi = function(){
    poi_fireobj.$remove()
  }


  //poi_candidate_fireobj.$watch(function() {

  poi_candidate_ref.on("value", function(snapshot){
    var poi_obj = snapshot.val();
    var previous_num = SpeechStatus_object.poi_candidate_userobj_array.length;
    var new_num = 0;
    SpeechStatus_object.poi_candidate_userobj_array.length=0;
    for (var key in poi_obj){
      var obj = {id: key, group:poi_obj[key]};
      SpeechStatus_object.poi_candidate_userobj_array.push(obj);
      new_num++;
    }; 
    if(new_num - previous_num > 0){
      SoundPlayService.Poi();
    }
    $timeout(function() {}); 
  });




  SpeechStatus_object.cancel_poi = function(){
    poi_candidate_fireobj_own.$remove();


  }

  SpeechStatus_object.take_poi = function(user_id, group){

    poi_taken_fireobj[user_id] = group;
    poi_taken_fireobj.$save();
    poi_candidate_fireobj.$remove();
  }


  poi_taken_fireobj.$watch(function() {

      var poi_taken_obj = poi_taken_fireobj;
      if(!poi_taken_obj){
        for(var key in SpeechStatus_object.poi_speaker_obj){
          delete SpeechStatus_object.poi_speaker_obj[key]
        }
      }else{
        var keys = Object.keys(poi_taken_obj);
        var filtered_key = keys.filter(function(element){return (element.charAt(0) !="$");});

        if(filtered_key.length ==0){
          for(var key in SpeechStatus_object.poi_speaker_obj){
            delete SpeechStatus_object.poi_speaker_obj[key]
          }
        }else{
          var poi_user_id = filtered_key[0];
          var poi_user_group = poi_taken_obj[poi_user_id];
          SpeechStatus_object.poi_speaker_obj.id = poi_user_id;
          SpeechStatus_object.poi_speaker_obj.speaker_group = 'Poi from ' + poi_user_group; 
        }
      }

      SpeechStatus_object.watch_counter++; 

    });





  return SpeechStatus_object;

  }]);
