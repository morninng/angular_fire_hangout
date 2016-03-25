'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StaticvideoCtrl
 * @description
 * # StaticvideoCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StaticvideoCtrl',[ '$scope', 'MixideaSetting','HangoutService',  function ($scope, MixideaSetting, HangoutService) {


    function update_video_width(){
      var video_area_element = document.getElementById("static__dummy_layout");
      var video_width = video_area_element.offsetWidth;
      var ratio = HangoutService.get_video_ratio;
      var video_area_height = video_width / ratio;
      var video_area_height_val = video_area_height + "px"
      $scope.video_dumy_size = {height:video_area_height_val};

      HangoutService.set_video_width(video_width)

    }


    function update_video_canvas_position(){


      var container_second_element = document.getElementById("container_second_top");
      var container_second_height = container_second_element.offsetHeight;

      var container_top_element = document.getElementById("container_top");
      var container_top_height = container_top_element.offsetHeight;

      var absolute_offset =  container_top_height + container_second_height;


      HangoutService.set_video_visible(true);
      HangoutService.set_video_position(0,absolute_offset);

    }
    HangoutService.set_video_visible(true);
    update_video_width();
    setTimeout(update_video_width, 100);
    setTimeout(update_video_width, 1000);
    update_video_canvas_position();
    setTimeout(update_video_canvas_position, 100);
    setTimeout(update_video_canvas_position, 1000);

  }]);

