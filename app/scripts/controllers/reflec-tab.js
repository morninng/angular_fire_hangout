'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:ReflecTabCtrl
 * @description
 * # ReflecTabCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('ReflecTabCtrl',["$scope","$timeout", function ($scope, $timeout) {



	function set_pain_size(){
		console.log("set_pain_size");

/*height*/
	    var tab_layout_element = document.getElementById("container_main_right");
	    var top_position = tab_layout_element.offsetTop;
	    var parent_height = window.innerHeight;
	    var expected_height = parent_height - top_position - 10;

	    var reflec_layout_element = document.getElementById("reflec_tab_container");
	    var reflec_layout_current_height = reflec_layout_element.offsetHeight;

	    var diff_height = expected_height - reflec_layout_current_height;
	    var diff_height_abs = Math.abs(diff_height);


/*width*/
	    var left_position = tab_layout_element.offsetLeft;
	    var parent_width = window.innerWidth;
	    var expected_width = parent_width - left_position - 10
	    var reflec_layout_current_width = reflec_layout_element.offsetWidth;
	    var diff_width = expected_width - reflec_layout_current_width;
	    var diff_width_abs = Math.abs(diff_width);


	    if( diff_height_abs > 5 || diff_width_abs > 5){
	    	var adjust_height_str = String(expected_height) + "px";
	    	var adjust_width_str = String(expected_width) + "px";
    		$scope.layout_style = {height:adjust_height_str,width:adjust_width_str, overflow:"scroll"};
    		$timeout(function() {});
    	}
	}

	set_pain_size();
	setTimeout(set_pain_size,1000);
	var reflec_layout_element = document.getElementById("reflec_tab_container");
	reflec_layout_element.onscroll = function(){
		set_pain_size();
	}




  }]);
