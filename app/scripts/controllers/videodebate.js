'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:VideodebateCtrl
 * @description
 * # VideodebateCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('VideodebateCtrl',["$scope","MixideaSetting", "ParticipantMgrService","$timeout","SoundPlayService","RecognitionService","UtilService","RecordingService","HangoutService",  function ($scope,MixideaSetting ,ParticipantMgrService, $timeout, SoundPlayService, RecognitionService, UtilService, RecordingService, HangoutService) {

  	$scope.participant_mgr = ParticipantMgrService;
    $scope.own_user_id = MixideaSetting.own_user_id;

/*******ui related part****************/
  	$scope.status = "break";
  	$scope.speaker_obj = new Object();
  	$scope.poi_speaker_obj = new Object();
  	$scope.poi_candidate_userobj_array = new Array();
  	$scope.timer_value = null;
    $scope.speech_start_time = 0;


	var root_ref = new Firebase(MixideaSetting.firebase_url);

	var video_status_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
	var speaker_ref = video_status_ref.child("speaker");
	var speaker_ref_own = video_status_ref.child("speaker/" + MixideaSetting.own_user_id);
	var poi_ref = video_status_ref.child("poi");
	var poi_candidate_ref = video_status_ref.child("poi/candidate");
	var poi_candidate_ref_own = video_status_ref.child("poi/candidate/" + MixideaSetting.own_user_id);
	var poi_taken_ref = video_status_ref.child("poi/taken");
	var poi_taken_ref_own = video_status_ref.child("poi/taken/" + MixideaSetting.own_user_id);

  var current_speaker = null;

  	$scope.speech_start = function(role){
  		var own_side = $scope.participant_mgr.own_side;
  		var own_name = $scope.participant_mgr.own_first_name;
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
  		own_speaker_obj[MixideaSetting.own_user_id] = speaker_obj;
  		speaker_ref.transaction(function(current_value){
  			if(current_value){
  				return;
  			}
  			return own_speaker_obj;
  		});
  		speaker_ref_own.onDisconnect().set(null);
      SoundPlayService.SpeechStart();
  	}

  	speaker_ref.on("value", function(snapshot){
  		var updated_speaker_obj = snapshot.val();

  		if(!updated_speaker_obj){
  			for(var key in $scope.speaker_obj){
  				delete $scope.speaker_obj[key]
  			}
  		}else{
			var obj = new Object();
			for(var key in updated_speaker_obj){
				var speaker_user_id = key;
				$scope.speaker_obj.id = speaker_user_id;
				var obj = updated_speaker_obj[speaker_user_id];
				$scope.speaker_obj.name = obj.name;
				$scope.speaker_obj.role = obj.role;
        current_speaker = obj.role;
				$scope.speaker_obj.side = obj.side;
				$scope.speaker_obj.full_role_name = obj.full_role_name;
        $scope.speech_start_time = obj.speech_start_time;
			}
		}
		update_video_status()

  	}, function(error){
  		console.log("fail while to retrieve speaker obj" + error);
  	})

	$scope.complete_speech = function(){
		video_status_ref.set(null);

	}

	$scope.poi = function(){
    var own_group = $scope.participant_mgr.own_group
		poi_candidate_ref_own.set(own_group);
		poi_candidate_ref_own.onDisconnect().set(null);
    poi_taken_ref_own.onDisconnect().set(null);
    SoundPlayService.Poi();
	}
	poi_candidate_ref.on("value", function(snapshot){
		var poi_obj = snapshot.val();
		$scope.poi_candidate_userobj_array.length=0;
		$timeout(function() {
			for (var key in poi_obj){
        var obj = {id: key, group:poi_obj[key]};
				$scope.poi_candidate_userobj_array.push(obj);
			}
		});
	});
	$scope.finish_poi = function(){
		poi_ref.set(null);
    SoundPlayService.PoiFinish();
	}

	$scope.cancel_poi = function(){
		poi_candidate_ref_own.set(null);
	}

	$scope.take_poi = function(user_id, group){
		var poi_taken_obj = new Object();
		poi_taken_obj[user_id] = group;
		poi_taken_ref.transaction(function(current_value){
  			if(current_value){
  				return;
  			}
  			return poi_taken_obj;
  		});
    poi_candidate_ref.set(null);
    SoundPlayService.Taken();
	}

	poi_taken_ref.on("value", function(snapshot){
  		var poi_taken_obj = snapshot.val();
  		var poi_user_id = null;
      var poi_user_group = null;
  		for(var key in poi_taken_obj){
  			poi_user_id = key;
        poi_user_group = poi_taken_obj[key]
  		}
		if(poi_user_id){
			$scope.poi_speaker_obj.id = poi_user_id;
			$scope.poi_speaker_obj.speaker_group = 'Poi from ' + poi_user_group;
		//	$scope.poi_speaker_obj.name = $scope.participant_mgr.user_object_data[poi_user_id].first_name;
		}else{
			for(var key in $scope.poi_speaker_obj){
				delete $scope.poi_speaker_obj[key]
			}
		}
		
  		update_video_status();
  	});

  	function update_video_status(){

  		$timeout(function() {
  			if($scope.poi_speaker_obj.id){
          manage_speaker($scope.poi_speaker_obj.id, "poi");
  				$scope.status = "poi";

  			}else if ($scope.speaker_obj.id){
          if($scope.status=="break"){
            speech_execution_start();
          }
          manage_speaker($scope.speaker_obj.id, "speech");
  				$scope.status = "speech";
  			}else{
          if($scope.status !="break"){
            speech_execution_stop();
          }
          manage_speaker(null, "break");
  				$scope.status = "break";
  			}

        console.log("video status call update_video_canvas_position");
        setTimeout(update_video_canvas_position, 100);
        setTimeout(update_video_canvas_position, 1000);
  		});

  	}


    function speech_execution_start(){
      StartTimer()
      //sound_mgr.play_sound_speech_start()
    }

    function speech_execution_stop(){
      StopTimer()
      //sound_mgr.play_sound_speech_stop()
    }

