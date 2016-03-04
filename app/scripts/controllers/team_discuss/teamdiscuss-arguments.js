'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TeamdiscussArgumentsCtrl
 * @description
 * # TeamdiscussArgumentsCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TeamdiscussArgumentsCtrl',["$scope","MixideaSetting",'$timeout', function ($scope, MixideaSetting,$timeout) {

  $scope.arg_list = new Array();

  var team_val = MixideaSetting.team_discuss_team_side;
  var event_id_val = MixideaSetting.event_id;
  var deb_style_val = null;
  var root_ref = new Firebase("https://mixidea.firebaseio.com/");

  var deb_style_ref = root_ref.child("event_related/game/" + event_id_val + "/deb_style")
  deb_style_ref.on("value", function(snapshot) {
    deb_style_val  = snapshot.val();
    construct_discussion_note();

  }, function (errorObject) {
    alert("fail to retrieve debate style" + errorObject.code);

  });


  function construct_discussion_note(){

	var argument_id_path = "event_related/Article_Context/" + event_id_val + "/identifier/" 
				+ deb_style_val + "/" + team_val + "/arguments";
	var argument_id_ref = root_ref.child(argument_id_path);
	argument_id_ref.on("child_added", function(snapshot, previousKey){
		var arg_id_key = snapshot.key();
		$timeout(function(){
			$scope.arg_list.push({arg_id:arg_id_key,event_id:event_id_val, team:team_val,deb_style: deb_style_val});
		});
	});

	argument_id_ref.on("child_removed", function(snapshot, previousKey){
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
  }


	$scope.add_argument = function(){
		console.log("add argument");
		var dummy_content = {dummy:true};
		argument_id_ref.push(dummy_content);
	}





  	$scope.name="kkkk";

  }]);
