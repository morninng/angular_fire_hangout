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

  var initial_execution = function(){

    if(MixideaSetting.hangout_execution){
      gapi.hangout.onApiReady.add(function(e){
        if(e.isApiReady){
          gapi.hangout.data.onStateChanged.add(function(event) {
            hangout_status_speaker();
            hangout_status_poitaken();
          });
          gapi.hangout.onParticipantsRemoved.add(function(removed_participant_array) {
            hangout_participant_removed(removed_participant_array);
          });
          hangout_status_speaker();
            hangout_status_poitaken();
        }
      });
    }else{

      speaker_fireobj.$watch(function(){
        var speaker_obj = speaker_fireobj;
        var keys = Object.keys(speaker_obj);
        var filtered_key = keys.filter(function(element){return (element.charAt(0) !="$");});
        var obj = new Object();
        if(filtered_key.length > 0){
          obj[filtered_key] = speaker_fireobj[filtered_key];
        }
        update_syncdata_speaker(obj);
      });

      poi_taken_fireobj.$watch(function() {

        var poi_taken_obj = poi_taken_fireobj;
        var keys = Object.keys(poi_taken_obj);
        var filtered_key = keys.filter(function(element){return (element.charAt(0) !="$");});
        var obj = new Object();
        if(filtered_key.length > 0){
          obj[filtered_key] = poi_taken_obj[filtered_key];
        }
        update_syncdata_poi_taken(obj);
      });

    }
  }

  var hangout_participant_removed = function(Removed_obj){

    var removed_participants_array = Removed_obj.removedParticipants;

    for(var i=0; i< removed_participants_array.length; i++){
      var hangout_id = removed_participants_array[i].id
      var removed_user_id = ParticipantMgrService.getUserid_fromHangoutid(hangout_id);
      if(removed_user_id){
        if(SpeechStatus_object.speaker_obj && (removed_user_id == SpeechStatus_object.speaker_obj.id)){
          SpeechStatus_object.Clear_AllSpeechData();

        }else if(SpeechStatus_object.poi_speaker_obj && (removed_user_id == SpeechStatus_object.poi_speaker_obj.id)){
          SpeechStatus_object.finish_poi();
        }
      }
    }
  }


  var hangout_status_speaker = function(){

    var speaker_status_str = gapi.hangout.data.getValue("speaker_status");
    console.log("hangout speaker status" + speaker_status_str);
    var speaker_obj = new Object();

    if(speaker_status_str){
      speaker_obj = JSON.parse(speaker_status_str);
    }
    update_syncdata_speaker(speaker_obj);

  }


  var update_syncdata_speaker = function(updated_speaker_obj){


      var key = Object.keys(updated_speaker_obj)[0];

      if(!key){
        for(var key in SpeechStatus_object.speaker_obj){
        delete SpeechStatus_object.speaker_obj[key]
        }
      }else{
        SpeechStatus_object.speaker_obj.id = key;
        SpeechStatus_object.speaker_obj.name = updated_speaker_obj[key].name;
        SpeechStatus_object.speaker_obj.role = updated_speaker_obj[key].role;
        SpeechStatus_object.current_speaker = updated_speaker_obj[key].role;
        SpeechStatus_object.speaker_obj.side = updated_speaker_obj[key].side;
        SpeechStatus_object.speaker_obj.full_role_name = updated_speaker_obj[key].full_role_name;
        SpeechStatus_object.speech_start_time = updated_speaker_obj[key].speech_start_time;
      }
      SpeechStatus_object.watch_counter++; 
      $timeout(function() {});
  }



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

      if(MixideaSetting.hangout_execution){
        var own_speaker_obj = new Object();
        own_speaker_obj[MixideaSetting.own_user_id] = speaker_obj;
        var own_speaker_str = JSON.stringify(own_speaker_obj);
        gapi.hangout.data.submitDelta({"speaker_status":own_speaker_str});
      }else{
        speaker_fireobj[MixideaSetting.own_user_id] = speaker_obj;
        speaker_fireobj.$save();
      }    
      //speaker_ref_own.onDisconnect().set(null);
  }



  SpeechStatus_object.complete_speech = function(){

      if(MixideaSetting.hangout_execution){
        gapi.hangout.data.clearValue("speaker_status");
        gapi.hangout.data.clearValue("poi_taken");
      }else{
        speaker_fireobj.$remove();
        poi_taken_fireobj.$remove();
      }
      poi_candidate_fireobj.$remove();

  }


/**/




  SpeechStatus_object.poi = function(role){

    var own_group = ParticipantMgrService.own_group;
    poi_candidate_fireobj_own.$value = own_group;
    poi_candidate_fireobj_own.$save();
    poi_candidate_ref_own.onDisconnect().set(null);
    poi_taken_ref_own.onDisconnect().set(null);

  }
  SpeechStatus_object.finish_poi = function(){

    if(MixideaSetting.hangout_execution){
      gapi.hangout.data.clearValue("poi_taken");
    }else{
      poi_fireobj.$remove()
    }
    poi_candidate_fireobj.$remove();

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

    if(MixideaSetting.hangout_execution){
      var poi_taken_obj = new Object();
      poi_taken_obj[user_id] = group
      var poi_taken_str = JSON.stringify(poi_taken_obj);
      gapi.hangout.data.submitDelta({"poi_taken":poi_taken_str});
    }else{
      poi_taken_fireobj.$save();
    }
    poi_candidate_fireobj.$remove();
  }




 

  var hangout_status_poitaken = function(){

    var poitaken_status_str = gapi.hangout.data.getValue("poi_taken");
    console.log("hangout poitaken status : " + poitaken_status_str);
    var poitaken_obj = new Object();

    if(poitaken_status_str){
      poitaken_obj = JSON.parse(poitaken_status_str);
    }
    update_syncdata_poi_taken(poitaken_obj);

  }



  var update_syncdata_poi_taken = function(updated_poitaken_obj){

      var key = Object.keys(updated_poitaken_obj)[0];

      if(!key){
        for(var key in SpeechStatus_object.poi_speaker_obj){
          delete SpeechStatus_object.poi_speaker_obj[key]
        }
      }else{
          var poi_user_id = key;
          var poi_user_group = updated_poitaken_obj[poi_user_id];
          SpeechStatus_object.poi_speaker_obj.id = poi_user_id;
          SpeechStatus_object.poi_speaker_obj.speaker_group = 'Poi from ' + poi_user_group;        
      }

      SpeechStatus_object.watch_counter++; 
      $timeout(function() {});
  }


  SpeechStatus_object.Clear_AllSpeechData = function(){
      if(MixideaSetting.hangout_execution){
        gapi.hangout.data.clearValue("speaker_status");
        gapi.hangout.data.clearValue("poi_taken");
      }else{
        speaker_fireobj.$remove();
        poi_taken_fireobj.$remove();
      }
      poi_candidate_fireobj.$remove();

  }




  initial_execution();





  return SpeechStatus_object;

  }]);
