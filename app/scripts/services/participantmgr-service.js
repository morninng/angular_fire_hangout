'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.ParticipantMgrService
 * @description
 * # ParticipantMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
.factory('ParticipantMgrService',['MixideaSetting','$timeout', function (MixideaSetting, $timeout) {


  var ParticipantMgr_Object = new Object();
  ParticipantMgr_Object.debate_style = null;
  ParticipantMgr_Object.participant_obj = new Object();
  ParticipantMgr_Object.participant_obj_bp_open = new Object();
  ParticipantMgr_Object.participant_obj_bp_close = new Object();
  ParticipantMgr_Object.audience_array = new Array();


//public member variable 
  ParticipantMgr_Object.own_group = null;
  ParticipantMgr_Object.is_audience_or_debater = "Audience";
  ParticipantMgr_Object.all_group_name = new Array();
  ParticipantMgr_Object.own_role_array = new Array();
  ParticipantMgr_Object.all_group_name_array = new Array();

//local variable

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_role_obj_all_style = new Object();
  var user_object_data = new Object();
  var debate_style = null;
  var full_participants_object = new Object();
  var mapping_object = new Object();
  var total_number_participants = 0;
  var role_group_name_mappin = new Object();

//debate style

  var deb_style_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style")
  deb_style_ref.on("value", function(snapshot) {
    debate_style  = snapshot.val();
    $timeout(function() {
      ParticipantMgr_Object.debate_style = debate_style;
    });
    update_ParticipantMgr_Object();

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });

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

    user_object_data= new Object();
    total_number_participants = 0
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
      user_object_data[user_key] = user_obj;
      var user_object_data_len = check_object_length(user_object_data);
      if(user_object_data_len == total_number_participants){
        update_ParticipantMgr_Object();
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }


// mapping data

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var mapping_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/mapping_data");
  mapping_ref.on("value", function(snapshot) {
    var value  = snapshot.val();
    var key  = snapshot.key();
    if(value){
      mapping_object = value;
    }else{
      mapping_object = new Object();
    }
    update_ParticipantMgr_Object();

  }, function (errorObject) {

    console.log("The read failed: " + errorObject.code);

  });

// game role

  var game_role_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/");
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

    $timeout(function() {
      var no_applicant_img = MixideaSetting.source_domain + "images/want_you.png";
      switch(debate_style){
        case "NA":
          ParticipantMgr_Object.participant_obj = {
            PM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Gov',
              group_id:0,
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
              login:false,
              css_style:"participant_box_default"
            },
            WG:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              login:false,
              css_style:"participant_box_default"
            },
            WO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
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
        if(user_object_data[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].user_name = user_object_data[user_id].first_name;
          ParticipantMgr_Object.participant_obj[role_key].profile_pict = user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_login";
          ParticipantMgr_Object.participant_obj[role_key].login = true;
        }
      }
      for( var i=0; i< ParticipantMgr_Object.audience_array.length; i++ ){

        var user_id =  ParticipantMgr_Object.audience_array[i].id;
        if(user_object_data[user_id]){
          ParticipantMgr_Object.audience_array[i].user_name = user_object_data[user_id].first_name;
          ParticipantMgr_Object.audience_array[i].profile_pict = user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.audience_array[i].applicant = true;
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_login";
        }
      }
      if(debate_style == "BP"){
        adopt_ParticipantObj_BP();
      }
      console.log("participant obj");
      console.log(ParticipantMgr_Object.participant_obj);
      console.log("audience array");
      console.log(ParticipantMgr_Object.audience_array);
      update_member_variable();
    });
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
    console.log("participant_obj_bp_open");
    console.log(ParticipantMgr_Object.participant_obj_bp_open);
    console.log("participant_obj_bp_close");
    console.log(ParticipantMgr_Object.participant_obj_bp_close);
  }


  function update_member_variable(){

      switch(debate_style){
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
      ParticipantMgr_Object.own_group_id = null;

      for( var role_key in ParticipantMgr_Object.participant_obj){
        if(ParticipantMgr_Object.participant_obj[role_key].id == MixideaSetting.own_user_id){
          ParticipantMgr_Object.own_role_array.push(role_key);
          ParticipantMgr_Object.own_group = ParticipantMgr_Object.participant_obj[role_key].group;
          ParticipantMgr_Object.own_group_id = ParticipantMgr_Object.participant_obj[role_key].group_id;
          ParticipantMgr_Object.is_audience_or_debater = "debater";
        }
      }
      console.log("update_member_variable");
      console.log(ParticipantMgr_Object.own_role_array);
      console.log(ParticipantMgr_Object.own_group);
      console.log(ParticipantMgr_Object.own_group_id);
      console.log(ParticipantMgr_Object.is_audience_or_debater);

  }


  ParticipantMgr_Object.get_hangout_id = function(){

  }

  ParticipantMgr_Object.get_user_info = function(){

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
