'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StaticvideoCtrl
 * @description
 * # StaticvideoCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StaticvideoCtrl',[ '$scope', 'MixideaSetting', function ($scope, MixideaSetting) {


    var canvas = null;
    var feed = null;
    var ratio = 16/9;
    var video_area_height = 0;
    var video_area_element = document.getElementById("static__dummy_layout");
    var video_width = video_area_element.offsetWidth;
    video_area_height = video_width / ratio;
    var video_area_height_val = video_area_height + "px"
    $scope.video_dumy_size = {height:video_area_height_val};
    console.log("video_area_height_val :" + video_area_height_val)

    if(MixideaSetting.hangout_execution){
      canvas = gapi.hangout.layout.getVideoCanvas();
      feed = gapi.hangout.layout.getDefaultVideoFeed();
      ratio = canvas.getAspectRatio();
      canvas.setWidth(video_width);
      canvas.setVisible(true);
    }

    function update_video_canvas_position(){

      console.log("update_video_canvas_position");

      var container_second_element = document.getElementById("container_second_top");
      var container_second_height = container_second_element.offsetHeight;
      console.log("container_second_height" + container_second_height);

      var container_top_element = document.getElementById("container_top");
      var container_top_height = container_top_element.offsetHeight;
      console.log("container_top_height" + container_top_height);

      var absolute_offset =  container_top_height + container_second_height;
      console.log("absolute_offset" + absolute_offset);
      if(MixideaSetting.hangout_execution){
        canvas.setPosition(0,absolute_offset);
      }
    }
    setTimeout(update_video_canvas_position, 1000);

  }]);
