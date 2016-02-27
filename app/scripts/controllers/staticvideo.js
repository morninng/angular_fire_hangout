'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StaticvideoCtrl
 * @description
 * # StaticvideoCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StaticvideoCtrl',[ '$scope', function ($scope) {

  	var ratio = 0.8;
  	var layout_width = 300;
  	var layout_width_str = String(layout_width) + "px";
  	var layout_height = layout_width * ratio;
  	var layout_height_str = String(layout_height) + "px";

  	$scope.video_canvas_dummy_layout = {width: layout_width_str, height:layout_height_str};


  }]);
