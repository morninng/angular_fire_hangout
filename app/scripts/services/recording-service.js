'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.RecordingService
 * @description
 * # RecordingService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('RecordingService',['MixideaSetting', function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	var audio_available = false;
	var socket_available = false;
	var stored_speech_id = null;
	var socket_io = null;
	var stream = null;
	var context = null;
	var sample_rate_value = null;
	var scriptNode = null;

    var under_recording = false;

    this.record_start_api = function(type, speaker_role_name, speech_id){

		if(!audio_available || !socket_available){
			return;
		}

		under_recording = true;
		var file_name = MixideaSetting.event_id + "_" + speaker_role_name + "_" + speech_id;
		switch(type){
			case "speech":
				if(stored_speech_id == speech_id){
					resume_record(file_name);
				}else{
					start_record(file_name);
				}
			break;
			case "poi":
				resume_record(file_name);
			break;
		}
		stored_speech_id = speech_id;

    }

    this.record_finish_api = function(type,deb_style, speaker_role_name, speech_id){
		if(!audio_available || !socket_available || !under_recording){
			return;
		}
		under_recording = false;
		
		var file_name = MixideaSetting.event_id + "_" + speaker_role_name + "_" + speech_id;
		switch(type){
			case "break":
				stop_record_save(file_name,deb_style, speaker_role_name, speech_id);
			break;
			case "other":
				suspend_record(file_name);
			break;
		}
    }


    function sockt_initialize(){

		socket_io = io.connect(MixideaSetting.recording_domain);

		socket_io.on('connect', function(){
			console.log("connect socket id=" + socket_io.id);
			socket_available = true;

			socket_io.emit('join_room', {'room_name':MixideaSetting.event_id});

			socket_io.on('audio_saved', function(data){
				console.log('record complete ' + data.file_saved);
				audio_transcript_obj.update();
			});
			

			socket_io.on('disconnect', function(){
				console.log('disconnected');
				socket_available = false;
				if(stream){
					console.log("disconnected");
					under_recording = false;
					stream.end();
					stream = null;
				}
			});
		});
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
				 	start_audio_polling(local_media_stream);
				},
				function(e) {console.log('Error'); } );
		} else{
			console.log('getUserMedia not supported');
		}

    }

    function start_record(in_file_name){
		if(!socket_available || !audio_available){
			return;
		}

		if(!stream){
			console.log(" start record socket id=" + socket_io.id);
			stream = ss.createStream();
			console.log("audio polling stream id " + stream.id);
			var start_emit_obj = {filename:in_file_name,sample_rate:sample_rate_value};
			console.log(start_emit_obj);
			ss(socket_io).emit('audio_record_start', stream, start_emit_obj );
		}else{
			console.log("recording is already on going");
		}
    }

    function resume_record(in_file_name){

		if(!socket_available || !audio_available){
			return;
		}

		if(!stream){
			console.log("resume recording");
			stream = ss.createStream();
			console.log("audio polling stream id " + stream.id)
			ss(socket_io).emit('audio_record_resume', stream, {filename:in_file_name,sample_rate:sample_rate_value} );
		}else{
			console.log("recording is already on going");
		}
    }

    function suspend_record(in_file_name){
		if(!socket_available || !audio_available){
			return;
		}
		console.log("suspend recording");
		if(stream){
			stream.end();
			stream = null;
			socket_io.emit('audio_record_suspend', {filename:in_file_name});
		} 	
    }

    function stop_record_save(in_file_name,deb_style_val, in_role_name, speech_id_val){

		var self = this;
		if(!socket_available || !audio_available){
			return;
		}
		if(stream){
			console.log("stop record socket id=" + socket_io.id);
			stream.end();
			stream = null;
			var room_name_val = MixideaSetting.event_id;
			var stop_emit_obj = {filename:in_file_name,deb_style: deb_style_val, role_name: in_role_name, room_name: room_name_val, speech_id: speech_id_val }
			console.log(stop_emit_obj);
			socket_io.emit('audio_record_end', stop_emit_obj);
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
		  if(!under_recording || !socket_io ){
		   return;
		  }
		  var left = audioProcessingEvent.inputBuffer.getChannelData(0);
		  var audio_array_buffer = convertoFloat32ToInt16(left);
		  var stream_buffer = new ss.Buffer(audio_array_buffer);
		  stream.write(stream_buffer, 'buffer');
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

	sockt_initialize();
	recording_initialize();

  }]);
