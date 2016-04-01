'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.TitleService
 * @description
 * # TitleService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('TitleService',['MixideaSetting','$timeout', function (MixideaSetting, $timeout) {
 
    var title_obj = new Object();
    title_obj.motion_server = null;
    title_obj.motion_screen = null;
    title_obj.style = null;

   // var root_ref = new Firebase(MixideaSetting.firebase_url);
    var title_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/motion")


    title_ref.on("value", function(snapshot) {
      title_obj.motion_server = snapshot.val();
      organize_data();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


    var  organize_data = function(){

      title_obj.motion_screen = title_obj.motion_server
      if(!title_obj.motion_server){
        title_obj.style = "motion_sentence_Red_xlarge";
        title_obj.motion_screen = "input motion here";
        title_obj.motion_exist = false;
      }else{
        var title_len = title_obj.motion_server.length;      
        if(title_len == 0){
          title_obj.style = "motion_sentence_Red_xlarge";
          $scope.data.motion_screen = "input motion here";
          title_obj.motion_exist = false;
        }if(title_len < 60 ){
          title_obj.style = "motion_sentence_large";
          title_obj.motion_exist = true;
        }else if (title_len < 100){
          title_obj.style = "motion_sentence_middle";
          title_obj.motion_exist = true;
        }else{
          title_obj.style= "motion_sentence_small";
          title_obj.motion_exist = true;
        }
      }
      $timeout(function() {});

    }


    title_obj.save = function(){
      title_ref.set(title_obj.motion_screen);
    }

    title_obj.cancel = function(){
      organize_data();
    }

    title_obj.edit_start = function(){
      if(!title_obj.motion_exist){
        title_obj.motion_screen = "";
      }
    }

    // Public API here
    return title_obj




  }]);
