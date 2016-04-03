'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.ParticipantMgrService
 * @description
 * # ParticipantMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
.factory('ParticipantMgrService',['MixideaSetting','$timeout','$firebaseObject', function (MixideaSetting, $timeout, $firebaseObject) {


  var ParticipantMgr_Object = new Object();
  ParticipantMgr_Object.debate_style = null;
  ParticipantMgr_Object.participant_obj = new Object();
  ParticipantMgr_Object.participant_obj_bp_open = new Object();
  ParticipantMgr_Object.participant_obj_bp_close = new Object();
  ParticipantMgr_Object.audience_array = new Array();


//public member variable 
  ParticipantMgr_Object.own_group = null;
  ParticipantMgr_Object.is_audience_or_debater = "Audience";
  ParticipantMgr_Object.own_first_name = null;
  ParticipantMgr_Object.own_last_name = null;
  ParticipantMgr_Object.all_group_name = new Array();
  ParticipantMgr_Object.own_role_array = new Array();
  ParticipantMgr_Object.all_group_name_array = new Array();
  ParticipantMgr_Object.user_object_data = new Object();

//local variable

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_role_obj_all_style = new Object();
  var full_participants_object = new Object();
  var mapping_object = new Object();
  var accumulate_mapping_object = new Object();
  var total_number_participants = 0;
  var role_group_name_mappin = new Object();
  var debate_style_fireobj = null;

//debate style

  var deb_style_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style")
  debate_style_fireobj = $firebaseObject(deb_style_ref);

  debate_style_fireobj.$watch(function() {
    ParticipantMgr_Object.debate_style = debate_style_fireobj.$value;
    update_ParticipantMgr_Object();
  });

  /*
  debate_style_fireobj.$save().then(function(deb_style_ref) {
    ParticipantMgr_Object.debate_style = debate_style_fireobj.$value;
    update_ParticipantMgr_Object();
  });
*/
/*
  deb_style_ref.on("value", function(snapshot) {
    var style_val  = snapshot.val();
    console.log("style update event : " + style_val);
    ParticipantMgr_Object.debate_style = style_val;
    

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
*/



  ParticipantMgr_Object.set_style = function(value){
    debate_style_fireobj.$value = value;
    debate_style_fireobj.$save()
    /*
    debate_style_fireobj.$save().then(
          function(data){console.log(data);}, 
          function(error){console.log(error)}
          );*/
  }

// full participants

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

    for(key in ParticipantMgr_Object.user_object_data){
      delete ParticipantMgr_Object.user_object_data[key]
    }
    ParticipantMgr_Object.user_object_data = null;
    ParticipantMgr_Object.user_object_data = new Object();
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
      ParticipantMgr_Object.user_object_data[user_key] = user_obj;
      var user_object_data_len = check_object_length(ParticipantMgr_Object.user_object_data);
      if(user_key == MixideaSetting.own_user_id){
        ParticipantMgr_Object.own_first_name = user_obj.first_name;
        ParticipantMgr_Object.own_last_name = user_obj.last_name;
      }
      if(user_object_data_len == total_number_participants){
        update_ParticipantMgr_Object();
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }


// mapping data




 // var root_ref = new Firebase(MixideaSetting.firebase_url);
  var mapping_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/mapping_data");
  mapping_ref.on("value", function(snapshot) {
    console.log("mapping data updated");
    var value  = snapshot.val();
    console.log(value);
    var key  = snapshot.key();
    if(value){
      mapping_object = value;
      accumulate_mapping_user();
    }else{
      mapping_object = new Object();
    }
    //check_ownexistence_addifnot();
    update_ParticipantMgr_Object();

  }, function (errorObject) {

    console.log("The read failed: " + errorObject.code);

  });

  var accumulate_mapping_user = function(){

    for(var key in mapping_object){
      accumulate_mapping_object[key] = mapping_object[key];
    }

  }


  window.addEventListener("online", 
    function(){
      console.log("online event");
      check_ownexistence_addifnot();
      setTimeout(function() {check_ownexistence_addifnot();}, 3000);
    }
  );

ParticipantMgr_Object.getUserid_fromHangoutid = function(hangout_id){
  

    for(var key in accumulate_mapping_object){
      if(hangout_id == accumulate_mapping_object[key]){
        return key;
      }
    }
}



  function check_ownexistence_addifnot(){

    var own_exist = false;
    for(var key in mapping_object){
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
/*
  function update_hangout_participants(){
    console.log("update_hangout_participants");
    var participant_obj_array = gapi.hangout.getParticipants();
    console.log(participant_obj_array);

    for(var key in mapping_object){
      var exist = false;
      for(var i=0; i< participant_obj_array.length; i++){
        if(mapping_object[key] == participant_obj_array[i]){
          exist = true;
          break;
        }
      }
      if(!exist){
        console.log("user" + key + "do not login within hangout" + mapping_object[key]);
        var non_exist_person_ref = mapping_ref.child(key);
        non_exist_person_ref.set(null);
      }
    }
    check_ownexistence_addifnot();
    setTimeout(function() {check_ownexistence_addifnot();}, 3000);
  }
*/

// game role

  var game_role_ref = global_firebase_root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/");
  game_role_ref.on("value", function(snapshot) {
    var value  = snapshot.val();
    if(value){
      game_role_obj_all_style = value;
    }else{
      game_role_obj_all_style = new Object()
    }
    update_ParticipantMgr_Object();

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });




  function update_ParticipantMgr_Object(){

      ParticipantMgr_Object.participant_obj = null;
      ParticipantMgr_Object.participant_obj = new Object();
      ParticipantMgr_Object.participant_obj_bp_open = null;
      ParticipantMgr_Object.participant_obj_bp_open = new Object();
      ParticipantMgr_Object.participant_obj_bp_close = null;
      ParticipantMgr_Object.participant_obj_bp_close = new Object();
      var no_applicant_img = MixideaSetting.source_domain + "images/want_you.png";
      switch(ParticipantMgr_Object.debate_style){
        case "NA":
          ParticipantMgr_Object.participant_obj = {
            PM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Gov',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            MG:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Gov',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            MO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            PMR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Gov',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LOR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            }
          }
          var game_role_obj = game_role_obj_all_style.NA
          if(!game_role_obj){
            game_role_obj = new Object()
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;
        case "Asian":
          ParticipantMgr_Object.participant_obj = {
            PM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              side:'right',
              group_id:1,
              login:false,
              css_style:"participant_box_default"
            },
            DPM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            DLO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            GW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            OW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            PMR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LOR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            }
          }
          var game_role_obj = game_role_obj_all_style.Asian
          if(!game_role_obj){
            game_role_obj = new Object()
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;
        case "BP":

          ParticipantMgr_Object.participant_obj = {
            PM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OG',
              group_id:0,
              side:'left',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            LO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OO',
              group_id:1,
              side:'right',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            DPM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OG',
              group_id:0,
              side:'left',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            DLO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OO',
              group_id:1,
              side:'right',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            MG:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CG',
              group_id:2,
              side:'left',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            },
            MO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CO',
              group_id:3,
              side:'right',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            },
            GW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CG',
              group_id:2,
              side:'left',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            },
            OW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CO',
              group_id:3,
              side:'right',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            }
          }
          var game_role_obj = game_role_obj_all_style.BP;
          if(!game_role_obj){
            game_role_obj = new Object()
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;

        default:
          return;
        break;
      }
      for( var userid_key in full_participants_object){
        var have_role = false;
        for(var role_key in game_role_obj){
          if(userid_key == game_role_obj[role_key]){
            have_role = true;
            break;
          }
        }
        if(!have_role){
          var audience_obj = {
              applicant:true,
              id:userid_key,
              group:'Aud',
              login:false,
              css_style:"participant_box_default"
          }
          ParticipantMgr_Object.audience_array.push(audience_obj);        
        }
      }

      for(var role_key in game_role_obj){
        ParticipantMgr_Object.participant_obj[role_key].id = game_role_obj[role_key];
        ParticipantMgr_Object.participant_obj[role_key].applicant = true;
      }

      for( var role_key in ParticipantMgr_Object.participant_obj){

        var user_id = ParticipantMgr_Object.participant_obj[role_key].id;
        if(ParticipantMgr_Object.user_object_data[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].user_name = ParticipantMgr_Object.user_object_data[user_id].first_name;
          ParticipantMgr_Object.participant_obj[role_key].profile_pict = ParticipantMgr_Object.user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_login";
          ParticipantMgr_Object.participant_obj[role_key].login = true;
        }
      }
      for( var i=0; i< ParticipantMgr_Object.audience_array.length; i++ ){

        var user_id =  ParticipantMgr_Object.audience_array[i].id;
        if(ParticipantMgr_Object.user_object_data[user_id]){
          ParticipantMgr_Object.audience_array[i].user_name = ParticipantMgr_Object.user_object_data[user_id].first_name;
          ParticipantMgr_Object.audience_array[i].profile_pict = ParticipantMgr_Object.user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.audience_array[i].applicant = true;
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_login";
        }
      }
      if(ParticipantMgr_Object.debate_style == "BP"){
        adopt_ParticipantObj_BP();
      }
      update_member_variable();
      $timeout(function() {});
  }

  function adopt_ParticipantObj_BP(){

    for(var key in ParticipantMgr_Object.participant_obj_bp_open){
      delete ParticipantMgr_Object.participant_obj_bp_open[key];
    }
    for(var key in ParticipantMgr_Object.participant_obj_bp_close){
      delete ParticipantMgr_Object.participant_obj_bp_close[key];
    }

    for( var role_key in ParticipantMgr_Object.participant_obj){
      if(ParticipantMgr_Object.participant_obj[role_key].part == "Opening"){
        ParticipantMgr_Object.participant_obj_bp_open[role_key] = ParticipantMgr_Object.participant_obj[role_key];
      }
      if(ParticipantMgr_Object.participant_obj[role_key].part == "Closing"){
        ParticipantMgr_Object.participant_obj_bp_close[role_key] = ParticipantMgr_Object.participant_obj[role_key];
      }
    }
  }


  function update_member_variable(){

      switch(ParticipantMgr_Object.debate_style){
        case "NA":
          ParticipantMgr_Object.all_group_name_array = ["Gov","Opp"];
          ParticipantMgr_Object.all_group_id = [0,1];
        break;
        case "Asian":
          ParticipantMgr_Object.all_group_name_array = ["Prop","Opp"];
          ParticipantMgr_Object.all_group_id = [0,1];
        break;
        case "BP":
          ParticipantMgr_Object.all_group_name_array = ["OG","OO","CG","CO"];
          ParticipantMgr_Object.all_group_id = [0,1,2,3];
        break;
      }

      ParticipantMgr_Object.own_role_array.length=0;
      ParticipantMgr_Object.own_group = "Audience"
      ParticipantMgr_Object.is_audience_or_debater = "Audience";
      ParticipantMgr_Object.own_side = "Audience";


      ParticipantMgr_Object.own_group_id = null;

      for( var role_key in ParticipantMgr_Object.participant_obj){
        if(ParticipantMgr_Object.participant_obj[role_key].id == MixideaSetting.own_user_id){
          ParticipantMgr_Object.own_role_array.push(role_key);
          ParticipantMgr_Object.own_group = ParticipantMgr_Object.participant_obj[role_key].group;
          ParticipantMgr_Object.own_group_id = ParticipantMgr_Object.participant_obj[role_key].group_id;
          ParticipantMgr_Object.is_audience_or_debater = "debater";
          ParticipantMgr_Object.own_side = ParticipantMgr_Object.participant_obj[role_key].side;
        }
      }

  }


  ParticipantMgr_Object.get_hangout_id = function(user_id){

  }

  ParticipantMgr_Object.get_user_info = function(user_id){

  }
  ParticipantMgr_Object.get_user_pict = function(user_id){
    ParticipantMgr_Object.user_object_data[user_id].profile_pict;
  }

  function check_object_length(obj){
    var len = 0;
    for(var key in obj){
      len++
    }
    return len;
  }


    return ParticipantMgr_Object;
}]);
