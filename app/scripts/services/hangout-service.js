'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.HangoutService
 * @description
 * # HangoutService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('HangoutService',[ 'MixideaSetting', function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var canvas = null;
    var feed = null;
    var ratio = 16/9;
    if(MixideaSetting.hangout_execution){
	    canvas = gapi.hangout.layout.getVideoCanvas();
	    feed = gapi.hangout.layout.getDefaultVideoFeed();
	    ratio = canvas.getAspectRatio();
	}

    this.get_video_ratio = function(){
    	return ratio;
    }

    this.set_video_width = function(video_width){

	    if(MixideaSetting.hangout_execution){
	      canvas.setWidth(video_width);
		}
    }
    
    this.set_video_position = function(x,y){
	    if(MixideaSetting.hangout_execution){
    		canvas.setPosition(x,y);
    	}
    }


    this.set_video_visible = function(flag){
        console.log("set_video_visible" +  flag)
        if(MixideaSetting.hangout_execution){
            canvas.setVisible(flag);
        }
    }


    this.enable_microphone = function(){
	    if(MixideaSetting.hangout_execution){
            var muted = gapi.hangout.av.getMicrophoneMute();
            if(muted){
                gapi.hangout.av.setMicrophoneMute(false);
                console.log("microphone turned on")
            }
    	}
    }


    this.disable_microphone = function(){
        if(MixideaSetting.hangout_execution){
            var muted = gapi.hangout.av.getMicrophoneMute();
            if(!muted){
                gapi.hangout.av.setMicrophoneMute(true);
                console.log("microphone turned off");
            }
        }
    }


  }]);
