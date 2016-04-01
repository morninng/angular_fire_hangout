'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.ParticipantMgrService
 * @description
 * # ParticipantMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
.factory('ParticipantMgrService',['MixideaSetting','$timeout','DataDebstyleService','DataFullparticipantService','DataGameroleService','DataMappingService','$rootScope', function (MixideaSetting, $timeout,DataDebstyleService, DataFullparticipantService, DataGameroleService, DataMappingService, $rootScope) 
{


  var ParticipantMgr_Object = new Object();
  // ParticipantMgr_Object.debate_style = null;
  ParticipantMgr_Object.participant_obj = new Object();
  ParticipantMgr_Object.participant_obj_bp_open = new Object();
  ParticipantMgr_Object.participant_obj_bp_close = new Object();
  ParticipantMgr_Object.audience_array = new Array();


//public member variable 
  //ParticipantMgr_Object.own_group = null;
  //ParticipantMgr_Object.is_audience_or_debater = "Audience";
 // ParticipantMgr_Object.own_first_name = null;
 // ParticipantMgr_Object.own_last_name = null;
  ParticipantMgr_Object.own_role_array = new Array();
  ParticipantMgr_Object.all_group_name_array = new Array();
  //ParticipantMgr_Object.user_object_data = new Object();

//local variable

  //var root_ref = new Firebase(MixideaSetting.firebase_url);
  //var game_role_obj_all_style = new Object();
  //var full_participants_object = new Object();
  //var mapping_object = new Object();
  //var total_number_participants = 0;
  //var role_group_name_mappin = new Object();


  $rootScope.$on('update_participant_data', function(){
    update_ParticipantMgr_Object();
  })

  var update_ParticipantMgr_Object = function(){

      ParticipantMgr_Object.participant_obj = null;
      ParticipantMgr_Object.participant_obj = new Object();
      ParticipantMgr_Object.participant_obj_bp_open = null;
      ParticipantMgr_Object.participant_obj_bp_open = new Object();
      ParticipantMgr_Object.participant_obj_bp_close = null;
      ParticipantMgr_Object.participant_obj_bp_close = new Object();
      var no_applicant_img = MixideaSetting.source_domain + "images/want_you.png";
      switch(DataDebstyleService.deb_style){
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
          var game_role_obj = DataGameroleService.all_style_roledata.NA
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
          var game_role_obj = DataGameroleService.all_style_roledata.Asian;
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
          var game_role_obj = DataGameroleService.all_style_roledata.BP;
          if(!game_role_obj){
            game_role_obj = new Object()
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;

        default:
          console.log("style is not yet retrieved");
          return;
        break;
      }
      for( var userid_key in DataFullparticipantService.user_object_data){
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
        if(DataFullparticipantService.user_object_data[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].user_name = DataFullparticipantService.user_object_data[user_id].first_name;
          ParticipantMgr_Object.participant_obj[role_key].profile_pict = DataFullparticipantService.user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_logoff";
        }
        if(DataMappingService.mapping_object[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_login";
          ParticipantMgr_Object.participant_obj[role_key].login = true;
        }
      }
      for( var i=0; i< ParticipantMgr_Object.audience_array.length; i++ ){

        var user_id =  ParticipantMgr_Object.audience_array[i].id;
        if(DataFullparticipantService.user_object_data[user_id]){
          ParticipantMgr_Object.audience_array[i].user_name = DataFullparticipantService.user_object_data[user_id].first_name;
          ParticipantMgr_Object.audience_array[i].profile_pict = DataFullparticipantService.user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.audience_array[i].applicant = true;
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_logoff";
        }
        if(DataMappingService.mapping_object[user_id]){
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_login";
        }
      }
      if(DataDebstyleService.deb_style == "BP"){
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

      switch(DataDebstyleService.deb_style){
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
        default:
          return;
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







    return ParticipantMgr_Object;
}]);
