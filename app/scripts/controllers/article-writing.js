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
	$scope.Asian_Prop_def_intro = null;
	$scope.Asian_Prop_arguments = [];
	$scope.Asian_Opp_arguments = [];
	$scope.BP_OG_def_intro = null;
	$scope.BP_OG_arguments = [];
	$scope.BP_OO_arguments = [];
	$scope.BP_CG_arguments = [];
	$scope.BP_CO_arguments = [];

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
				var def_intro_id = Object.keys($scope.argument_id_data.NA.Gov.def_intro)[0];
				if(def_intro_id){
					var obj = {arg_id:def_intro_id,event_id:event_id_val,team:"Gov",deb_style:"NA"};
					$scope.NA_Gov_def_intro = obj;
				}

				$scope.NA_Gov_arguments.length = 0;
				var arguments_array_na_gov = Object.keys($scope.argument_id_data.NA.Gov.arguments);
				for(var i=0; i<arguments_array_na_gov.length; i++){
					var obj = {arg_id:arguments_array_na_gov[i],event_id:event_id_val,team:"Gov",deb_style:"NA"};
					$scope.NA_Gov_arguments.push(obj);
				}
				$scope.NA_Opp_arguments.length = 0;
				var arguments_array_na_opp = Object.keys($scope.argument_id_data.NA.Opp.arguments);
				for(var i=0; i<arguments_array_na_opp.length; i++){
					var obj = {arg_id:arguments_array_na_opp[i],event_id:event_id_val,team:"Opp",deb_style:"NA"};
					$scope.NA_Opp_arguments.push(obj);
				}

			break;
			case "Asian":
				var def_intro_id = Object.keys($scope.argument_id_data.Asian.Prop.def_intro)[0];
				if(def_intro_id){
					var obj = {arg_id:def_intro_id,event_id:event_id_val,team:"Prop",deb_style:"Asian"};
					$scope.Asian_Prop_def_intro = obj;
				}

				$scope.Asian_Prop_arguments.length = 0;
				var arguments_array_asian_prop = Object.keys($scope.argument_id_data.Asian.Prop.arguments);
				for(var i=0; i<arguments_array_asian_prop.length; i++){
					var obj = {arg_id:arguments_array_asian_prop[i],event_id:event_id_val,team:"Prop",deb_style:"Asian"};
					$scope.Asian_Prop_arguments.push(obj);
				}
				$scope.Asian_Opp_arguments.length = 0;
				var arguments_array_asian_opp = Object.keys($scope.argument_id_data.Asian.Opp.arguments);
				for(var i=0; i<arguments_array_asian_opp.length; i++){
					var obj = {arg_id:arguments_array_asian_opp[i],event_id:event_id_val,team:"Opp",deb_style:"Asian"};
					$scope.Asian_Opp_arguments.push(obj);
				}
			break;
			case "BP":

				var def_intro_id = Object.keys($scope.argument_id_data.BP.OG.def_intro)[0];
				if(def_intro_id){
					var obj = {arg_id:def_intro_id,event_id:event_id_val,team:"OG",deb_style:"BP"};
					$scope.BP_OG_def_intro = obj;
				}

				$scope.BP_OG_arguments.length = 0;
				var arguments_array_bp_og= Object.keys($scope.argument_id_data.BP.OG.arguments);
				for(var i=0; i<arguments_array_bp_og.length; i++){
					var obj = {arg_id:arguments_array_bp_og[i],event_id:event_id_val,team:"OG",deb_style:"BP"};
					$scope.BP_OG_arguments.push(obj);
				}
				$scope.BP_OO_arguments.length = 0;
				var arguments_array_bp_oo = Object.keys($scope.argument_id_data.BP.OO.arguments);
				for(var i=0; i<arguments_array_bp_oo.length; i++){
					var obj = {arg_id:arguments_array_bp_oo[i],event_id:event_id_val,team:"OO",deb_style:"BP"};
					$scope.BP_OO_arguments.push(obj);
				}
				$scope.BP_CG_arguments.length = 0;
				var arguments_array_bp_cg = Object.keys($scope.argument_id_data.BP.CG.arguments);
				for(var i=0; i<arguments_array_bp_cg.length; i++){
					var obj = {arg_id:arguments_array_bp_cg[i],event_id:event_id_val,team:"CG",deb_style:"BP"};
					$scope.BP_CG_arguments.push(obj);
				}
				$scope.BP_CO_arguments.length = 0;
				var arguments_array_bp_co = Object.keys($scope.argument_id_data.BP.CO.arguments);
				for(var i=0; i<arguments_array_bp_co.length; i++){
					var obj = {arg_id:arguments_array_bp_co[i],event_id:event_id_val,team:"CO",deb_style:"BP"};
					$scope.BP_CO_arguments.push(obj);
				}
			break;
		}

		$timeout(function() {});

	}
	$scope.$on("$destroy", function() {
		argument_id_ref.off("value");
	});

 

  }]);
