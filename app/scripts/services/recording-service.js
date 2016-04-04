'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.RecordingService
 * @description
 * # RecordingService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('RecordingService',['MixideaSetting','SocketStreamsService', function (MixideaSetting, SocketStreamsService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	var audio_available = false;
	var stored_speech_id = null;
	var context = null;
	var sample_rate_value = null;
	var scriptNode = null;
    var under_recording = false;
    var stored_speaker_role_name = null;

    this.record_start_api = function(type, speaker_role_name, speech_id){

		if(!audio_available || !SocketStreamsService.socket_available){
			return;
		}
		stored_speaker_role_name = speaker_role_name;

		under_recording = true;
		var file_name = MixideaSetting.event_id + "_" + stored_speaker_role_name + "_" + speech_id;
		switch(type){
			case "speech":
				if(stored_speech_id == speech_id){
					SocketStreamsService.resume_record(file_name);
				}else{
					SocketStreamsService.start_record(file_name, sample_rate_value);
				}
			break;
			case "poi":
				SocketStreamsService.resume_record(file_name, sample_rate_value);
			break;
		}
		stored_speech_id = speech_id;

    }

    this.record_finish_api = function(type,deb_style){
		if(!audio_available || !SocketStreamsService.socket_available || !under_recording){
			return;
		}
		under_recording = false;
		
		var file_name = MixideaSetting.event_id + "_" + stored_speaker_role_name + "_" + stored_speech_id;
		switch(type){
			case "break":
				SocketStreamsService.stop_record_save(file_name,deb_style, stored_speaker_role_name, stored_speech_id);
			break;
			case "other":
				SocketStreamsService.suspend_record(file_name);
			break;
		}
    }



    function recording_initialize(){
		if (!navigator.getUserMedia){
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia || navigator.msGetUserMedia;
		}

		if (navigator.getUserMedia) {
			console.log("get user media");
			navigator.getUserMedia(
				{audio:true},
				function(local_media_stream){
					audio_available = true;
					console.log("audio is a vailable by user concensus");
					//sockt_initialize();
				 	start_audio_polling(local_media_stream);
				},
				function(e) {
					console.log('using audio is blocked by user'); 
				} );
		} else{
			console.log('getUserMedia not supported');
		}

    }


    function start_audio_polling(local_media_stream){
		var audioContext = window.AudioContext || window.webkitAudioContext;
		context = new audioContext();
		sample_rate_value = context.sampleRate;
		var audioInput = context.createMediaStreamSource(local_media_stream);
		var bufferSize = 4096;
		
		scriptNode = context.createScriptProcessor(bufferSize, 1, 1);
		audioInput.connect(scriptNode)
		scriptNode.connect(context.destination); 

		scriptNode.onaudioprocess = function(audioProcessingEvent){
		  if(!under_recording ){
		   return;
		  }
		  var left = audioProcessingEvent.inputBuffer.getChannelData(0);
		  var audio_array_buffer = convertoFloat32ToInt16(left);
		  SocketStreamsService.stream_record_process(audio_array_buffer);

		  //var stream_buffer = new ss.Buffer(audio_array_buffer);
		  //stream.write(stream_buffer, 'buffer');
		}
    }

    function finish_audio_polling(){
	  scriptNode.disconnect(context.destination);
	  context.close();
	  context = null;
    }


	function convertoFloat32ToInt16(buffer) {
	  var len = buffer.length;

	  var double_len = len*2;
	  var unit8_buf = new Uint8Array(double_len);
	  var int16_variable = new Int16Array(1);
	  for (var i=0; i< len; i++) {
	    int16_variable[0] = buffer[i]*0x7FFF;    //convert to 16 bit PCM
	    unit8_buf[2*i] = int16_variable[0] & 0x00FF; //convert to uint8 for stream buffer
	    unit8_buf[2*i+1] = (int16_variable[0] & 0xFF00) >> 8;
	  }
	  return unit8_buf.buffer
	}

	// initial execution

	recording_initialize();

  }]);
