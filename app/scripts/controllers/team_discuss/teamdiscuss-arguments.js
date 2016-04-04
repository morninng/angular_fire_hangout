'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TeamdiscussArgumentsCtrl
 * @description
 * # TeamdiscussArgumentsCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TeamdiscussArgumentsCtrl',["$scope","MixideaSetting",'$timeout','ParticipantMgrService', function ($scope, MixideaSetting,$timeout, ParticipantMgrService) {

  $scope.arg_list = new Array();
  $scope.defintro_list = new Array();
  $scope.layout_style = null;

  var team_val = MixideaSetting.team_discuss_team_side;
  if(!team_val){
  	// this part is only for main room argument
  	$scope.participant_mgr = ParticipantMgrService;
  	team_val = $scope.participant_mgr.own_group;

  }



  var event_id_val = MixideaSetting.event_id;
  var deb_style_val = null;
 //var root_ref = new Firebase("https://mixidea.firebaseio.com/");

  var deb_style_ref = global_firebase_root_ref.child("event_related/game/" + event_id_val + "/deb_style")
  deb_style_ref.on("value", function(snapshot) {
    deb_style_val  = snapshot.val();
    construct_discussion_note();

  }, function (errorObject) {
    alert("fail to retrieve debate style" + errorObject.code);

  });
  
  function construct_discussion_note(){

	var argument_id_path = "event_related/Article_Context/" + event_id_val + "/identifier/" 
				+ deb_style_val + "/" + team_val + "/arguments";
	$scope.argument_id_ref = global_firebase_root_ref.child(argument_id_path);
	$scope.argument_id_ref.on("child_added", function(snapshot, previousKey){
		var arg_id_key = snapshot.key();
		$timeout(function(){
			$scope.arg_list.push({arg_id:arg_id_key,event_id:event_id_val, team:team_val,deb_style: deb_style_val});
		});
	});

	$scope.argument_id_ref.on("child_removed", function(snapshot, previousKey){
		var arg_id_key_removed = snapshot.key();
		var current_id_array = $scope.arg_list;
		var n = -1
		for(var i=0; i< $scope.arg_list.length; i++){
			if($scope.arg_list[i].arg_id == arg_id_key_removed){
				n=i;
			}
		}
		if(n!=-1){
			$timeout(function(){
				$scope.arg_list.splice(n,1);
			});
		}
	});

	var defintro_id_path = "event_related/Article_Context/" + event_id_val + "/identifier/" 
				+ deb_style_val + "/" + team_val + "/def_intro";
	$scope.defintro_id_ref = global_firebase_root_ref.child(defintro_id_path);
	$scope.defintro_id_ref.on("child_added", function(snapshot, previousKey){
		var defintro_id_key = snapshot.key();
		$timeout(function(){
			$scope.defintro_list.push({arg_id:defintro_id_key,event_id:event_id_val, team:team_val,deb_style: deb_style_val});
		});
	});

	$scope.add_argument = function(){
		console.log("add argument");
		var dummy_content = {dummy:true};
		$scope.argument_id_ref.push(dummy_content);
	}

  }




	function set_pain_size(){
		console.log("set_pain_size");

/*height*/
	    var main_layout_element = document.getElementById("container_main");
	    var main_position = main_layout_element.offsetTop;
	    var parent_height = window.innerHeight;
	    var expected_height = parent_height - main_position - 10;

	    var argument_layout_element = document.getElementById("teamdiscuss_argument_container");
	    var argument_layout_current_height = argument_layout_element.offsetHeight;

	    var diff_height = expected_height - argument_layout_current_height;
	    var diff_height_abs = Math.abs(diff_height);


/*width*/
	    var left_position = 0;
	    var parent_width = window.innerWidth;
	    var expected_width = parent_width - left_position - 10
	    var main_layout_current_width = argument_layout_element.offsetWidth;
	    var diff_width = expected_width - main_layout_current_width;
	    var diff_width_abs = Math.abs(diff_width);


	    if( diff_height_abs > 5 || diff_width_abs > 5){
	    	var adjust_height_str = String(expected_height) + "px";
	    	var adjust_width_str = String(expected_width) + "px";
    		$scope.layout_style = {height:adjust_height_str,width:adjust_width_str, overflow:"scroll"};
    		$timeout(function() {});
    	}
	}

	if(MixideaSetting.room_type == "team_discussion"){
		set_pain_size();
		setTimeout(set_pain_size,1000);
		var argument_layout_element = document.getElementById("teamdiscuss_argument_container");
		argument_layout_element.onscroll = function(){
			set_pain_size();
		}
	}
   $scope.$on("$destroy", function() {
   		$scope.defintro_id_ref.off("child_added");
   		$scope.argument_id_ref.off("child_added");
   		$scope.argument_id_ref.off("child_removed");
   		deb_style_ref.off("value");
    });


  }]);
