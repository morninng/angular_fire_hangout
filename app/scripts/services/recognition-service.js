'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.RecognitionService
 * @description
 * # RecognitionService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('RecognitionService',["MixideaSetting", function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var under_recording = false;
    var available=true;
    var short_split_id_value=null;
    var root_ref = new Firebase(MixideaSetting.firebase_url);
    var transcription_ref = null;
    var speech_type=null;
    var speech_start_time = 0;
    var recognition = null;

    function recognition_initialization(){

    	if(!window.webkitSpeechRecognition){
    		available = false;
    		return;
    	}
    	recognition = new webkitSpeechRecognition();
    	recognition.continuous = true;
    	recognition.lang = "en-US";  /*should use mixidea setting*/

    	recognition.onresult = function(e){
    		var results = e.results;
    		for(var i = e.resultIndex; i<results.length; i++){
    			if(results[i].isFinal){
    				StoreData(results[i][0].transcript);
    			}
    		}
    	};

    }

    this.start = function(deb_style, type, speaker_role, time_value){
    	if(!available){
    		return;
    	}
    	speech_start_time = time_value;
      	short_split_id_value = Date.now();
    	
    	speech_type = type;
    	transcription_ref = root_ref.child("event_related/audio_transcript/" + 
    						MixideaSetting.event_id + "/" + deb_style + "/" + speaker_role + 
    						"/" + String(speech_start_time) + "/spech_context/" + short_split_id_value);

        //set user data and speech type to short split context
        var speech_initial_obj = {
            user: MixideaSetting.own_user_id,
            type: speech_type
        }
        transcription_ref.update(speech_initial_obj);


    	if(under_recording){
    		return;
    	}else{
            console.log("--recognition start--")
    		recognition.start();
    		under_recording = true;
    	}

    }

    this.stop = function(){
    	if(!available || !under_recording){
    		return;
    	}
        setTimeout(function(){
            console.log("--recognition stop--");
            recognition.stop();
            under_recording = false;
        },1000);
    }

    function StoreData(text){
    	console.log(text);
        var current_time_value = Date.now();	
    	var audio_time =  current_time_value - speech_start_time;
        var transcription_context_ref = transcription_ref.child("context");
    	var speech_obj = new Object();
        speech_obj[audio_time]=text
    	transcription_context_ref.update(speech_obj);
    }

    // it might be better to save it with audio_time as a key and rest are the values
    //so it is ordered by the audio time order

    recognition_initialization();

  }]);
