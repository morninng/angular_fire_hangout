'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:VideodebateCtrl
 * @description
 * # VideodebateCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('VideodebateCtrl',["$scope","MixideaSetting", "ParticipantMgrService","$timeout","SoundPlayService","RecognitionService","UtilService","RecordingService","HangoutService",'$firebaseObject','SpeechStatusService',   function ($scope,MixideaSetting ,ParticipantMgrService, $timeout, SoundPlayService, RecognitionService, UtilService, RecordingService, HangoutService, $firebaseObject, SpeechStatusService) {

  	$scope.participant_mgr = ParticipantMgrService;
    $scope.own_user_id = MixideaSetting.own_user_id;
    $scope.speech_status = SpeechStatusService;

/*******ui related part****************/
  	$scope.status = "break";
  //	$scope.speaker_obj = new Object();
  	//$scope.poi_speaker_obj = new Object();
  //	$scope.poi_candidate_userobj_array = new Array();
  	$scope.timer_value = null;
    $scope.speech_start_time = 0;

    SpeechStatusService.initial_execution();



  $scope.speech_start = function(role){
    SpeechStatusService.speech_start(role);
  		
  }

  $scope.complete_speech = function(){
    SpeechStatusService.complete_speech();
    //video_status_fireobj.$remove();

  }

  $scope.$watch('speech_status.watch_counter', 
    function(){
    update_video_status();
  });


	$scope.poi = function(){
    SpeechStatusService.poi();
	}



	$scope.finish_poi = function(){
    SpeechStatusService.finish_poi();
    
	}

	$scope.cancel_poi = function(){
    SpeechStatusService.cancel_poi();
	}

	$scope.take_poi = function(user_id, group){
    SpeechStatusService.take_poi(user_id, group);
	}





  	function update_video_status(){

      if($scope.speech_status.poi_speaker_obj.id){
      //poi
        if($scope.status=="speech"){
          poi_start();
        }
        manage_speaker($scope.speech_status.poi_speaker_obj.id, "poi");
        $scope.status = "poi";

      }else if ($scope.speech_status.speaker_obj.id){
        //speech
        if($scope.status=="break"){
          speech_execution_start();
        }else if($scope.status=="poi"){
          poi_stop();
        }
        manage_speaker($scope.speech_status.speaker_obj.id, "speech");
        $scope.status = "speech";
      }else{
        //break
        if($scope.status !="break"){
          speech_execution_stop();
        }
        manage_speaker(null, "break");
        $scope.status = "break";
      }

      setTimeout(update_video_canvas_position, 100);
      setTimeout(update_video_canvas_position, 1000);
      $timeout(function() {});

  	}


    function speech_execution_start(){
      StartTimer();
      SoundPlayService.SpeechStart();
    }

    function speech_execution_stop(){
      StopTimer();
    }

    function poi_start(){
      SoundPlayService.Taken();
    }
    function poi_stop(){
      SoundPlayService.PoiFinish();
    }

/*********** video feed management *****/

/*create video dummy feed init*/
    var video_area_element = document.getElementById("video_canvas_dummy_layout");
    var video_width = video_area_element.offsetWidth;
    var ratio = HangoutService.get_video_ratio();
    var video_area_height = video_width / ratio;
    var video_area_height_val = video_area_height + "px";
    $scope.video_dumy_size = {height:video_area_height_val};

    HangoutService.set_video_width(video_width)


/*video position update*/

    function update_video_canvas_position(){

      var container_second_element = document.getElementById("container_second_top");
      var container_second_height = container_second_element.offsetHeight;

      var container_top_element = document.getElementById("container_top");
      var container_top_height = container_top_element.offsetHeight;


      var start_speech_element = document.getElementById("start_speech_container");
      var start_speech_height = start_speech_element.offsetHeight;

      var speaker_data_element = document.getElementById("speaker_data_container");
      var speaker_data_height = speaker_data_element.offsetHeight;

      var complete_button_element = document.getElementById("complete_button_container");
      var complete_button_height = complete_button_element.offsetHeight;

      var absolute_offset = complete_button_height + speaker_data_height + start_speech_height + container_top_height + container_second_height;
      HangoutService.set_video_position(0,absolute_offset);

    }

    update_video_canvas_position();
    HangoutService.set_video_visible(true);


/*******time count********/

    var timer = null;
    var speech_duration = 0;
    $scope.timer_value = null;

    function StartTimer(){

      $scope.timer_value = "speech start";
      if(!timer ){
        speech_duration = 0;
        timer = setInterval( function(){countTimer()},1000);
      }
    }
    function StopTimer(){
      speech_duration = 0;
      $timeout(function() {
        $scope.timer_value = null;
      });
      clearInterval(timer);
      timer = null;
    }

    function countTimer(){
      speech_duration++;
      var duration_mod = speech_duration % 60;
      var minutes = (speech_duration - duration_mod)/60;
      var second = duration_mod;
      var timer_str = minutes + "min " + second + "sec";

      if(minutes == 1 && second == 0|| minutes ==6 && second == 0){
        SoundPlayService.PinOne();
        console.log("one minutes");
      }else if(minutes == 7  && second == 0){

        SoundPlayService.PinTwo();
        console.log("seven minutes");
      }else if(minutes == 7  && second == 30){
        SoundPlayService.PinThree();
        console.log("seven and half minutes");
      }
      $timeout(function() {
        $scope.timer_value = timer_str;
      });
    }

/*************speaker related part****************/


    function manage_speaker(speaker_id, type){

      var deb_style = $scope.participant_mgr.debate_style;

      if(speaker_id == MixideaSetting.own_user_id){
        RecognitionService.start(deb_style, type, $scope.speech_status.current_speaker  ,$scope.speech_start_time);
        RecordingService.record_start_api(type, $scope.speech_status.current_speaker, $scope.speech_start_time);
        HangoutService.enable_microphone();

      }else if(speaker_id){
        RecognitionService.stop();
        RecordingService.record_finish_api("other",deb_style, $scope.speech_status.current_speaker, $scope.speech_start_time);
        HangoutService.disable_microphone();

      }else{
        RecognitionService.stop();
        RecordingService.record_finish_api("break",deb_style, $scope.speech_status.current_speaker, $scope.speech_start_time);
        HangoutService.enable_microphone();

      }
      //$scope.current_speaker == speaker_id;

    }


    $scope.$on("$destroy", function() {
        console.log("video scope is destroyed");
        SpeechStatusService.Finalize_Service();

/*
        speaker_ref_own.set(null);
        poi_candidate_ref_own.set(null);
        poi_taken_ref_own.set(null);
*/
/*
        poi_candidate_fireobj_own.$remove();
        poi_taken_fireobj_own.$remove();
        speaker_fireobj_own.$remove();

        speaker_fireobj.destroy();
        poi_candidate_fireobj.destroy();
        poi_taken_fireobj.destroy();
*/

/*
        speaker_ref.off("value");
        poi_candidate_ref.off("value");
        poi_taken_ref.off("value");
*/




    });



  }]);
