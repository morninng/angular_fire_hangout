'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.MixideaHangoutSetting
 * @description
 * # MixideaHangoutSetting
 * Constant in the angularFireHangoutApp.
 */

var global_own_user_id = null
var global_event_id = null;
var global_room_type = null;
var global_own_hangout_id = null;
var global_team_side  = null;
var global_own_team_side = null;
var global_firebase_root_ref = null;
// var global_audio_allowed = null;

(function () {

  global_event_id = "-KEof5h75HXrxrMnd-ed";
  global_own_user_id = "facebook:514784482056936";
  //global_room_type = "team_discussion";
  global_room_type = "main";
  
  
  if(global_room_type == "team_discussion"){
    global_team_side = "OG";
    global_own_team_side = "OG";
  }

  global_own_hangout_id = "BBCCBBBBB";
  set_mapping_data(global_own_user_id, global_own_hangout_id);

/*
  console.log("before executing getusermedia");
  if (!navigator.getUserMedia){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }
  if (navigator.getUserMedia) {
    console.log("initial get user media execution");
    navigator.getUserMedia(
      {audio:true},
      function(local_media_stream){
        global_audio_allowed = "accepted";
        console.log("accepted")
      },
      function(e) {
        global_audio_allowed = "denied";
        console.log("audio was denied");
      }
    );
  }else{
    global_audio_allowed = "not_supported";
    console.log("not supported")
  }
*/



}());

angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
 //   firebase_url: "https://mixidea.firebaseio.com/",
    firebase_url: "https://mixidea-test.firebaseio.com/",
  	source_domain: '/',
  	own_user_id: global_own_user_id,
  	event_id: global_event_id,
  	room_type: global_room_type,
    hangout_appid: "211272797315",
    team_discuss_team_side: global_team_side,
    team_discuss_own_team: global_own_team_side,
    recording_domain: 'https://recording.mixidea.org:3000/',
    hangout_execution: false,
    ApiGateway_url:'https://jqiokf5mp9.execute-api.us-east-1.amazonaws.com/1/'
  });


function set_mapping_data(user_id, hangout_id)
{

 // var root_ref = new Firebase("https://mixidea.firebaseio.com/");
  var root_ref = new Firebase("https://mixidea-test.firebaseio.com/");
  var mapping_data_ref = root_ref.child("event_related/hangout_dynamic/" + global_event_id + "/mapping_data/" + global_own_user_id)
  mapping_data_ref.set(hangout_id, function(error) {
    if (error) {
      alert("mapping failed" + error);
    } else {
      console.log("hangout id " + hangout_id + " is set");
    }
  });

  mapping_data_ref.onDisconnect().remove();
  


}



