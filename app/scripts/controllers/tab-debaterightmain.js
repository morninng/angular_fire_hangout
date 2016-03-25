'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TabDebaterightmainCtrl
 * @description
 * # TabDebaterightmainCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TabDebaterightmainCtrl',['$scope','ParticipantMgrService','$state','$timeout', function ( $scope ,ParticipantMgrService, $state, $timeout) {


  	$scope.participant_mgr = ParticipantMgrService;
  	$scope.layout_style = null;

	$scope.$watch('participant_mgr.own_group',function(){goto_child_state();} );
	$scope.$watch('participant_mgr.is_audience_or_debater',function(){goto_child_state();} );

	function goto_child_state(){
	  	var own_group = $scope.participant_mgr.own_group;
	  	var is_audience_or_debater =  $scope.participant_mgr.is_audience_or_debater
		if(own_group && is_audience_or_debater){
			if(is_audience_or_debater == "debater"){
				$state.go('main.debate.prep_note');
			}else{
				$state.go('main.debate.own_note');
			}
		}
	}


	function set_pain_size(){

/*height*/
	    var tab_layout_element = document.getElementById("container_main_right");
	    var top_position = tab_layout_element.offsetTop;
	    var parent_height = window.innerHeight;
	    var expected_height = parent_height - top_position - 10;

	    var debate_layout_element = document.getElementById("debate_right_main_container");
	    var debate_layout_current_height = debate_layout_element.offsetHeight;

	    var diff_height = expected_height - debate_layout_current_height;
	    var diff_height_abs = Math.abs(diff_height);


/*width*/
	    var left_position = tab_layout_element.offsetLeft;
	    var parent_width = window.innerWidth;
	    var expected_width = parent_width - left_position - 50
	    var debate_layout_current_width = debate_layout_element.offsetWidth;
	    var diff_width = expected_width - debate_layout_current_width;
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
	var debate_layout_element = document.getElementById("debate_right_main_container");
	debate_layout_element.onscroll = function(){
		set_pain_size();
	}


	goto_child_state();



  }]);
