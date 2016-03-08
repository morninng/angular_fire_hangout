'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.SoundPlayService
 * @description
 * # SoundPlayService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('SoundPlayService',['MixideaSetting', function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function






	this.PinOne = function(){
		console.log("pin one");
		if(!sound_mgr.PinOne_sound){
			return;
		}
		sound_mgr.PinOne_sound.start(0);
		sound_mgr.PinOne_sound = audio_context.createBufferSource();
		sound_mgr.PinOne_sound.buffer = sound_mgr.PinOne_sound_persisted_buffer;
		sound_mgr.PinOne_sound.connect(audio_context.destination);
	}


	this.SpeechStart = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.SpeechStart_sound.start(0);
		sound_mgr.SpeechStart_sound = audio_context.createBufferSource();
		sound_mgr.SpeechStart_sound.buffer = sound_mgr.SpeechStart_sound_persisted_buffer;
		sound_mgr.SpeechStart_sound.connect(audio_context.destination);
	}


	function BufferLoader(context, urlList, callback) {
	  this.context = context;
	  this.urlList = urlList;
	  this.onload = callback;
	  this.bufferList = new Array();
	  this.loadCount = 0;
	}

	BufferLoader.prototype.loadBuffer = function(url, index) {
	  // Load buffer asynchronously
	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	  request.responseType = "arraybuffer";

	  var loader = this;

	  request.onload = function() {
	    // Asynchronously decode the audio file data in request.response
	    loader.context.decodeAudioData(
	      request.response,
	      function(buffer) {
	        if (!buffer) {
	          alert('error decoding file data: ' + url);
	          return;
	        }
	        loader.bufferList[index] = buffer;
	        if (++loader.loadCount == loader.urlList.length)
	          loader.onload(loader.bufferList);
	      },
	      function(error) {
	        console.error('decodeAudioData error', error);
	      }
	    );
	  }

	  request.onerror = function() {
	    alert('BufferLoader: XHR error');
	  }

	  request.send();
	};

	BufferLoader.prototype.load = function() {
	  for (var i = 0; i < this.urlList.length; ++i)
	  this.loadBuffer(this.urlList[i], i);
	};



	var bufferLoader = null;
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var audio_context = new AudioContext();
	var sound_mgr = new Object();
	loadSounds();

	function loadSounds(obj, soundMap) {

	  bufferLoader = new BufferLoader(
	  	audio_context,
	    [
	    MixideaSetting.source_domain + 'audio/pointofinformation.mp3',
	    MixideaSetting.source_domain + 'audio/hearhear.mp3',
	    MixideaSetting.source_domain + 'audio/shame.mp3',
	    MixideaSetting.source_domain + 'audio/taken.mp3',
	    MixideaSetting.source_domain + 'audio/gobacktospeaker.mp3',
	    MixideaSetting.source_domain + 'audio/OnePin.mp3',
	    MixideaSetting.source_domain + 'audio/TwoPin.mp3',
	    MixideaSetting.source_domain + 'audio/ThreePin.mp3',
	    MixideaSetting.source_domain + 'audio/cursor1.mp3',
	    MixideaSetting.source_domain + 'audio/speech_start.mp3',
	     ],
	    finishedLoading
	  );
	  bufferLoader.load();
	}

	function finishedLoading(bufferList){
		sound_mgr.Poi_sound = audio_context.createBufferSource();
		sound_mgr.Poi_sound.buffer = bufferList[0];
		sound_mgr.Poi_sound_persisted_buffer = bufferList[0];
		sound_mgr.Poi_sound.connect(audio_context.destination);

		sound_mgr.HearHear_sound = audio_context.createBufferSource();
		sound_mgr.HearHear_sound.buffer = bufferList[1];
		sound_mgr.HearHear_sound_persisted_buffer = bufferList[1];
		sound_mgr.HearHear_sound.connect(audio_context.destination);

		sound_mgr.BooBoo_sound = audio_context.createBufferSource();
		sound_mgr.BooBoo_sound.buffer = bufferList[2];
		sound_mgr.BooBoo_sound_persisted_buffer = bufferList[2];
		sound_mgr.BooBoo_sound.connect(audio_context.destination);

		sound_mgr.Taken_sound = audio_context.createBufferSource();
		sound_mgr.Taken_sound.buffer = bufferList[3];
		sound_mgr.Taken_sound_persisted_buffer = bufferList[3];
		sound_mgr.Taken_sound.connect(audio_context.destination);

		sound_mgr.PoiFinish_sound = audio_context.createBufferSource();
		sound_mgr.PoiFinish_sound.buffer = bufferList[4];
		sound_mgr.PoiFinish_sound_persisted_buffer = bufferList[4];
		sound_mgr.PoiFinish_sound.connect(audio_context.destination);

		sound_mgr.PinOne_sound = audio_context.createBufferSource();
		sound_mgr.PinOne_sound.buffer = bufferList[5];
		sound_mgr.PinOne_sound_persisted_buffer = bufferList[5];
		sound_mgr.PinOne_sound.connect(audio_context.destination);

		sound_mgr.PinTwo_sound = audio_context.createBufferSource();
		sound_mgr.PinTwo_sound.buffer = bufferList[6];
		sound_mgr.PinTwo_sound_persisted_buffer = bufferList[6];
		sound_mgr.PinTwo_sound.connect(audio_context.destination);

		sound_mgr.PinThree_sound = audio_context.createBufferSource();
		sound_mgr.PinThree_sound.buffer = bufferList[7];
		sound_mgr.PinThree_sound_persisted_buffer = bufferList[7];
		sound_mgr.PinThree_sound.connect(audio_context.destination);

		sound_mgr.Cursol_sound = audio_context.createBufferSource();
		sound_mgr.Cursol_sound.buffer = bufferList[8];
		sound_mgr.Cursol_sound_persisted_buffer = bufferList[8];
		sound_mgr.Cursol_sound.connect(audio_context.destination);

		sound_mgr.SpeechStart_sound = audio_context.createBufferSource();
		sound_mgr.SpeechStart_sound.buffer = bufferList[9];
		sound_mgr.SpeechStart_sound_persisted_buffer = bufferList[9];
		sound_mgr.SpeechStart_sound.connect(audio_context.destination);
	}
}]);
