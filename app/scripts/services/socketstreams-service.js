'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.SocketStreamsService
 * @description
 * # SocketStreamsService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('SocketStreamsService',['MixideaSetting', function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var SocketStream_Object = new Object();

	SocketStream_Object.socket_available = false;
	var socket_io = null;
	var stream = null;
	var a = "c";

    function sockt_initialize(){

		socket_io = io.connect(MixideaSetting.recording_domain);

		socket_io.on('connect', function(){
			console.log("connect socket id=" + socket_io.id);
			SocketStream_Object.socket_available = true;
			socket_io.emit('join_room', {'room_name':MixideaSetting.event_id});
			socket_io.on('audio_saved', function(data){
				console.log('record complete ' + data.file_saved);
			});
			
			socket_io.on('disconnect', function(){
				console.log('disconnected');
				SocketStream_Object.socket_available = false;
				if(stream){
					console.log("disconnected");
				//	under_recording = false;
					stream.end();
					stream = null;
				}
			});
		});
    }


    SocketStream_Object.start_record = function(in_file_name, sample_rate_value){
		if(!this.socket_available ){
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


    SocketStream_Object.suspend_record = function(in_file_name){
		if(!this.socket_available){
			return;
		}
		console.log("suspend recording");
		if(stream){
			stream.end();
			stream = null;
			socket_io.emit('audio_record_suspend', {filename:in_file_name});
		} 	
    }



    SocketStream_Object.resume_record = function(in_file_name, sample_rate_value){

		if(!this.socket_available ){
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


    SocketStream_Object.stop_record_save = function(in_file_name,deb_style_val, in_role_name, speech_id_val){

		var self = this;
		if(!this.socket_available ){
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


    SocketStream_Object.stream_record_process = function(audio_array_buffer){
    	if(!stream){
    		return
    	}
		var stream_buffer = new ss.Buffer(audio_array_buffer);
		stream.write(stream_buffer, 'buffer');
    }


    sockt_initialize();

    return SocketStream_Object;

  }]);