/*********** video feed management *****/

/*create video dummy feed init*/
    var video_area_element = document.getElementById("video_canvas_dummy_layout");
    var video_width = video_area_element.offsetWidth;
    var ratio = HangoutService.get_video_ratio;
    var video_area_height = video_width / ratio;
    var video_area_height_val = video_area_height + "px"
    $scope.video_dumy_size = {height:video_area_height_val};

    HangoutService.set_video_width(video_width)


/*video position update*/

    function update_video_canvas_position(){

      console.log("update_video_canvas_position");
      var container_second_element = document.getElementById("container_second_top");
      var container_second_height = container_second_element.offsetHeight;
      console.log("container_second_height" + container_second_height);

      var container_top_element = document.getElementById("container_top");
      var container_top_height = container_top_element.offsetHeight;
      console.log("container_top_height" + container_top_height)


      var start_speech_element = document.getElementById("start_speech_container");
      var start_speech_height = start_speech_element.offsetHeight;
      console.log("start_speech_height" + start_speech_height)

      var speaker_data_element = document.getElementById("speaker_data_container");
      var speaker_data_height = speaker_data_element.offsetHeight;
      console.log("speaker_data_height" + speaker_data_height)

      var complete_button_element = document.getElementById("complete_button_container");
      var complete_button_height = complete_button_element.offsetHeight;
      console.log("complete_button_height" + complete_button_height)

      var absolute_offset = complete_button_height + speaker_data_height + start_speech_height + container_top_height + container_second_height;
      console.log("absolute_offset" + absolute_offset);
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
        //sound_mgr.play_sound_PinOne();
        console.log("one minutes");
      }else if(minutes ==6 && second == 0){
        //sound_mgr.play_sound_PinOne();
        console.log("two minutes");
      }else if(minutes == 7  && second == 0){
        //sound_mgr.play_sound_PinTwo();
        console.log("seven minutes");
      }else if(minutes == 7  && second == 30){
        //sound_mgr.play_sound_PinThree();
        console.log("seven and half minutes");
      }
      $timeout(function() {
        $scope.timer_value = timer_str;
      });
    }

/*************speaker related part****************/

    $scope.current_speaker = null;

    function manage_speaker(speaker_id, type){

      if(speaker_id == MixideaSetting.own_user_id){
        //Recording.start();
        RecognitionService.start(type, current_speaker  ,$scope.speech_start_time);
        RecordingService.record_start_api(type, current_speaker, $scope.speech_start_time);
        //microphone.enable();
      }else if(speaker_id){
        RecognitionService.stop();
        RecordingService.record_finish_api("other", current_speaker, $scope.speech_start_time);
        //microphone.disabled();
      }else{
        RecognitionService.stop();
        RecordingService.record_finish_api("break", current_speaker, $scope.speech_start_time);
        //microphone.enable();
      }
      $scope.current_speaker == speaker_id;

    }



  }]);
