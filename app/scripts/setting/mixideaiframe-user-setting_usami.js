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
var global_team_side  = null;
var global_own_team_side = null;
var global_firebase_root_ref = null;

(function () {

  global_event_id = "-KEAJdyOW6e22CbREmpb";
  global_own_user_id = "facebook:1023172297758186";
  //global_room_type = "team_discussion";
  global_room_type = "main";

  if(global_room_type == "team_discussion"){
    global_team_side = "Prop";
    global_own_team_side = "Prop";
  }

  var global_own_hangout_id = "2222222222";
  set_mapping_data(global_own_user_id, global_own_hangout_id);

}());

angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
  	firebase_url: "https://mixidea.firebaseio.com/",
  	source_domain: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/',
  	own_user_id: global_own_user_id,
  	event_id: global_event_id,
  	room_type: global_room_type,
    hangout_appid: "211272797315",
    team_discuss_team_side: global_team_side,
    team_discuss_own_team: global_own_team_side,
    recording_domain: 'https://recording.mixidea.org:3000/',
    hangout_execution: false
  });


function set_mapping_data(user_id, hangout_id)
{
  var root_ref = new Firebase("https://mixidea.firebaseio.com/");
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