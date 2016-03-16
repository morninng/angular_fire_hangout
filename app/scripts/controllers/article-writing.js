'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:ArticleWritingCtrl
 * @description
 * # ArticleWritingCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('ArticleWritingCtrl',['$scope','ParticipantMgrService','MixideaSetting','$timeout', function ($scope,ParticipantMgrService, MixideaSetting, $timeout) {


	$scope.participant_mgr = ParticipantMgrService;
	$scope.debate_style = $scope.participant_mgr.debate_style;
	$scope.argument_id_data = null;
	$scope.NA_Gov_def_intro = null;
	$scope.NA_Gov_arguments = [];
	$scope.NA_Opp_arguments = [];

	var event_id_val = MixideaSetting.event_id;


    var root_ref = new Firebase(MixideaSetting.firebase_url);
	var argument_id_path = "event_related/Article_Context/" + event_id_val + "/identifier/";
	var argument_id_ref = root_ref.child(argument_id_path);

	argument_id_ref.on("value", function(snapshot){
		$scope.argument_id_data = snapshot.val();
		construct_argument_structure();

		$scope.$watch('participant_mgr.debate_style', 
			function(newValue, oldValue){
				$scope.debate_style = newValue;
				construct_argument_structure();
			}
		);

	});


	$scope.add_argument = function(deb_style_val, team_val){

		var argument_id_path = "event_related/Article_Context/" + event_id_val + "/identifier/" 
					+ deb_style_val + "/" + team_val + "/arguments";
		var argument_id_ref = root_ref.child(argument_id_path);
		var dummy_content = {dummy:true};
		argument_id_ref.push(dummy_content);

	};

	function construct_argument_structure(){

		if(!$scope.argument_id_data){
			return;
		}

		switch($scope.debate_style){
			case "NA":
				$scope.NA_Gov_def_intro = Object.keys($scope.argument_id_data.NA.Gov.def_intro)[0];

				$scope.NA_Gov_arguments.length = 0;
				var arguments_array = Object.keys($scope.argument_id_data.NA.Gov.arguments);
				for(var i=0; i<arguments_array.length; i++){
					var obj = {arg_id:arguments_array[i],event_id:event_id_val,team:"Gov",deb_style:"NA"};
					$scope.NA_Gov_arguments.push(obj);
				}
				//$scope.NA_Gov_summary = $scope.argument_id_data.NA.Gov.summary.keys();
				$scope.NA_Opp_arguments = Object.keys($scope.argument_id_data.NA.Opp.arguments);
				//$scope.NA_Opp_summary = $scope.argument_id_data.NA.Opp.summary.keys();
			break;
			case "Asian":
			break;
			case "BP":
			break;
		}

		$timeout(function() {});

	}


 

  }]);
