'use strict';

/**
 * @ngdoc overview
 * @name angularFireHangoutApp
 * @description
 * # angularFireHangoutApp
 *
 * Main module of the application.
 */
angular
  .module('angularFireHangoutApp', [
    'ngAnimate',
    'ui.router',
    'firebase',
    'ngSanitize'
  ]);




angular.module('angularFireHangoutApp')
  .run(['$state','MixideaSetting','$window','$http', function($state, MixideaSetting, $window, $http) {

  	global_firebase_root_ref = new $window.Firebase(MixideaSetting.firebase_url);

  	console.log("mixidea setting")
  	console.log(MixideaSetting)

	 var event_id = MixideaSetting.event_id;
	 var room_type = MixideaSetting.room_type;

	if(room_type == "main"){

	var game_status_ref = global_firebase_root_ref.child("event_related/game/" + event_id + "/game_status");
	game_status_ref.once("value", function(snapshot){
		var game_status = snapshot.val();
		goto_state(room_type, game_status);
	}, function(error_obj){
		alert("event is corrupted, please confirm with mixidea administrator");
	});
	} else if (room_type == "team_discussion"){

		console.log("team_discuss_team_side : " + MixideaSetting.team_discuss_team_side);
		console.log("team_discuss_own_team : " + MixideaSetting.team_discuss_own_team);

	$state.go('team_discussion.room');
	}
  	notify_enter_hangout();


	function notify_enter_hangout(){

		var post_message = null;
		if(room_type == "main"){
			post_message = {
				userid: MixideaSetting.own_user_id,
				event_id:"-KFDNjQPWg9zAZE9f2B_",
				room_type:"main",
			}
		}else if( room_type == "team_discussion"){
			post_message = {
				userid: MixideaSetting.own_user_id,
				event_id:"-KFDNjQPWg9zAZE9f2B_",
				room_type:"team_discussion",
				room_team: MixideaSetting.team_discuss_team_side
			}	
		}else{
			return;
		}
		console.log("notify enter hangout");
		console.log(post_message);

        var api_gateway_enter_hangout = MixideaSetting.ApiGateway_url + "/enter-hangout";


   	    $http({
          url: api_gateway_enter_hangout,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: post_message
        }).then(function successCallback(response){

          if(response.data.errorMessage){
            console.log(response.data.errorMessage);
          }else{
            console.log(response.data);
            console.log("success to send notification through lambda")
          }

        }, function errorCallback(response){
          console.log("fail to send notification on lambda")
          console.log(response);
        });
	}




	function goto_state(room_type, game_status){
		switch(room_type){
			case "main":
				switch(game_status){
					case "introduction":
						$state.go('main.introduction');
					break;
					case "preparation":
						$state.go('main.preparation');
					break;
					case "debate":
						$state.go('main.debate');
					break;
					case "reflection":
						$state.go('main.reflection');
					break;
					case "complete":
						$state.go('main.complete');
					break;
				}
			break;

			case "team_discussion":
					$state.go('team_discussion.room');
			break;
		}
	}


  (function () {
    var participants_status_root_ref = global_firebase_root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/status");
    

    if(room_type =="team_discussion"){

    	var room_side = MixideaSetting.team_discuss_team_side;
    	var participants_status_ref = participants_status_root_ref.child(room_type + "/" + room_side + "/" + MixideaSetting.own_user_id);
	    participants_status_ref.set(true);
	}else{
    	var participants_status_ref = participants_status_root_ref.child(room_type + "/" + MixideaSetting.own_user_id);
	    participants_status_ref.set(true);	
	}
    participants_status_ref.onDisconnect().set(null);
  })();

}]);
 

angular.module('angularFireHangoutApp')
  .config(['$stateProvider','MixideaSetting', function($stateProvider, MixideaSetting ) {

	$stateProvider
	.state('main', {
		views:{
			"RootView":{
				templateUrl: MixideaSetting.source_domain + 'views/main/layout_main_room.html',
				controller: 'MainlayoutSizeadjustCtrl'
			}
		}
	})
	.state('main.introduction', {
		views:{
			"top_left":{
			templateUrl: MixideaSetting.source_domain + 'views/common/title.html',
			controller: 'TitleMgrCtrl'
			},
			"container_second_top":{
			templateUrl: MixideaSetting.source_domain + 'views/common/status-bar.html',
			controller: 'StatusbarCtrl'
			},
			"container_main_left_above_left_up":{
			templateUrl: MixideaSetting.source_domain + 'views/main/video_static.html',
			controller: 'StaticvideoCtrl'
			},
			"container_main_left_above_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/direction_intro.html',
			controller: 'StatusUpdateCtrl'
			},
			"container_main_left_below":{
			templateUrl: MixideaSetting.source_domain + 'views/main/info_intro.html'
			},
			"container_main_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/participant_table.html',
			controller: 'ParticipantTableParentCtrl'
			}			
		}
	})
	.state('main.preparation', {
		views:{
			"top_left":{
			templateUrl: MixideaSetting.source_domain + 'views/common/title.html',
			controller: 'TitleMgrCtrl'
			},
			"container_second_top":{
			templateUrl: MixideaSetting.source_domain + 'views/common/status-bar.html',
			controller: 'StatusbarCtrl'
			},
			"container_main_left_above_left_up":{
			templateUrl: MixideaSetting.source_domain + 'views/main/video_static.html',
			controller: 'StaticvideoCtrl'
			},
			"container_main_left_above_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/direction_prep.html',
			controller: 'StatusUpdateCtrl'
			},
			"container_main_left_below":{
			templateUrl: MixideaSetting.source_domain + 'views/main/info_prep.html',
			controller: 'LinkTeamdiscussCtrl'
			},
			"container_main_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/participant_table.html',
			controller: 'ParticipantTableParentCtrl'
			}	
		}
	})
	.state('main.debate', {
		views:{
			"top_left":{
			templateUrl: MixideaSetting.source_domain + 'views/common/title_fix.html',
			controller: 'TitleMgrCtrl'
			},
			"top_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/direction_debate.html',
			controller: 'StatusUpdateCtrl'		
			},
			"container_second_top":{
			templateUrl: MixideaSetting.source_domain + 'views/common/status-bar.html',
			controller: 'StatusbarCtrl'
			},
			"container_main_left_above_left_up":{
			templateUrl: MixideaSetting.source_domain + 'views/main/video_debate.html',
			controller: 'VideodebateCtrl'		
			},
			"container_main_left_above_left_below":{
			templateUrl: MixideaSetting.source_domain + 'views/main/impression_expression.html',
			controller: 'ImpressionExpressionCtrl'
			},
			"container_main_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/layout_debate_tab_right_main.html',
			controller: 'TabDebaterightmainCtrl'
			},
			"absolute_pain_1":{
			templateUrl: MixideaSetting.source_domain + 'views/main/debater_bar.html',
			controller: 'DebaterbarCtrl'
			}
		}
	})
	.state('main.debate.own_note', {
		views:{
			debate_raight_main_content:{
				templateUrl: MixideaSetting.source_domain + 'views/main/own_note.html',
				controller: 'OwnnoteCtrl'
			}
		}
	})
	.state('main.debate.prep_note', {
		views:{
			debate_raight_main_content:{
				templateUrl: MixideaSetting.source_domain + 'views/team_discussion/t_room_arguments.html',
				controller: 'TeamdiscussArgumentsCtrl'
			}
		}
	})
	.state('main.reflection', {
		views:{
			"top_left":{
			templateUrl: MixideaSetting.source_domain + 'views/common/title_fix.html',
			controller: 'TitleMgrCtrl'
			},
			"top_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/direction_reflection.html',
			controller: 'StatusUpdateCtrl'		
			},
			"container_second_top":{
			templateUrl: MixideaSetting.source_domain + 'views/common/status-bar.html',
			controller: 'StatusbarCtrl'
			},
			"container_main_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/layout_reflec_tab.html',
			controller: 'ReflecTabCtrl'
			}
		}
	})
	.state('main.reflection.write_article', {
		views:{
			"reflec_tab_first":{
			templateUrl: MixideaSetting.source_domain + 'views/main/url_sharing.html',
			controller: 'UrlSharingCtrl'
			},
			"reflec_tab_second":{
			templateUrl: MixideaSetting.source_domain + 'views/main/article_writing.html',
			controller: 'ArticleWritingCtrl'
			}
		}
	})
	.state('main.reflection.own_note', {
		views:{
			"reflec_tab_first":{
			templateUrl: MixideaSetting.source_domain + 'views/main/own_note.html',
			controller: 'OwnnoteCtrl'
			}
		}
	})
	.state('main.complete', {
		views:{
			"top_left":{
			templateUrl: MixideaSetting.source_domain + 'views/common/title_fix.html',
			controller: 'TitleMgrCtrl'
			},
			"top_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/direction_complete.html',
			controller: 'StatusUpdateCtrl'		
			},
			"container_second_top":{
			templateUrl: MixideaSetting.source_domain + 'views/common/status-bar.html',
			controller: 'StatusbarCtrl'
			}
		}
	})
	.state('team_discussion', {
		views:{
			"RootView":{
				templateUrl: MixideaSetting.source_domain + 'views/team_discussion/t_room_layout.html'
			}
		}
	})
	.state('team_discussion.room', {
		views:{
			"team_discuss_first":{
			templateUrl: MixideaSetting.source_domain + 'views/team_discussion/room_name.html',
			controller: 'TeamdiscussRoomnameCtrl'
			},
			"second_left":{
			templateUrl: MixideaSetting.source_domain + 'views/team_discussion/t_room_motion.html',
			controller: 'TitleMgrCtrl'
			},
			"second_middle":{
			templateUrl: MixideaSetting.source_domain + 'views/team_discussion/t_room_link_main_room.html',
			controller: 'LinkMainroomCtrl'
			},
			"second_right":{
			templateUrl: MixideaSetting.source_domain + 'views/team_discussion/t_room_count_prep_time.html',
			controller: 'CountPreptimeCtrl'
			},
			"container_main":{
			templateUrl: MixideaSetting.source_domain + 'views/team_discussion/t_room_arguments.html',
			controller: 'TeamdiscussArgumentsCtrl'
			}
		}
	})

}]);


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


    //var root_ref = new Firebase(MixideaSetting.firebase_url);
	var argument_id_path = "event_related/Article_Context/" + event_id_val + "/identifier/";
	var argument_id_ref = global_firebase_root_ref.child(argument_id_path);

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

		var argument_id_path_add = "event_related/Article_Context/" + event_id_val + "/identifier/" 
					+ deb_style_val + "/" + team_val + "/arguments";
		var argument_id_add_ref = root_ref.child(argument_id_path_add);
		var dummy_content = {dummy:true};
		argument_id_add_ref.push(dummy_content);

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

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:CountPreptimeCtrl
 * @description
 * # CountPreptimeCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('CountPreptimeCtrl',['$scope','MixideaSetting', '$timeout',function ($scope, MixideaSetting, $timeout) {

	$scope.prep_time = "start preparation";
	var start_time = null;

	//var root_ref = new Firebase("https://mixidea.firebaseio.com/");
	var preptime_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/preparation_timer/")
	preptime_ref.on("value", function(snapshot){
		start_time = snapshot.val();
	}, function(){
		console.log("fail to load timer data");
	});


	var timer = setInterval( function(){

		if(!start_time){
			return;
		}
		var current_time = Date.now();
		var elapsed_time = current_time - start_time;
		if(elapsed_time < 0){
			return;
		}
		var elapled_second = elapsed_time/1000
		var elapsed_hour = elapled_second/60/60;
		elapsed_hour = Math.floor(elapsed_hour);
		var elapsed_minute = (elapled_second - elapsed_hour*60*60)/60;
		elapsed_minute = Math.floor(elapsed_minute);
		elapled_second = elapled_second - elapsed_hour*60*60 - elapsed_minute*60;
		elapled_second = Math.floor(elapled_second);
		elapled_second = ("0" + elapled_second).slice(-2);
		elapsed_minute = ("0" + elapsed_minute).slice(-2);

		
		$scope.prep_time = elapsed_minute + ":" + elapled_second + " has passed";
		$timeout(function() {});

	}, 1000);


	$scope.$on("$destroy", function() {
		clearInterval(timer);
		preptime_ref.off("value")
	});



  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:DebaterbarCtrl
 * @description
 * # DebaterbarCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('DebaterbarCtrl',['$scope','ParticipantMgrService','MixideaSetting','$timeout','SpeechStatusService', function ($scope, ParticipantMgrService, MixideaSetting, $timeout, SpeechStatusService) {


	$scope.participant_mgr = ParticipantMgrService;
	$scope.debater_array = [];
	$scope.speech_status = SpeechStatusService;
	$scope.cancel_style_watch = $scope.$watch('participant_mgr.debate_style',function(){update_debater_array()} );


	var debater_array_NA = ["PM","LO","MG","MO","PMR","LOR"];
	var debater_array_Asian = ["PM","LO","DPM","DLO","GW","OW","LOR","PMR"];
	var debater_array_BP = ["PM","LO","DPM","DLO","MG","MO","GW","OW"];

	function update_debater_array(){
		if(!$scope.participant_mgr){
			return;
		}
		switch($scope.participant_mgr.debate_style){
			case "NA":
				for(var i=0; i< debater_array_NA.length; i++){
					$scope.debater_array.push({role_name:debater_array_NA[i], role_state:"normal"});
				}
			break;
			case "Asian":
				for(var i=0; i< debater_array_Asian.length; i++){
					$scope.debater_array.push({role_name:debater_array_Asian[i], role_state:"normal"});
				}
			break;
			case "BP":
				for(var i=0; i< debater_array_BP.length; i++){
					$scope.debater_array.push({role_name:debater_array_BP[i], role_state:"normal"});
				}
			break;
		}
	}



	function update_speaker(current_speaker_role){
		for(var i=0; i< $scope.debater_array.length; i++){
			$scope.debater_array[i].role_state = "normal";
			if($scope.debater_array[i].role_name == current_speaker_role){
				$scope.debater_array[i].role_state = "speaker";
			}
		}
		$timeout(function() {});
	}



/*
	//var root_ref = new Firebase(MixideaSetting.firebase_url);
	var video_status_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
	var speaker_ref = video_status_ref.child("speaker");

	speaker_ref.on("value", function(snapshot){
		var speaker_obj = snapshot.val();
		if(!speaker_obj){
			current_speaker_role = null
			update_speaker(null);
		}else{
			var keys = Object.keys(speaker_obj);
			if(keys && keys[0]){
				var current_speaker_role = speaker_obj[keys[0]];
				var role_name = current_speaker_role.role;
				update_speaker(role_name);
			}
		}
	}, function(error){
		console.log("fail while to retrieve speaker obj" + error);
	})
*/
	$scope.$on("$destroy", function() {
//		speaker_ref.off("value");
		$scope.cancel_style_watch();
	});




  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:ImpressionExpressionCtrl
 * @description
 * # ImpressionExpressionCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('ImpressionExpressionCtrl',['$scope','MixideaSetting','SoundPlayService','ParticipantMgrService','$timeout', function ($scope,MixideaSetting, SoundPlayService, ParticipantMgrService, $timeout) {

  	$scope.participant_mgr = ParticipantMgrService;

  	$scope.hearhear_users_array = new Array();
  	$scope.booboo_users_array = new Array();
	// var root_ref = new Firebase(MixideaSetting.firebase_url);
	var impression_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/impression_expression");
	var hearhear_ref = impression_ref.child("hearhear");
	var hearhear_own_ref = hearhear_ref.child(MixideaSetting.own_user_id)
	var booboo_ref = impression_ref.child("booboo");
	var booboo_own_ref = booboo_ref.child(MixideaSetting.own_user_id)



	$scope.click_hearhear = function(){
		console.log("hearhear");
		hearhear_own_ref.set(true);
		hearhear_own_ref.onDisconnect().set(null);
		setTimeout(function(){hearhear_own_ref.set(null)},2000);
	}

	$scope.click_booboo = function(){
		booboo_own_ref.set(true);
		booboo_own_ref.onDisconnect().set(null);
		setTimeout(function(){booboo_own_ref.set(null)},2000);
	}


	var current_hearhear_num = 0;
	var current_booboo_num = 0;


	hearhear_ref.on("value", function(snapshot){
		var hearhear_user_obj = snapshot.val();
		$scope.hearhear_users_array.length = 0;
		for(var key in hearhear_user_obj){
			$scope.hearhear_users_array.push(key);
		}
		if($scope.hearhear_users_array.length > current_hearhear_num){
			SoundPlayService.HearHear();
		}
		current_hearhear_num = $scope.hearhear_users_array.length;
		$timeout(function() {});

	}, function(error_obj){
		console.log(error_obj);
	})


	booboo_ref.on("value", function(snapshot){
		var booboo_user_obj = snapshot.val();
		$scope.booboo_users_array.length = 0;
		for(var key in booboo_user_obj){
			$scope.booboo_users_array.push(key);
		}
		if($scope.booboo_users_array.length > current_booboo_num){
			SoundPlayService.BooBoo();
		}
		current_booboo_num = $scope.booboo_users_array.length;
		$timeout(function() {});

	}, function(error_obj){
		console.log(error_obj);
	})

	$scope.$on("$destroy", function() {
		booboo_ref.off("value");
		hearhear_ref.off("value");

	});


  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:LinkTeamdiscussCtrl
 * @description
 * # LinkTeamdiscussCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('LinkTeamdiscussCtrl',['$scope','ParticipantMgrService','MixideaSetting','$timeout','SpeechStatusService', function ($scope, ParticipantMgrService, MixideaSetting, $timeout, SpeechStatusService) {

 
  	$scope.participant_mgr = ParticipantMgrService;
  	$scope.team_hangout_array = new Array();

  	var teamlist = new Object();
  	var url_list_array = new Array();


  	$scope.cancel_group_watch = $scope.$watch('participant_mgr.own_group', 
  		function(newValue, oldValue){
  			update_link();
  		}
  	);

  // var root_ref = new Firebase(MixideaSetting.firebase_url);
  var hangoutlist_team_ref = global_firebase_root_ref.child("event_related/game_hangout_obj_list/" + MixideaSetting.event_id + "/team_discussion");
  hangoutlist_team_ref.on("value", function(snapshot) {
  	url_list_array = snapshot.val();
  	update_link();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });


  function update_link(){

  	if(url_list_array.length==0 ){
  		return;
  	}
    $scope.team_hangout_array.length=0;


    var hangout_gid = "?gid=";
    var hangout_appid = MixideaSetting.hangout_appid;
    var hangout_query_key = "&gd=";
    var first_query_value = MixideaSetting.own_user_id;;
    var second_query_value = MixideaSetting.event_id;
    var third_query_value = "team_discussion";
    var fifth_query_value = $scope.participant_mgr.own_group;

 
  	if($scope.participant_mgr.is_audience_or_debater=="Audience"){
  		for(var i=0; i< $scope.participant_mgr.all_group_name_array.length; i++){
			var team_obj = new Object();
			team_obj.name = $scope.participant_mgr.all_group_name_array[i];
      var fourth_query_value = $scope.participant_mgr.all_group_name_array[i];
			var hangout_url = url_list_array[i];
			team_obj.hangout_url = hangout_url + hangout_gid + 
						            hangout_appid + hangout_query_key 
						         + first_query_value + "^" + second_query_value + "^" + third_query_value + 
                     "^" + fourth_query_value + "^" + fifth_query_value;
			$scope.team_hangout_array.push(team_obj);
  		}
  	}else{
  		var team_obj = new Object();
  		team_obj.name = $scope.participant_mgr.own_group;
      var fourth_query_value = $scope.participant_mgr.own_group;
  		var hangout_url = url_list_array[$scope.participant_mgr.own_group_id];
		team_obj.hangout_url = hangout_url + hangout_gid + 
						         hangout_appid + hangout_query_key 
                     + first_query_value + "^" + second_query_value + "^" + third_query_value + 
                     "^" + fourth_query_value + "^" + fifth_query_value;
  		$scope.team_hangout_array.push(team_obj);
  	}
    $timeout(function(){});
  }

  $scope.$on("$destroy", function() {
    hangoutlist_team_ref.off("value");
    $scope.cancel_group_watch();
  });


  $scope.show_explanation = false;

  $scope.teamlink_enter = function(){
    $scope.show_explanation = true;
    console.log("teamlink_enter");
  }

  $scope.teamlink_leave = function(){
    $scope.show_explanation = false;
    console.log("teamlink_leave");
  }

  SpeechStatusService.Clear_AllSpeechData();

  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:MainlayoutSizeadjustCtrl
 * @description
 * # MainlayoutSizeadjustCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('MainlayoutSizeadjustCtrl',["$scope",'StatusMgrService','$timeout', function ($scope, StatusMgrService, $timeout) {



  	$scope.game_status_service = StatusMgrService;

	$scope.$watch('game_status_service.game_status', function(newValue, oldValue){

		
		switch(newValue){
			case "introduction":
				$scope.top_right_width = {width:"0px"};
				$scope.main_left_above_left_width = {width:"300px"}
				$scope.main_left_above_right_width = {width:"250px"};
				$scope.main_left_below_width = {width:"550px"};
				$scope.main_right_width = {width:"550px"};
			break;
			case "preparation":
				$scope.top_right_width = {width:"0px"};
				$scope.main_left_above_left_width = {width:"300px"}
				$scope.main_left_above_right_width = {width:"250px"};
				$scope.main_left_below_width = {width:"550px"};
				$scope.main_right_width = {width:"550px"};
			break;
			case "debate":
				$scope.top_right_width = {width:"250px"};
				$scope.main_left_above_left_width = {width:"300px"}
				$scope.main_left_above_right_width = {width:"0px"};
				$scope.main_left_below_width = {width:"0px"};
				$scope.main_width = {width:null};
				$scope.main_right_width = {width:null};


			break;
			case "reflection":
				$scope.top_right_width = {width:"250px"};
				$scope.main_left_above_left_width = {width:"0px"}
				$scope.main_left_above_right_width = {width:"0px"};
				$scope.main_left_below_width = {width:"0px"};
				$scope.main_width = {width:"100%"};
				$scope.main_right_width = {width:"100%"};
			break;
			case "complete":
				$scope.top_right_width = {width:"250px"};
			break;
		}
		$timeout(function() {});

	});




  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:OwnnoteCtrl
 * @description
 * # OwnnoteCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('OwnnoteCtrl',[ '$scope','MixideaSetting','$timeout','ParticipantMgrService', function ($scope, MixideaSetting, $timeout, ParticipantMgrService) {

	console.log("own_note");
	$scope.role_obj_array = new Array();
	$scope.current_role = null;
	$scope.participant_mgr = ParticipantMgrService;

	var NA_team_obj = [
		{name:"PM", shown_name: "Prime Minister"},
		{name:"LO", shown_name: "Leader Opposition"},
		{name:"MG", shown_name: "Member Government"},
		{name:"MO", shown_name: "Member Opposition"},
		{name:"LOR", shown_name: "Leader Opposition Reply"},
		{name:"PMR", shown_name: "Prime Minister Reply"}
	];
	var Asian_team_obj = [
		{name:"PM", shown_name: "Prime Minister"},
		{name:"LO", shown_name: "Leader Opposition"},
		{name:"DPM", shown_name:"Depty Prime Minister"},
		{name:"DLO", shown_name:"Depty Leader Opposition"},
		{name:"GW", shown_name:"Government Whip"},
		{name:"OW", shown_name:"Opposition Whip"},
		{name:"LOR", shown_name:"Leader Opposition Reply"},
		{name:"PMR", shown_name:"Prime Minister Reply"}
	];
	var BP_team_obj = [
		{name:"PM", shown_name: "Prime Minister"},
		{name:"LO", shown_name: "Leader Opposition"},
		{name:"DPM", shown_name:"Depty Prime Minister"},
		{name:"DLO", shown_name:"Depty Leader Opposition"},
		{name:"MG", shown_name: "Member Government"},
		{name:"MO", shown_name: "Member Opposition"},
		{name:"GW", shown_name:"Government Whip"},
		{name:"OW", shown_name:"Opposition Whip"},
	];

	$scope.cancel_style_watch = $scope.$watch('participant_mgr.debate_style',function(){update_own_role_array();} );

	function update_own_role_array(){

		switch($scope.participant_mgr.debate_style){
			case "NA":
				$scope.role_obj_array = NA_team_obj;
			break;
			case "Asian":
				$scope.role_obj_array = Asian_team_obj;
			break;
			case "BP":
				$scope.role_obj_array = BP_team_obj;
			break;
		}
	}


	//var root_ref = new Firebase(MixideaSetting.firebase_url);
	var video_status_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
	var speaker_ref = video_status_ref.child("speaker");

	speaker_ref.on("value", function(snapshot){
  		var updated_speaker_obj = snapshot.val();
  		var role = null;
  		if(updated_speaker_obj){
			for(var key in updated_speaker_obj){
				var role = updated_speaker_obj[key].role;
			}
		}
		$scope.current_role = role;
		$timeout(function() {});
  	}, function(error){
  		console.log("fail while to retrieve speaker obj" + error);
  	})


	$scope.$on("$destroy", function() {
		speaker_ref.off("value");
		$scope.cancel_style_watch();
	});



  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:ParticipantTableCtrl
 * @description
 * # ParticipantTableCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('ParticipantTableParentCtrl',['$scope','MixideaSetting','ParticipantMgrService',  function ($scope, MixideaSetting, ParticipantMgrService) {


  $scope.participant_mgr = ParticipantMgrService;

  //var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.change_shown = false;
  $scope.participant_mgr = ParticipantMgrService;

 // var deb_style_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style");



  $scope.show_change_style = function(){
    $scope.change_shown = true;
  }

  $scope.change_style = function(style){
    console.log("change style clicked :  " + style);
    $scope.change_shown = false;
    $scope.participant_mgr.set_style(style);

    //deb_style_ref.set(style);
    //console.log("change style " + style);
  }

  $scope.mouseout_change_style = function(){
    remove_change_style_pain();
  }

  $scope.cancel_change_style = function(){
    remove_change_style_pain();
  }

  function remove_change_style_pain(){
    $scope.change_shown = false;
  }


  $scope.$on("$destroy", function() {
    console.log("destroy parent table is called");

  });


}]);





angular.module('angularFireHangoutApp')
  .controller('ParticipantTableChildCtrl',['$scope','ParticipantMgrService', 'MixideaSetting',function ($scope, ParticipantMgrService,MixideaSetting) {

  //var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.participant_mgr = ParticipantMgrService;
  $scope.own_user_id = MixideaSetting.own_user_id

	$scope.join = function(role_name){
    var role_participants_ref = global_firebase_root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + $scope.participant_mgr.debate_style + "/" + role_name);
    role_participants_ref.transaction(function(current_value){
      if(current_value){
        alert("someone has already take this role")
        return;
      }
      return MixideaSetting.own_user_id;
    });
	}

	$scope.cancel = function(role_name){
    remove_user(role_name);
  }

  $scope.decline = function(role_name){
    remove_user(role_name);
  }

  function remove_user(role_name){
    var role_participants_ref = global_firebase_root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + $scope.participant_mgr.debate_style + "/" + role_name);
    role_participants_ref.set(null,  function(error) {
      if (error) {
        console.log("cannot cancel" + error);
      } else {
        console.log("cancel succed");
      }
    });
  }

  $scope.$on("$destroy", function() {
    console.log("destroy child table is called");

  });




  }]);

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

/*height*/
	    var tab_layout_element = document.getElementById("container_main_right");
	    var top_position = tab_layout_element.offsetTop;
	    var parent_height = window.innerHeight;
	    var expected_height = parent_height - top_position - 10;

	    var reflec_layout_element = document.getElementById("reflec_tab_container");
	    if(reflec_layout_element){
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
	}

	set_pain_size();
	setTimeout(set_pain_size,1000);
	var reflec_layout_element = document.getElementById("reflec_tab_container");
	reflec_layout_element.addEventListener("scroll",set_pain_size);


   $scope.$on("$destroy", function() {
    	console.log("reflec tab destroy");
    	reflec_layout_element.removeEventListener("scroll",set_pain_size);
    });


  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StatusUpdateCtrl
 * @description
 * # StatusUpdateCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StatusUpdateCtrl',['$scope','MixideaSetting', function ($scope, MixideaSetting) {


  // var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  


  $scope.update_status = function(new_status){

  	if(new_status == "preparation"){
  		set_preparation_starttime();
  	}

    console.log(new_status);
    game_status_ref.set(new_status, function(error) {
	  if (error) {
	    console.log("saving status failed" + error);
	  } else {
	  }
	});

/*hangout status here*/
	if(MixideaSetting.hangout_execution){
		gapi.hangout.data.submitDelta({"game_status":new_status});
	}
/********************/


  }


  function set_preparation_starttime(){

  	var current_time = Date.now();

	  // var root_ref = new Firebase("https://mixidea.firebaseio.com/");
	  var prep_time_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/preparation_timer/")
	  prep_time_ref.set(current_time, function(error) {
	    if (error) {
	      console.log("setting time failed" + error);
	    } else {
	      console.log("set time succeed");
	    }
	  });
  }


}]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:StatusbarCtrl
 * @description
 * # StatusbarCtrl 
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StatusbarCtrl',["$scope",'StatusMgrService','$timeout', function ($scope, StatusMgrService, $timeout) {

  	$scope.status_intro = "status_bar_element";
  	$scope.status_prep = "status_bar_element";
  	$scope.status_debate = "status_bar_element";
  	$scope.status_reflec = "status_bar_element";
  	$scope.status_complete = "status_bar_element_last";
  	$scope.game_status_service = StatusMgrService;

  	$scope.cancel_status_watch = $scope.$watch('game_status_service.game_status', function(newValue, oldValue){
		$scope.status_intro = "status_bar_element";
		$scope.status_prep = "status_bar_element";
		$scope.status_debate = "status_bar_element";
		$scope.status_reflec = "status_bar_element";
		$scope.status_complete = "status_bar_element_last";

		switch(newValue){
			case "introduction":
			$scope.status_intro = "status_bar_element_selected";
			break;
			case "preparation":
			$scope.status_prep = "status_bar_element_selected";
			break;
			case "debate":
			$scope.status_debate = "status_bar_element_selected";
			break;
			case "reflection":
			$scope.status_reflec = "status_bar_element_selected";
			break;
			case "complete":
			$scope.status_complete = "status_bar_element_selected";
			break;
		}
		$timeout(function() {});
  	})

	$scope.$on("$destroy", function() {
		$scope.cancel_status_watch();
	});


  }]);

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

	$scope.cancel_group_watch = $scope.$watch('participant_mgr.own_group',function(){goto_child_state();} );
	$scope.cancel_aud_deb_watch = $scope.$watch('participant_mgr.is_audience_or_debater',function(){goto_child_state();} );

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


	$scope.$on("$destroy", function() {
		$scope.cancel_group_watch();
		$scope.cancel_aud_deb_watch();
	});


  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TitleMgrCtrl
 * @description
 * # TitleMgrCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TitleMgrCtrl',['$scope', 'MixideaSetting','$timeout','TitleService', function ($scope, MixideaSetting, $timeout, TitleService) {


  	$scope.under_edit = false;
  	$scope.dynamic_width = new Object();
  	$scope.title_data = TitleService;



	function update_input_text_width(){

		var motion_length = TitleService.motion_screen.length;
		var input_width_em = 0;
		if(motion_length > 45){
			input_width_em = 45;
		}else if (motion_length > 20){
			input_width_em = motion_length;
		}else{
			input_width_em = 20;
		}
		var motion_length_str = String(input_width_em) + "em"
		$scope.dynamic_width = {width:motion_length_str} ;	
	}

	$scope.on_motion_change = function(){
		update_input_text_width()
	}

	$scope.edit_start = function(){
		TitleService.edit_start()
		$scope.under_edit = true;
		update_input_text_width();
	}

	$scope.save = function(){

		TitleService.save();
		$scope.under_edit = false;

	}

	$scope.cancel = function(){
		TitleService.cancel();
		$scope.under_edit = false;
	}




  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:UrlSharingCtrl
 * @description
 * # UrlSharingCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('UrlSharingCtrl',['$scope','$http','MixideaSetting','$timeout', function ($scope, $http, MixideaSetting, $timeout) {


	$scope.ogp_data_array = new Array();
  $scope.url_share = null;


	// var root_ref = new Firebase(MixideaSetting.firebase_url);
	var url_ref = global_firebase_root_ref.child("event_related/url_link/" + MixideaSetting.event_id)

	url_ref.on("child_added", function(snapshot, prevChildKey) {
		var url_id = snapshot.key();
		console.log(url_id);
		retrieve_ogp_data(url_id);
	});

  $scope.input_url_Key = function(e){
    if (e.which == 13) {
      share_url();
    }
  }
  $scope.click_share = function(){
    share_url();
  }

  function share_url(){
    var str_url = $scope.str_url;
    $scope.str_url = null;
    var is_url = is_valid_Url(str_url);
    if(is_url){
      $http({
        method: 'Get',
        url: MixideaSetting.recording_domain + 'set_ogp',
        params: {
          url: str_url,
          event_id: MixideaSetting.event_id 
        }
      }).success(function(data){
        console.log('success ' + data);
      }).error(function(err){
        console.log(err);
      })
    }
  }



	function is_valid_Url(s) {
    var regexp = /((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/; 
    return s.indexOf(' ') < 0 && regexp.test(s);
}

	 

	function retrieve_ogp_data(url_id){

    var ogp_content_ref = global_firebase_root_ref.child("url_related/url/" + url_id);
    ogp_content_ref.on("value", function(snapshot) {
      var ogp_obj  = snapshot.val();

      $timeout(function() {
        $scope.ogp_data_array.push(ogp_obj)
      });

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

	}

  $scope.$on("$destroy", function() {
    url_ref.off("child_added");
  });


  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:VideodebateCtrl
 * @description
 * # VideodebateCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('VideodebateCtrl',["$scope","MixideaSetting", "ParticipantMgrService","$timeout","SoundPlayService","RecognitionService","UtilService","RecordingService","HangoutService",'$firebaseObject','SpeechStatusService',   function ($scope,MixideaSetting ,ParticipantMgrService, $timeout, SoundPlayService, RecognitionService, UtilService, RecordingService, HangoutService, $firebaseObject, SpeechStatusService) {

  	$scope.participant_mgr = ParticipantMgrService;
    $scope.own_user_id = MixideaSetting.own_user_id;
    $scope.speech_status = SpeechStatusService;

/*******ui related part****************/
  	$scope.status = "break";
  //	$scope.speaker_obj = new Object();
  	//$scope.poi_speaker_obj = new Object();
  //	$scope.poi_candidate_userobj_array = new Array();
  	$scope.timer_value = null;

    SpeechStatusService.initial_execution();



  $scope.speech_start = function(role){
    SpeechStatusService.speech_start(role);
  		
  }

  $scope.complete_speech = function(){
    SpeechStatusService.complete_speech();
    //video_status_fireobj.$remove();

  }

  $scope.$watch('speech_status.watch_counter', 
    function(){
    update_video_status();
  });


	$scope.poi = function(){
    SpeechStatusService.poi();
	}



	$scope.finish_poi = function(){
    SpeechStatusService.finish_poi();
    
	}

	$scope.cancel_poi = function(){
    SpeechStatusService.cancel_poi();
	}

	$scope.take_poi = function(user_id, group){
    SpeechStatusService.take_poi(user_id, group);
	}





  	function update_video_status(){

      if($scope.speech_status.poi_speaker_obj.id){
      //poi
        if($scope.status=="speech"){
          poi_start();
        }
        manage_speaker($scope.speech_status.poi_speaker_obj.id, "poi");
        $scope.status = "poi";

      }else if ($scope.speech_status.speaker_obj.id){
        //speech
        if($scope.status=="break"){
          speech_execution_start();
        }else if($scope.status=="poi"){
          poi_stop();
        }
        manage_speaker($scope.speech_status.speaker_obj.id, "speech");
        $scope.status = "speech";
      }else{
        //break
        if($scope.status !="break"){
          speech_execution_stop();
        }
        manage_speaker(null, "break");
        $scope.status = "break";
      }

      setTimeout(update_video_canvas_position, 100);
      setTimeout(update_video_canvas_position, 1000);
      $timeout(function() {});

  	}


    function speech_execution_start(){
      StartTimer();
      SoundPlayService.SpeechStart();
    }

    function speech_execution_stop(){
      StopTimer();
    }

    function poi_start(){
      SoundPlayService.Taken();
    }
    function poi_stop(){
      SoundPlayService.PoiFinish();
    }

/*********** video feed management *****/

/*create video dummy feed init*/
    var video_area_element = document.getElementById("video_canvas_dummy_layout");
    var video_width = video_area_element.offsetWidth;
    var ratio = HangoutService.get_video_ratio();
    var video_area_height = video_width / ratio;
    var video_area_height_val = video_area_height + "px";
    $scope.video_dumy_size = {height:video_area_height_val};

    HangoutService.set_video_width(video_width)


/*video position update*/

    function update_video_canvas_position(){

      var container_second_element = document.getElementById("container_second_top");
      var container_second_height = container_second_element.offsetHeight;

      var container_top_element = document.getElementById("container_top");
      var container_top_height = container_top_element.offsetHeight;


      var start_speech_element = document.getElementById("start_speech_container");
      var start_speech_height = start_speech_element.offsetHeight;

      var speaker_data_element = document.getElementById("speaker_data_container");
      var speaker_data_height = speaker_data_element.offsetHeight;

      var complete_button_element = document.getElementById("complete_button_container");
      var complete_button_height = complete_button_element.offsetHeight;

      var absolute_offset = complete_button_height + speaker_data_height + start_speech_height + container_top_height + container_second_height;
      HangoutService.set_video_position(0,absolute_offset);

    }

    update_video_canvas_position();
    HangoutService.set_video_visible(true);


/*******time count********/

    var timer = null;
    var speech_duration = 0;
    $scope.timer_value = null;

    function StartTimer(){

      $scope.timer_value = "speech start";
      if(!timer ){
        speech_duration = 0;
        timer = setInterval( function(){countTimer()},1000);
      }
    }
    function StopTimer(){
      speech_duration = 0;
      $timeout(function() {
        $scope.timer_value = null;
      });
      clearInterval(timer);
      timer = null;
    }

    function countTimer(){
      speech_duration++;
      var duration_mod = speech_duration % 60;
      var minutes = (speech_duration - duration_mod)/60;
      var second = duration_mod;
      var timer_str = minutes + "min " + second + "sec";

      if(minutes == 1 && second == 0|| minutes ==6 && second == 0){
        SoundPlayService.PinOne();
        console.log("one minutes");
      }else if(minutes == 7  && second == 0){

        SoundPlayService.PinTwo();
        console.log("seven minutes");
      }else if(minutes == 7  && second == 30){
        SoundPlayService.PinThree();
        console.log("seven and half minutes");
      }
      $timeout(function() {
        $scope.timer_value = timer_str;
      });
    }

/*************speaker related part****************/


    function manage_speaker(speaker_id, type){

      var deb_style = $scope.participant_mgr.debate_style;

      if(speaker_id == MixideaSetting.own_user_id){
        RecognitionService.start(deb_style, type, $scope.speech_status.speaker_obj.role  ,$scope.speech_status.speaker_obj.speech_start_time);
        RecordingService.record_start_api(type, $scope.speech_status.speaker_obj.role, $scope.speech_status.speaker_obj.speech_start_time);
        HangoutService.enable_microphone();

      }else if(speaker_id){
        RecognitionService.stop();
        RecordingService.record_finish_api("other",deb_style);
        HangoutService.disable_microphone();

      }else{
        RecognitionService.stop();
        RecordingService.record_finish_api("break",deb_style);
        HangoutService.enable_microphone();

      }
      //current_speaker_id == speaker_id;

    }


    $scope.$on("$destroy", function() {
        console.log("video scope is destroyed");
        SpeechStatusService.Finalize_Service();

/*
        speaker_ref_own.set(null);
        poi_candidate_ref_own.set(null);
        poi_taken_ref_own.set(null);
*/
/*
        poi_candidate_fireobj_own.$remove();
        poi_taken_fireobj_own.$remove();
        speaker_fireobj_own.$remove();

        speaker_fireobj.destroy();
        poi_candidate_fireobj.destroy();
        poi_taken_fireobj.destroy();
*/

/*
        speaker_ref.off("value");
        poi_candidate_ref.off("value");
        poi_taken_ref.off("value");
*/




    });



  }]);

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
      var video_width = 300;
      if(video_area_element){
       video_width = video_area_element.offsetWidth;
      }
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


'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.MixideaHangoutSetting
 * @description
 * # MixideaHangoutSetting
 * Constant in the angularFireHangoutApp.
 */

var global_own_user_id = null
var global_event_id = null;
var global_room_type = null;
var global_own_hangout_id = null;
var global_team_side  = null;
var global_own_team_side = null;
var global_firebase_root_ref = null;
//var global_audio_allowed = null;

(function () {

  var appData = gadgets.views.getParams()['appData']; 
  var appData_split = appData.split("^");
  global_own_user_id = appData_split[0];
  global_event_id = appData_split[1];
  global_room_type = appData_split[2];

  if(global_room_type == "team_discussion"){
    global_team_side = appData_split[3];
    global_own_team_side = appData_split[4];
  }

  gapi.hangout.onApiReady.add(function(e){
    if(e.isApiReady){
      global_own_hangout_id = gapi.hangout.getLocalParticipantId();
      set_mapping_data(global_own_user_id, global_own_hangout_id);
    }
  });

/*
  console.log("before executing getusermedia");
  if (!navigator.getUserMedia){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }
  if (navigator.getUserMedia) {
    console.log("initial get user media execution");
    navigator.getUserMedia(
      {audio:true},
      function(local_media_stream){
        global_audio_allowed = "accepted";
        console.log("accepted")
      },
      function(e) {
        global_audio_allowed = "denied";
        console.log("audio was denied");
      }
    );
  }else{
    global_audio_allowed = "not_supported";
    console.log("not supported")
  }

*/



}());


angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
 // 	firebase_url: "https://mixidea.firebaseio.com/",
    firebase_url: "https://mixidea-test.firebaseio.com/",
  	source_domain: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/',
  	own_user_id: global_own_user_id,
  	event_id: global_event_id,
  	room_type: global_room_type,
    hangout_appid: "211272797315",
    team_discuss_team_side: global_team_side,
    team_discuss_own_team: global_own_team_side,
    recording_domain: 'https://recording.mixidea.org:3000/',
    hangout_execution: true,
    ApiGateway_url:'https://jqiokf5mp9.execute-api.us-east-1.amazonaws.com/1/'
  });

function set_mapping_data(user_id, hangout_id)
{
  
 // var root_ref = new Firebase("https://mixidea.firebaseio.com/");
  var root_ref = new Firebase("https://mixidea-test.firebaseio.com/");
  var mapping_data_ref = root_ref.child("event_related/hangout_dynamic/" + global_event_id + "/mapping_data/" + global_own_user_id)
  mapping_data_ref.set(hangout_id, function(error) {
    if (error) {
      alert("mapping failed" + error);
    } else {
      console.log("hangout id " + hangout_id + " is set");
      console.log("with firebase user id " + user_id + " is set");
    }
  });

  mapping_data_ref.onDisconnect().remove();
}
'use strict';

/**
 * @ngdoc directive
 * @name angularFireHangoutApp.directive:oneArgument
 * @description
 * # oneArgument
 */
angular.module('angularFireHangoutApp')
  .directive('oneArgument',["$timeout","MixideaSetting","ParticipantMgrService","$sce","UtilService",  function ($timeout, MixideaSetting,ParticipantMgrService, $sce, UtilService) {
    return {
      templateUrl: $sce.trustAsResourceUrl( MixideaSetting.source_domain +'views/directive/oneArgument_directive.html'),
      restrict: 'E',
      replace: true,
      scope: {
      	argument_id_obj: '=argId'
      },
      link: function postLink(scope, element, attrs) {
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;
        scope.element = element;
        scope.participant_mgr = ParticipantMgrService;
        scope.others_writing_title = false;
        scope.others_writing_content = false;

        //var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = global_firebase_root_ref.child(argument_content_path);


        var title_ref = argument_content_ref.child("title");
        title_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.title = snapshot.val();
            update_title_height()
          });
        }); 
        function update_title_height(){
            $timeout(function(){
              var title_p_element = scope.element[0].getElementsByClassName("title_p");
              var title_p_height = title_p_element[0].offsetHeight;
              title_p_height = title_p_height + 5;
              var title_p_height_str = String(title_p_height) + "px";
              scope.title_height = {height:title_p_height_str};
            });
        }
        scope.change_title = function(){
          var title = scope.title;
          scope.title = scope.title.replace(/(\r\n|\n|\r)/gm,"");
          title_ref.set(scope.title);
        }




        var content_ref = argument_content_ref.child("content");
        content_ref.on("value", function(snapshot){
          scope.content = snapshot.val();
          scope.content_div = UtilService.add_linebreak_html(scope.content);
          update_content_height()
          $timeout(function(){});
        }); 

        function update_content_height(){
            var content_div_element = scope.element[0].getElementsByClassName("MainArg_Content");
            var content_div_height = content_div_element[0].offsetHeight;
            content_div_height = content_div_height + 15;
            content_div_height = String(content_div_height) + "px";
            scope.textearea_height = {height:content_div_height};
            $timeout(function(){});
        }

        scope.change_content = function(){
        	var content = scope.content;
          content_ref.set(content);
        }






        //var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id;
        var argument_focused_ref = global_firebase_root_ref.child(argument_focused_path);


        var title_focused_ref = argument_focused_ref.child("title");
        title_focused_ref.on("value", function(snapshot){
          
          var focused_user_obj = snapshot.val();
          scope.others_writing_title = false;
          for(var key in focused_user_obj){
            if(key != MixideaSetting.own_user_id){
              scope.others_writing_title = true;
              scope.others_id_title = key;
            }
          }
          if(scope.others_writing_title){
            scope.show_hide_title_textarea = "child_hide";
            scope.show_hide_title_content = "child_show";
          }else{
            scope.show_hide_title_textarea = "child_show";
            scope.show_hide_title_content = "child_hide";
          }
          $timeout(function(){});
        }); 
        var title_own_focused_ref = argument_focused_ref.child("title/" + MixideaSetting.own_user_id);
        scope.title_focused = function(){
          title_own_focused_ref.set(true);
        }
        scope.title_unfocused = function(){
          title_own_focused_ref.set(null);
        }
        title_own_focused_ref.onDisconnect().remove();




        var content_focused_ref = argument_focused_ref.child("content");
        content_focused_ref.on("value", function(snapshot){
          
          var focused_user_obj = snapshot.val();
          scope.others_writing_content = false;
          for(var key in focused_user_obj){
            if(key != MixideaSetting.own_user_id){
              scope.others_writing_content = true;
              scope.others_id_content = key;
            }
          }
          if(scope.others_writing_content){
            scope.show_hide_content_textarea = "child_hide";
            scope.show_hide_content_content = "child_show";
          }else{
            scope.show_hide_content_textarea = "child_show";
            scope.show_hide_content_content = "child_hide";
          }
          $timeout(function(){});
        }); 
        var content_own_focused_ref = argument_focused_ref.child("content/" + MixideaSetting.own_user_id);
        scope.content_focused = function(){
         content_own_focused_ref.set(true);
        }
        scope.content_unfocused = function(){
         content_own_focused_ref.set(null);
        }
        content_own_focused_ref.onDisconnect().remove();



        var one_argument_id_path = "event_related/Article_Context/" + event_id + "/identifier/" 
                + deb_style + "/" + team + "/arguments/" + arg_id;
        var one_argument_id_ref = global_firebase_root_ref.child(one_argument_id_path);
        scope.remove_argument = function(){
          one_argument_id_ref.set(null);
        }


        scope.$on("$destroy", function() {
            console.log("one argument destroy");
            title_own_focused_ref.set(null);
            content_own_focused_ref.set(null);

            title_ref.off("value");
            title_focused_ref.off("value");
            content_ref.off("value");
            content_focused_ref.off("value");
        });


      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name angularFireHangoutApp.directive:oneDefintro
 * @description
 * # oneDefintro
 */
angular.module('angularFireHangoutApp')
  .directive('oneDefintro',["$timeout","MixideaSetting","ParticipantMgrService","$sce","UtilService",  function ($timeout,MixideaSetting,ParticipantMgrService ,$sce, UtilService) {
    return {
      templateUrl: $sce.trustAsResourceUrl( MixideaSetting.source_domain + 'views/directive/oneDefintro_directive.html'),
      restrict: 'E',
      scope: {
      	argument_id_obj: '=argId'
      },
      link: function postLink(scope, element, attrs) {
      	
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;
        scope.element = element;
        scope.participant_mgr = ParticipantMgrService;
        scope.others_writing = false;

       // var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = global_firebase_root_ref.child(argument_content_path);

        var content_ref = argument_content_ref.child("content");
        content_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.content = snapshot.val();
            scope.content_div = UtilService.add_linebreak_html(scope.content);
          });
        }); 


        scope.change_content = function(){
        	var content = scope.content;
          content_ref.set(content);
        }


       // var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id;
        var argument_focused_ref = global_firebase_root_ref.child(argument_focused_path);

        var content_focused_ref = argument_focused_ref.child("content");
        content_focused_ref.on("value", function(snapshot){
          $timeout(function(){
            var focused_user_obj = snapshot.val();
            scope.others_writing = false;
            for(var key in focused_user_obj){
              if(key != MixideaSetting.own_user_id){
                scope.others_writing = true;
                scope.others_id = key;
              }
            }
            if(scope.others_writing){
              scope.show_hide_textarea = "child_hide";
              scope.show_hide_content = "child_show";
            }else{
              scope.show_hide_textarea = "child_show";
              scope.show_hide_content = "child_hide";
            }
          });
        }); 
        var content_own_focused_ref = argument_focused_ref.child("content/" + MixideaSetting.own_user_id);
        scope.content_focused = function(){
         content_own_focused_ref.set(true);
         console.log("content focused")
        }
        scope.content_unfocused = function(){
         console.log("content unfocused");
         content_own_focused_ref.set(null);
        }
        content_own_focused_ref.onDisconnect().remove();


        scope.$on("$destroy", function() {
            content_own_focused_ref.set(null);
            content_ref.off("value");
            content_focused_ref.off("value");
        });


      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name angularFireHangoutApp.directive:ownNote
 * @description
 * # ownNote
 */
angular.module('angularFireHangoutApp')
  .directive('ownNote',["$sce","MixideaSetting","$timeout","UtilService", function ($sce,MixideaSetting,$timeout, UtilService) {
    return {
      templateUrl: $sce.trustAsResourceUrl( MixideaSetting.source_domain + 'views/directive/ownNote_directive.html'),
      restrict: 'E',
      scope: {
      	role_object:'=roleObj'
      },
      link: function postLink(scope, element, attrs) {

        scope.shown_name = scope.role_object.shown_name;
        scope.score = null;
        scope.input_data = new Object();
        scope.input_data.type = "note";
        scope.input_data.content = null;
        scope.own_note_obj_array = new Array();
        var role_name = scope.role_object.name;


      //  var root_ref = new Firebase(MixideaSetting.firebase_url);
        var own_note_path = "event_related/own_note/" + MixideaSetting.event_id + "/" 
        				+ MixideaSetting.own_user_id + "/"
        				+ role_name;
        var own_note_ref = global_firebase_root_ref.child(own_note_path);
        var own_note_content_ref = own_note_ref.child("content");
        var own_note_score_ref = own_note_ref.child("score");

        own_note_content_ref.on("child_added", function(snapshot){
    	
        	var obj = new Object();
        	obj.id = snapshot.key();
        	obj.content = snapshot.val().content;
        	obj.counter = snapshot.val().counter;
        	obj.content_html = UtilService.add_linebreak_html(obj.content);
        	obj.type = snapshot.val().type;
        	obj.under_edit = false;
    		scope.own_note_obj_array.push(obj);
        	$timeout(function(){});
            
        })
        own_note_content_ref.on("child_changed", function(snapshot){
        	var updated_data = snapshot.val();
        	var updated_key = snapshot.key();
        	for(var i=0; i< scope.own_note_obj_array.length; i++){
        		if(scope.own_note_obj_array[i].id == updated_key){
	        			scope.own_note_obj_array[i].content = updated_data.content;
	        			scope.own_note_obj_array[i].content_html = UtilService.add_linebreak_html(updated_data.content);
	        			scope.own_note_obj_array[i].type = updated_data.type;
	        			scope.own_note_obj_array[i].counter = updated_data.counter;
	        			scope.own_note_obj_array[i].under_edit = false;
	        		
        		}
        	}
        	$timeout(function(){});
        })


        own_note_score_ref.once("value", function(snapshot){
            var score_value = snapshot.val();
            scope.score = score_value;
            $timeout(function(){});
        })


        scope.set_score = function(){
            own_note_score_ref.set(scope.score);
        }


        scope.edit_save_input = function(each_note){
        	var new_counter = 0
        	if(each_note.counter !== undefined){
        		new_counter = each_note.counter + 1;
        	}
        	var obj = {
        		content:each_note.content,
        		type: each_note.type,
        		counter: new_counter
        	}
        	var this_content_ref = own_note_content_ref.child(each_note.id);
        	this_content_ref.set(obj);
        }


        scope.save_input = function(){
        	var obj = {
        		content: scope.input_data.content,
        		type: scope.input_data.type,
        		counter: 0
        	}
        	own_note_content_ref.push(obj)

        	scope.input_data.content = null;
        	scope.input_data.type = "note";
        }

        scope.$on("$destroy", function() {
            own_note_content_ref.off("child_added");
            own_note_content_ref.off("child_changed");
        });



      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name angularFireHangoutApp.directive:writingArgument
 * @description
 * # writingArgument
 */
angular.module('angularFireHangoutApp')
  .directive('writingArgument',["$timeout","MixideaSetting","ParticipantMgrService","$sce","UtilService", function ($timeout, MixideaSetting,ParticipantMgrService, $sce, UtilService) {
    return {
      templateUrl: $sce.trustAsResourceUrl( MixideaSetting.source_domain +'views/directive/writingArgument_directive.html'),
      restrict: 'E',
      replace: true,
      scope: {
      	argument_id_obj: '=argId'
      },
      link: function postLink(scope, element, attrs) {
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;
        scope.element = element;
        scope.participant_mgr = ParticipantMgrService;


     //   var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = global_firebase_root_ref.child(argument_content_path);

/*title management*/
        var title_ref = argument_content_ref.child("title");
        title_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.title = snapshot.val();
            update_title_height()
          });
        }); 
        function update_title_height(){
            $timeout(function(){
              var title_p_element = scope.element[0].getElementsByClassName("title_p");
              var title_p_height = title_p_element[0].offsetHeight;
              title_p_height = title_p_height + 5;
              var title_p_height_str = String(title_p_height) + "px";
              scope.title_height = {height:title_p_height_str};
            });
        }
        scope.change_title = function(){
          var title = scope.title;
          scope.title = scope.title.replace(/(\r\n|\n|\r)/gm,"");
          title_ref.set(scope.title);
        }

        scope.edit_title = function(){
          title_own_focused_ref.set(true);
        }


/*content management*/
        var content_ref = argument_content_ref.child("content");
        content_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.content = snapshot.val();
            scope.content_div = UtilService.add_linebreak_html(scope.content);
            update_content_height()

          });
        }); 

        function update_content_height(){
            $timeout(function(){
              var content_div_element = scope.element[0].getElementsByClassName("MainArg_Content");
              var content_div_height = content_div_element[0].offsetHeight;
              content_div_height = content_div_height + 15;
              content_div_height = String(content_div_height) + "px";
              scope.textearea_height = {height:content_div_height};
            });
        }

        scope.change_content = function(){
        	var content = scope.content;
        	content_ref.set(content);
        }

        scope.edit_content = function(){
          content_own_focused_ref.set(true);
        }


/*refute management*/
        var refute_ref = argument_content_ref.child("refute");
        refute_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.refute = snapshot.val();
            scope.refute_div = UtilService.add_linebreak_html(scope.refute);
            update_refute_height()

          });
        }); 
        function update_refute_height(){
            $timeout(function(){
              var refute_div_element = scope.element[0].getElementsByClassName("Refute_Content");
              var refute_div_height = refute_div_element[0].offsetHeight;
              refute_div_height = refute_div_height + 15;
              refute_div_height = String(refute_div_height) + "px";
              scope.refute_height = {height:refute_div_height};
            });
        }

        scope.change_refute = function(){
          var refute = scope.refute;
          refute_ref.set(refute);
        }


/*** focus***/
        var argument_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id;
        var argument_focused_ref = global_firebase_root_ref.child(argument_focused_path);


/*title focus*/
        var title_focused_ref = argument_focused_ref.child("title");
        title_focused_ref.on("value", function(snapshot){
          $timeout(function(){
            var focused_user_obj = snapshot.val();
            scope.writing_title_bymyself = false;
            scope.writing_title_byothers = false;
            for(var key in focused_user_obj){
              if(key == MixideaSetting.own_user_id){
                scope.writing_title_bymyself = true;
              }else{
                scope.writing_title_byothers = true;
                scope.others_id_title = key;
              }
            }
            if(scope.writing_title_bymyself){
              scope.show_hide_title_textarea = "child_show";
              scope.show_hide_title_content = "child_hide";
            }else{
              scope.show_hide_title_textarea = "child_hide";
              scope.show_hide_title_content = "child_show";
            }
          });
        }); 
        var title_own_focused_ref = argument_focused_ref.child("title/" + MixideaSetting.own_user_id);

        scope.title_unfocused = function(){
          title_own_focused_ref.set(null);
        }
        scope.title_save = function(){
          title_own_focused_ref.set(null);
        }
        title_own_focused_ref.onDisconnect().remove();




/*content focus*/
        var content_focused_ref = argument_focused_ref.child("content");
        content_focused_ref.on("value", function(snapshot){
         $timeout(function(){
            var focused_user_obj = snapshot.val();
            scope.writing_content_byothers = false;
            scope.writing_content_bymyself = false;
            for(var key in focused_user_obj){
              if(key != MixideaSetting.own_user_id){
                scope.writing_content_byothers = true;
                scope.others_id_content = key;
              }else{
            	scope.writing_content_bymyself = true;
              }
            }
            if(scope.writing_content_bymyself){
              scope.show_hide_content_textarea = "child_show";
              scope.show_hide_content_content = "child_hide";
            }else{
              scope.show_hide_content_textarea = "child_hide";
              scope.show_hide_content_content = "child_show";
            }
          });
        }); 
        var content_own_focused_ref = argument_focused_ref.child("content/" + MixideaSetting.own_user_id);

        scope.content_unfocused = function(){
         content_own_focused_ref.set(null);
        }
        scope.save_content = function(){
         content_own_focused_ref.set(null);
        }
        content_own_focused_ref.onDisconnect().remove();


/*refute focus*/

        var refute_focused_ref = argument_focused_ref.child("refute");
        refute_focused_ref.on("value", function(snapshot){
         $timeout(function(){
            var focused_user_obj = snapshot.val();
            scope.writing_refute_byothers = false; 
            for(var key in focused_user_obj){
              if(key != MixideaSetting.own_user_id){
                scope.writing_refute_byothers = true;
                scope.others_id_refute = key;
              }
            }
            if(scope.writing_refute_byothers){
              scope.show_hide_refute_textarea = "child_hide";
              scope.show_hide_refute_context = "child_show";
            }else{
              scope.show_hide_refute_textarea = "child_show";
              scope.show_hide_refute_context = "child_hide";
            }
          });
        }); 
        var refute_own_focused_ref = argument_focused_ref.child("refute/" + MixideaSetting.own_user_id);

        scope.refute_unfocused = function(){
         refute_own_focused_ref.set(null);
        }

        scope.refute_focused = function(){
          refute_own_focused_ref.set(true);

        }


/*removing this argument*/

        var one_argument_id_path = "event_related/Article_Context/" + event_id + "/identifier/" 
                + deb_style + "/" + team + "/arguments/" + arg_id;
        var one_argument_id_ref = global_firebase_root_ref.child(one_argument_id_path);
        scope.remove_argument = function(){
          one_argument_id_ref.set(null);
        }

        scope.$on("$destroy", function() {
          title_ref.off("value");
          content_ref.off("value");
          refute_ref.off("value");

          title_focused_ref.off("value");
          content_focused_ref.off("value");
          refute_focused_ref.off("value");
          
          title_own_focused_ref.set(null);
          content_own_focused_ref.set(null);
          refute_own_focused_ref.set(null);
        });




      }
    };
  }]);


'use strict';

/**
 * @ngdoc directive
 * @name angularFireHangoutApp.directive:writingDefintro
 * @description
 * # writingDefintro
 */
angular.module('angularFireHangoutApp')
  .directive('writingDefintro',["$timeout","MixideaSetting","ParticipantMgrService","$sce","UtilService", function ($timeout, MixideaSetting,ParticipantMgrService, $sce, UtilService) { 
    return {
      templateUrl: $sce.trustAsResourceUrl( MixideaSetting.source_domain +'views/directive/writingDefintro_directive.html'),
	  restrict: 'E',
      replace: true,
      scope: {
      	argument_id_obj: '=argId'
      },
      link: function postLink(scope, element, attrs) {
      

        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;
        scope.element = element;
        scope.participant_mgr = ParticipantMgrService;

      //  var root_ref = new Firebase(MixideaSetting.firebase_url);
        var defintro_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id + "/" + "content";
        var defintro_content_ref = global_firebase_root_ref.child(defintro_content_path);

        defintro_content_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.defintro_content = snapshot.val();
            scope.defintro_div = UtilService.add_linebreak_html(scope.defintro_content);
            update_defintro_height()
          });
        }); 
        function update_defintro_height(){
            $timeout(function(){
              var defintro_element = scope.element[0].getElementsByClassName("defintro_Content");
              var defintro_height = defintro_element[0].offsetHeight;
              defintro_height = defintro_height + 5;
              var defintro_height_str = String(defintro_height) + "px";
              scope.defintro_height = {height:defintro_height_str};
            });
        }
        scope.change_defintro = function(){
          var defintro_content = scope.defintro_content;
          defintro_content_ref.set(defintro_content);
        }

        scope.edit_defintro = function(){
          defintro_own_focused_ref.set(true);
        }




/*** focus***/
        var defIntro_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id + "/def_intro";
        var defIntro_focused_ref = global_firebase_root_ref.child(defIntro_focused_path)

        defIntro_focused_ref.on("value", function(snapshot){
          $timeout(function(){
            var focused_user_obj = snapshot.val();
            scope.writing_bymyself = false;
            scope.writing_byothers = false;
            for(var key in focused_user_obj){
              if(key == MixideaSetting.own_user_id){
                scope.writing_bymyself = true;
              }else{
                scope.writing_byothers = true;
                scope.others_id = key;
              }
            }
            if(scope.writing_bymyself){
              scope.show_hide_textarea = "child_show";
              scope.show_hide_content = "child_hide";
            }else{
              scope.show_hide_textarea = "child_hide";
              scope.show_hide_content = "child_show";
            }
          });
        }); 
        var defintro_own_focused_ref = defIntro_focused_ref.child( MixideaSetting.own_user_id);

        scope.defintro_unfocused = function(){
         defintro_own_focused_ref.set(null);
         console.log("content unfocused");
        }
        scope.save_defintro = function(){
         defintro_own_focused_ref.set(null);
        }
        defintro_own_focused_ref.onDisconnect().remove();


        scope.$on("$destroy", function() {
          defintro_content_ref.off("value");
          defIntro_focused_ref.off("value");
          defintro_own_focused_ref.set(null);
        });

      }
    };
  }]);

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

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.ParticipantMgrService
 * @description
 * # ParticipantMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
.factory('ParticipantMgrService',['MixideaSetting','$timeout','$firebaseObject', function (MixideaSetting, $timeout, $firebaseObject) {


  var ParticipantMgr_Object = new Object();
  ParticipantMgr_Object.debate_style = null;
  var previous_debate_style_val = null;
  ParticipantMgr_Object.participant_obj = new Object();
  ParticipantMgr_Object.participant_obj_bp_open = new Object();
  ParticipantMgr_Object.participant_obj_bp_close = new Object();
  ParticipantMgr_Object.audience_array = new Array();


//public member variable 
  ParticipantMgr_Object.own_group = null;
  ParticipantMgr_Object.is_audience_or_debater = "Audience";
  ParticipantMgr_Object.own_first_name = null;
  ParticipantMgr_Object.own_last_name = null;
  ParticipantMgr_Object.all_group_name = new Array();
  ParticipantMgr_Object.own_role_array = new Array();
  ParticipantMgr_Object.all_group_name_array = new Array();
  ParticipantMgr_Object.user_object_data = new Object();

//local variable

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_role_obj_all_style = new Object();
  var full_participants_object = new Object();
  var mapping_object = new Object();
  var accumulate_mapping_object = new Object();
  var total_number_participants = 0;
  var role_group_name_mappin = new Object();
  var debate_style_fireobj = null;

//debate style


/*firebase sync*/
  var deb_style_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style")
  debate_style_fireobj = $firebaseObject(deb_style_ref);

  debate_style_fireobj.$watch(function() {
    var updated_deb_style = debate_style_fireobj.$value;
    update_debstyle(updated_deb_style);
  });
  function hangout_status_debstyle(){
    var updated_deb_style = gapi.hangout.data.getValue("deb_style"); 
    if(!updated_deb_style){
      return;
    }
    update_debstyle(updated_deb_style);
  }
  function update_debstyle(updated_deb_style){
    if(updated_deb_style !=previous_debate_style_val){
      ParticipantMgr_Object.debate_style = updated_deb_style;
      update_ParticipantMgr_Object();
      previous_debate_style_val = updated_deb_style;
    }
  }
/*hangout sync*/
  if(MixideaSetting.hangout_execution){
    gapi.hangout.onApiReady.add(function(e){
      if(e.isApiReady){
        gapi.hangout.data.onStateChanged.add(hangout_status_debstyle);
      }
    });
  }


  ParticipantMgr_Object.set_style = function(value){
    /*firebase sync*/
    debate_style_fireobj.$value = value;
    debate_style_fireobj.$save()
    /* hangout status sync*/
    gapi.hangout.data.submitDelta({"deb_style":value});
  }



// full participants

  var full_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/full")
  full_participants_ref.on("value", function(snapshot) {
    var value  = snapshot.val();
    if(value){
      full_participants_object = value;
    }else{
      full_participants_object = new Object();
    }
    retrieve_participants_all(full_participants_object);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  function retrieve_participants_all(full_participants_object){

    for(key in ParticipantMgr_Object.user_object_data){
      delete ParticipantMgr_Object.user_object_data[key]
    }
    ParticipantMgr_Object.user_object_data = null;
    ParticipantMgr_Object.user_object_data = new Object();
    total_number_participants = 0;
    for(var key in full_participants_object){
      retrieve_participant(key);
      total_number_participants++;
    }
  }


  function retrieve_participant(participant_id){
    var user_obj_ref = root_ref.child("users/user_basic/" + participant_id);
    user_obj_ref.on("value", function(snapshot) {
      var user_obj  = snapshot.val();
      var user_key = snapshot.key();
      ParticipantMgr_Object.user_object_data[user_key] = user_obj;
      var user_object_data_len = check_object_length(ParticipantMgr_Object.user_object_data);
      if(user_key == MixideaSetting.own_user_id){
        ParticipantMgr_Object.own_first_name = user_obj.first_name;
        ParticipantMgr_Object.own_last_name = user_obj.last_name;
      }
      if(user_object_data_len == total_number_participants){
        update_ParticipantMgr_Object();
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }


// mapping data




 // var root_ref = new Firebase(MixideaSetting.firebase_url);
  var mapping_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/mapping_data");
  mapping_ref.on("value", function(snapshot) {
    console.log("mapping data updated");
    var value  = snapshot.val();
    console.log(value);
    var key  = snapshot.key();
    if(value){
      mapping_object = value;
      accumulate_mapping_user();
    }else{
      mapping_object = new Object();
    }
    //check_ownexistence_addifnot();
    update_ParticipantMgr_Object();

  }, function (errorObject) {

    console.log("The read failed: " + errorObject.code);

  });

  var accumulate_mapping_user = function(){

    for(var key in mapping_object){
      accumulate_mapping_object[key] = mapping_object[key];
    }

  }


  window.addEventListener("online", 
    function(){
      console.log("online event");
      check_ownexistence_addifnot();
      setTimeout(function() {check_ownexistence_addifnot();}, 3000);
    }
  );

ParticipantMgr_Object.getUserid_fromHangoutid = function(hangout_id){
  

    for(var key in accumulate_mapping_object){
      if(hangout_id == accumulate_mapping_object[key]){
        return key;
      }
    }
}



  function check_ownexistence_addifnot(){

    var own_exist = false;
    for(var key in mapping_object){
      if(key == MixideaSetting.own_user_id){
        own_exist = true;
        return;
      }
    }
    if(!own_exist){
      var own_mapping_ref = mapping_ref.child(MixideaSetting.own_user_id);
      var own_hangout_id = global_own_hangout_id;
      if(!own_hangout_id){
        if(MixideaSetting.hangout_execution){
          own_hangout_id = gapi.hangout.getLocalParticipantId();
        }
      }
      own_mapping_ref.set(own_hangout_id);
    }
  }


  if(MixideaSetting.hangout_execution){
    gapi.hangout.onApiReady.add(function(e){
      if(e.isApiReady){
        gapi.hangout.onParticipantsChanged.add(function(participant_change) {
          check_ownexistence_addifnot()
        });
      }
    });
  }
/*
  function update_hangout_participants(){
    console.log("update_hangout_participants");
    var participant_obj_array = gapi.hangout.getParticipants();
    console.log(participant_obj_array);

    for(var key in mapping_object){
      var exist = false;
      for(var i=0; i< participant_obj_array.length; i++){
        if(mapping_object[key] == participant_obj_array[i]){
          exist = true;
          break;
        }
      }
      if(!exist){
        console.log("user" + key + "do not login within hangout" + mapping_object[key]);
        var non_exist_person_ref = mapping_ref.child(key);
        non_exist_person_ref.set(null);
      }
    }
    check_ownexistence_addifnot();
    setTimeout(function() {check_ownexistence_addifnot();}, 3000);
  }
*/

// game role

  var game_role_ref = global_firebase_root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/");
  game_role_ref.on("value", function(snapshot) {
    var value  = snapshot.val();
    if(value){
      game_role_obj_all_style = value;
    }else{
      game_role_obj_all_style = new Object()
    }
    update_ParticipantMgr_Object();

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });




  function update_ParticipantMgr_Object(){

      ParticipantMgr_Object.participant_obj = null;
      ParticipantMgr_Object.participant_obj = new Object();
      ParticipantMgr_Object.participant_obj_bp_open = null;
      ParticipantMgr_Object.participant_obj_bp_open = new Object();
      ParticipantMgr_Object.participant_obj_bp_close = null;
      ParticipantMgr_Object.participant_obj_bp_close = new Object();
      var no_applicant_img = MixideaSetting.source_domain + "images/want_you.png";
      switch(ParticipantMgr_Object.debate_style){
        case "NA":
          ParticipantMgr_Object.participant_obj = {
            PM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Gov',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            MG:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Gov',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            MO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            PMR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Gov',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LOR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            }
          }
          var game_role_obj = game_role_obj_all_style.NA
          if(!game_role_obj){
            game_role_obj = new Object()
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;
        case "Asian":
          ParticipantMgr_Object.participant_obj = {
            PM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              side:'right',
              group_id:1,
              login:false,
              css_style:"participant_box_default"
            },
            DPM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            DLO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            GW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            OW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            },
            PMR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Prop',
              group_id:0,
              side:'left',
              login:false,
              css_style:"participant_box_default"
            },
            LOR:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'Opp',
              group_id:1,
              side:'right',
              login:false,
              css_style:"participant_box_default"
            }
          }
          var game_role_obj = game_role_obj_all_style.Asian
          if(!game_role_obj){
            game_role_obj = new Object()
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;
        case "BP":

          ParticipantMgr_Object.participant_obj = {
            PM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OG',
              group_id:0,
              side:'left',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            LO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OO',
              group_id:1,
              side:'right',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            DPM:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OG',
              group_id:0,
              side:'left',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            DLO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'OO',
              group_id:1,
              side:'right',
              part:'Opening',
              login:false,
              css_style:"participant_box_default"
            },
            MG:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CG',
              group_id:2,
              side:'left',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            },
            MO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CO',
              group_id:3,
              side:'right',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            },
            GW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CG',
              group_id:2,
              side:'left',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            },
            OW:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              group:'CO',
              group_id:3,
              side:'right',
              part:'Closing',
              login:false,
              css_style:"participant_box_default"
            }
          }
          var game_role_obj = game_role_obj_all_style.BP;
          if(!game_role_obj){
            game_role_obj = new Object()
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;

        default:
          return;
        break;
      }
      for( var userid_key in full_participants_object){
        var have_role = false;
        for(var role_key in game_role_obj){
          if(userid_key == game_role_obj[role_key]){
            have_role = true;
            break;
          }
        }
        if(!have_role){
          var audience_obj = {
              applicant:true,
              id:userid_key,
              group:'Aud',
              login:false,
              css_style:"participant_box_default"
          }
          ParticipantMgr_Object.audience_array.push(audience_obj);        
        }
      }

      for(var role_key in game_role_obj){
        ParticipantMgr_Object.participant_obj[role_key].id = game_role_obj[role_key];
        ParticipantMgr_Object.participant_obj[role_key].applicant = true;
      }

      for( var role_key in ParticipantMgr_Object.participant_obj){

        var user_id = ParticipantMgr_Object.participant_obj[role_key].id;
        if(ParticipantMgr_Object.user_object_data[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].user_name = ParticipantMgr_Object.user_object_data[user_id].first_name;
          ParticipantMgr_Object.participant_obj[role_key].profile_pict = ParticipantMgr_Object.user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].css_style = "participant_box_login";
          ParticipantMgr_Object.participant_obj[role_key].login = true;
        }
      }
      for( var i=0; i< ParticipantMgr_Object.audience_array.length; i++ ){

        var user_id =  ParticipantMgr_Object.audience_array[i].id;
        if(ParticipantMgr_Object.user_object_data[user_id]){
          ParticipantMgr_Object.audience_array[i].user_name = ParticipantMgr_Object.user_object_data[user_id].first_name;
          ParticipantMgr_Object.audience_array[i].profile_pict = ParticipantMgr_Object.user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.audience_array[i].applicant = true;
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.audience_array[i].css_style = "participant_box_login";
        }
      }
      if(ParticipantMgr_Object.debate_style == "BP"){
        adopt_ParticipantObj_BP();
      }
      update_member_variable();
      $timeout(function() {});
  }

  function adopt_ParticipantObj_BP(){

    for(var key in ParticipantMgr_Object.participant_obj_bp_open){
      delete ParticipantMgr_Object.participant_obj_bp_open[key];
    }
    for(var key in ParticipantMgr_Object.participant_obj_bp_close){
      delete ParticipantMgr_Object.participant_obj_bp_close[key];
    }

    for( var role_key in ParticipantMgr_Object.participant_obj){
      if(ParticipantMgr_Object.participant_obj[role_key].part == "Opening"){
        ParticipantMgr_Object.participant_obj_bp_open[role_key] = ParticipantMgr_Object.participant_obj[role_key];
      }
      if(ParticipantMgr_Object.participant_obj[role_key].part == "Closing"){
        ParticipantMgr_Object.participant_obj_bp_close[role_key] = ParticipantMgr_Object.participant_obj[role_key];
      }
    }
  }


  function update_member_variable(){

      switch(ParticipantMgr_Object.debate_style){
        case "NA":
          ParticipantMgr_Object.all_group_name_array = ["Gov","Opp"];
          ParticipantMgr_Object.all_group_id = [0,1];
        break;
        case "Asian":
          ParticipantMgr_Object.all_group_name_array = ["Prop","Opp"];
          ParticipantMgr_Object.all_group_id = [0,1];
        break;
        case "BP":
          ParticipantMgr_Object.all_group_name_array = ["OG","OO","CG","CO"];
          ParticipantMgr_Object.all_group_id = [0,1,2,3];
        break;
      }

      ParticipantMgr_Object.own_role_array.length=0;
      ParticipantMgr_Object.own_group = "Audience"
      ParticipantMgr_Object.is_audience_or_debater = "Audience";
      ParticipantMgr_Object.own_side = "Audience";


      ParticipantMgr_Object.own_group_id = null;

      for( var role_key in ParticipantMgr_Object.participant_obj){
        if(ParticipantMgr_Object.participant_obj[role_key].id == MixideaSetting.own_user_id){
          ParticipantMgr_Object.own_role_array.push(role_key);
          ParticipantMgr_Object.own_group = ParticipantMgr_Object.participant_obj[role_key].group;
          ParticipantMgr_Object.own_group_id = ParticipantMgr_Object.participant_obj[role_key].group_id;
          ParticipantMgr_Object.is_audience_or_debater = "debater";
          ParticipantMgr_Object.own_side = ParticipantMgr_Object.participant_obj[role_key].side;
        }
      }

  }



  function check_object_length(obj){
    var len = 0;
    for(var key in obj){
      len++
    }
    return len;
  }


    return ParticipantMgr_Object;
}]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.RecognitionService
 * @description
 * # RecognitionService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('RecognitionService',["MixideaSetting", function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var under_recording = false;
    var available=true;
    var short_split_id_value=null;
    //var root_ref = new Firebase(MixideaSetting.firebase_url);
    var transcription_ref = null;
    var speech_type=null;
    var speech_start_time = 0;
    var recognition = null;

    function recognition_initialization(){

    	if(!window.webkitSpeechRecognition){
    		available = false;
    		return;
    	}
    	recognition = new webkitSpeechRecognition();
    	recognition.continuous = true;
    	recognition.lang = "en-US";  /*should use mixidea setting*/

    	recognition.onresult = function(e){
    		var results = e.results;
    		for(var i = e.resultIndex; i<results.length; i++){
    			if(results[i].isFinal){
    				StoreData(results[i][0].transcript);
    			}
    		}
    	};

    }

    this.start = function(deb_style, type, speaker_role, time_value){
    	if(!available){
    		return;
    	}
    	speech_start_time = time_value;
      	short_split_id_value = Date.now();
    	
    	speech_type = type;
    	transcription_ref = global_firebase_root_ref.child("event_related/audio_transcript/" + 
    						MixideaSetting.event_id + "/" + deb_style + "/" + speaker_role + 
    						"/" + String(speech_start_time) + "/spech_context/" + short_split_id_value);

        //set user data and speech type to short split context
        var speech_initial_obj = {
            user: MixideaSetting.own_user_id,
            type: speech_type
        }
        transcription_ref.update(speech_initial_obj);


    	if(under_recording){
    		return;
    	}else{
            console.log("--recognition start--")
    		recognition.start();
    		under_recording = true;
    	}

    }

    this.stop = function(){
    	if(!available || !under_recording){
    		return;
    	}
        setTimeout(function(){
            console.log("--recognition stop--");
            recognition.stop();
            under_recording = false;
        },1000);
    }

    function StoreData(text){
    	console.log(text);
        var current_time_value = Date.now();	
    	var audio_time =  current_time_value - speech_start_time;
        var transcription_context_ref = transcription_ref.child("context");
    	var speech_obj = new Object();
        speech_obj[audio_time]=text
    	transcription_context_ref.update(speech_obj);
    }

    // it might be better to save it with audio_time as a key and rest are the values
    //so it is ordered by the audio time order

    recognition_initialization();

  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.RecordingService
 * @description
 * # RecordingService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('RecordingService',['MixideaSetting','SocketStreamsService', function (MixideaSetting, SocketStreamsService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	var audio_available = false;
	var stored_speech_id = null;
	var context = null;
	var sample_rate_value = null;
	var scriptNode = null;
    var under_recording = false;
    var stored_speaker_role_name = null;

    this.record_start_api = function(type, speaker_role_name, speech_id){

		if(!audio_available || !SocketStreamsService.socket_available){
			return;
		}
		stored_speaker_role_name = speaker_role_name;

		under_recording = true;
		var file_name = MixideaSetting.event_id + "_" + stored_speaker_role_name + "_" + speech_id;
		switch(type){
			case "speech":
				if(stored_speech_id == speech_id){
					SocketStreamsService.resume_record(file_name);
				}else{
					SocketStreamsService.start_record(file_name, sample_rate_value);
				}
			break;
			case "poi":
				SocketStreamsService.resume_record(file_name, sample_rate_value);
			break;
		}
		stored_speech_id = speech_id;

    }

    this.record_finish_api = function(type,deb_style){
		if(!audio_available || !SocketStreamsService.socket_available || !under_recording){
			return;
		}
		under_recording = false;
		
		var file_name = MixideaSetting.event_id + "_" + stored_speaker_role_name + "_" + stored_speech_id;
		switch(type){
			case "break":
				SocketStreamsService.stop_record_save(file_name,deb_style, stored_speaker_role_name, stored_speech_id);
			break;
			case "other":
				SocketStreamsService.suspend_record(file_name);
			break;
		}
    }



    function recording_initialize(){
		if (!navigator.getUserMedia){
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia || navigator.msGetUserMedia;
		}

		if (navigator.getUserMedia) {
			console.log("get user media");
			navigator.getUserMedia(
				{audio:true},
				function(local_media_stream){
					audio_available = true;
					console.log("audio is a vailable by user concensus");
					//sockt_initialize();
				 	start_audio_polling(local_media_stream);
				},
				function(e) {
					console.log('using audio is blocked by user'); 
				} );
		} else{
			console.log('getUserMedia not supported');
		}

    }


    function start_audio_polling(local_media_stream){
		var audioContext = window.AudioContext || window.webkitAudioContext;
		context = new audioContext();
		sample_rate_value = context.sampleRate;
		var audioInput = context.createMediaStreamSource(local_media_stream);
		var bufferSize = 4096;
		
		scriptNode = context.createScriptProcessor(bufferSize, 1, 1);
		audioInput.connect(scriptNode)
		scriptNode.connect(context.destination); 

		scriptNode.onaudioprocess = function(audioProcessingEvent){
		  if(!under_recording ){
		   return;
		  }
		  var left = audioProcessingEvent.inputBuffer.getChannelData(0);
		  var audio_array_buffer = convertoFloat32ToInt16(left);
		  SocketStreamsService.stream_record_process(audio_array_buffer);

		  //var stream_buffer = new ss.Buffer(audio_array_buffer);
		  //stream.write(stream_buffer, 'buffer');
		}
    }

    function finish_audio_polling(){
	  scriptNode.disconnect(context.destination);
	  context.close();
	  context = null;
    }


	function convertoFloat32ToInt16(buffer) {
	  var len = buffer.length;

	  var double_len = len*2;
	  var unit8_buf = new Uint8Array(double_len);
	  var int16_variable = new Int16Array(1);
	  for (var i=0; i< len; i++) {
	    int16_variable[0] = buffer[i]*0x7FFF;    //convert to 16 bit PCM
	    unit8_buf[2*i] = int16_variable[0] & 0x00FF; //convert to uint8 for stream buffer
	    unit8_buf[2*i+1] = (int16_variable[0] & 0xFF00) >> 8;
	  }
	  return unit8_buf.buffer
	}

	// initial execution

	recording_initialize();

  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.SocketStreamsService
 * @description
 * # SocketStreamsService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('SocketStreamsService',['MixideaSetting', function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var SocketStream_Object = new Object();

	SocketStream_Object.socket_available = false;
	var socket_io = null;
	var stream = null;
	var a = "c";

    function sockt_initialize(){

		socket_io = io.connect(MixideaSetting.recording_domain);

		socket_io.on('connect', function(){
			console.log("connect socket id=" + socket_io.id);
			SocketStream_Object.socket_available = true;
			socket_io.emit('join_room', {'room_name':MixideaSetting.event_id});
			socket_io.on('audio_saved', function(data){
				console.log('record complete ' + data.file_saved);
			});
			
			socket_io.on('disconnect', function(){
				console.log('disconnected');
				SocketStream_Object.socket_available = false;
				if(stream){
					console.log("disconnected");
				//	under_recording = false;
					stream.end();
					stream = null;
				}
			});
		});
    }


    SocketStream_Object.start_record = function(in_file_name, sample_rate_value){
		if(!this.socket_available ){
			return;
		}

		if(!stream){
			console.log(" start record socket id=" + socket_io.id);
			stream = ss.createStream();
			console.log("audio polling stream id " + stream.id);
			var start_emit_obj = {filename:in_file_name,sample_rate:sample_rate_value};
			console.log(start_emit_obj);
			ss(socket_io).emit('audio_record_start', stream, start_emit_obj );
		}else{
			console.log("recording is already on going");
		}
    }


    SocketStream_Object.suspend_record = function(in_file_name){
		if(!this.socket_available){
			return;
		}
		console.log("suspend recording");
		if(stream){
			stream.end();
			stream = null;
			socket_io.emit('audio_record_suspend', {filename:in_file_name});
		} 	
    }



    SocketStream_Object.resume_record = function(in_file_name, sample_rate_value){

		if(!this.socket_available ){
			return;
		}

		if(!stream){
			console.log("resume recording");
			stream = ss.createStream();
			console.log("audio polling stream id " + stream.id)
			ss(socket_io).emit('audio_record_resume', stream, {filename:in_file_name,sample_rate:sample_rate_value} );
		}else{
			console.log("recording is already on going");
		}
    }


    SocketStream_Object.stop_record_save = function(in_file_name,deb_style_val, in_role_name, speech_id_val){

		var self = this;
		if(!this.socket_available ){
			return;
		}
		if(stream){
			console.log("stop record socket id=" + socket_io.id);
			stream.end();
			stream = null;
			var room_name_val = MixideaSetting.event_id;
			var stop_emit_obj = {filename:in_file_name,deb_style: deb_style_val, role_name: in_role_name, room_name: room_name_val, speech_id: speech_id_val }
			console.log(stop_emit_obj);
			socket_io.emit('audio_record_end', stop_emit_obj);
		}
    }


    SocketStream_Object.stream_record_process = function(audio_array_buffer){
    	if(!stream){
    		return
    	}
		var stream_buffer = new ss.Buffer(audio_array_buffer);
		stream.write(stream_buffer, 'buffer');
    }


    sockt_initialize();

    return SocketStream_Object;

  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.SoundPlayService
 * @description
 * # SoundPlayService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('SoundPlayService',['MixideaSetting', function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function


	this.Poi = function(){
		if(!sound_mgr.PinOne_sound){
			return;
		}
		sound_mgr.Poi_sound.start(0);
		sound_mgr.Poi_sound = audio_context.createBufferSource();
		sound_mgr.Poi_sound.buffer = sound_mgr.Poi_sound_persisted_buffer;
		sound_mgr.Poi_sound.connect(audio_context.destination);
		console.log("sound:::::poi");
	}

	this.HearHear = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.HearHear_sound.start(0);
		sound_mgr.HearHear_sound = audio_context.createBufferSource();
		sound_mgr.HearHear_sound.buffer = sound_mgr.HearHear_sound_persisted_buffer;
		sound_mgr.HearHear_sound.connect(audio_context.destination);
		console.log("sound:::::hearhear");
	}
	this.BooBoo = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.BooBoo_sound.start(0);
		sound_mgr.BooBoo_sound = audio_context.createBufferSource();
		sound_mgr.BooBoo_sound.buffer = sound_mgr.BooBoo_sound_persisted_buffer;
		sound_mgr.BooBoo_sound.connect(audio_context.destination);
		console.log("sound:::::booboo");
	}
	this.Taken = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.Taken_sound.start(0);
		sound_mgr.Taken_sound = audio_context.createBufferSource();
		sound_mgr.Taken_sound.buffer = sound_mgr.Taken_sound_persisted_buffer;
		sound_mgr.Taken_sound.connect(audio_context.destination);
		console.log("sound:::::taken");
	}
	this.PoiFinish = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PoiFinish_sound.start(0);
		sound_mgr.PoiFinish_sound = audio_context.createBufferSource();
		sound_mgr.PoiFinish_sound.buffer = sound_mgr.PoiFinish_sound_persisted_buffer;
		sound_mgr.PoiFinish_sound.connect(audio_context.destination);
		console.log("sound:::::poi finish");
	}
	this.PinOne = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PinOne_sound.start(0);
		sound_mgr.PinOne_sound = audio_context.createBufferSource();
		sound_mgr.PinOne_sound.buffer = sound_mgr.PinOne_sound_persisted_buffer;
		sound_mgr.PinOne_sound.connect(audio_context.destination);
		console.log("sound:::::poi one");
	}
	this.PinTwo = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PinTwo_sound.start(0);
		sound_mgr.PinTwo_sound = audio_context.createBufferSource();
		sound_mgr.PinTwo_sound.buffer = sound_mgr.PinTwo_sound_persisted_buffer;
		sound_mgr.PinTwo_sound.connect(audio_context.destination);
		console.log("sound:::::poi two");
	}
	this.PinThree = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PinThree_sound.start(0);
		sound_mgr.PinThree_sound = audio_context.createBufferSource();
		sound_mgr.PinThree_sound.buffer = sound_mgr.PinThree_sound_persisted_buffer;
		sound_mgr.PinThree_sound.connect(audio_context.destination);
		console.log("sound:::::poi three");
	}
	this.Cursol = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.Cursol_sound.start(0);
		sound_mgr.Cursol_sound = audio_context.createBufferSource();
		sound_mgr.Cursol_sound.buffer = sound_mgr.Cursol_sound_persisted_buffer;
		sound_mgr.Cursol_sound.connect(audio_context.destination);
		console.log("sound:::::cursol");
	}

	this.SpeechStart = function(){
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.SpeechStart_sound.start(0);
		sound_mgr.SpeechStart_sound = audio_context.createBufferSource();
		sound_mgr.SpeechStart_sound.buffer = sound_mgr.SpeechStart_sound_persisted_buffer;
		sound_mgr.SpeechStart_sound.connect(audio_context.destination);
		console.log("sound:::::speech start");
	}


	function BufferLoader(context, urlList, callback) {
	  this.context = context;
	  this.urlList = urlList;
	  this.onload = callback;
	  this.bufferList = new Array();
	  this.loadCount = 0;
	}

	BufferLoader.prototype.loadBuffer = function(url, index) {
	  // Load buffer asynchronously
	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	  request.responseType = "arraybuffer";

	  var loader = this;

	  request.onload = function() {
	    // Asynchronously decode the audio file data in request.response
	    loader.context.decodeAudioData(
	      request.response,
	      function(buffer) {
	        if (!buffer) {
	          alert('error decoding file data: ' + url);
	          return;
	        }
	        loader.bufferList[index] = buffer;
	        if (++loader.loadCount == loader.urlList.length)
	          loader.onload(loader.bufferList);
	      },
	      function(error) {
	        console.error('decodeAudioData error', error);
	      }
	    );
	  }

	  request.onerror = function() {
	    alert('BufferLoader: XHR error');
	  }

	  request.send();
	};

	BufferLoader.prototype.load = function() {
	  for (var i = 0; i < this.urlList.length; ++i)
	  this.loadBuffer(this.urlList[i], i);
	};



	var bufferLoader = null;
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var audio_context = new AudioContext();
	var sound_mgr = new Object();
	loadSounds();

	function loadSounds(obj, soundMap) {

	  bufferLoader = new BufferLoader(
	  	audio_context,
	    [
	    MixideaSetting.source_domain + 'audio/pointofinformation.mp3',
	    MixideaSetting.source_domain + 'audio/hearhear.mp3',
	    MixideaSetting.source_domain + 'audio/shame.mp3',
	    MixideaSetting.source_domain + 'audio/taken.mp3',
	    MixideaSetting.source_domain + 'audio/gobacktospeaker.mp3',
	    MixideaSetting.source_domain + 'audio/OnePin.mp3',
	    MixideaSetting.source_domain + 'audio/TwoPin.mp3',
	    MixideaSetting.source_domain + 'audio/ThreePin.mp3',
	    MixideaSetting.source_domain + 'audio/cursor1.mp3',
	    MixideaSetting.source_domain + 'audio/speech_start.mp3',
	     ],
	    finishedLoading
	  );
	  bufferLoader.load();
	}

	function finishedLoading(bufferList){
		sound_mgr.Poi_sound = audio_context.createBufferSource();
		sound_mgr.Poi_sound.buffer = bufferList[0];
		sound_mgr.Poi_sound_persisted_buffer = bufferList[0];
		sound_mgr.Poi_sound.connect(audio_context.destination);

		sound_mgr.HearHear_sound = audio_context.createBufferSource();
		sound_mgr.HearHear_sound.buffer = bufferList[1];
		sound_mgr.HearHear_sound_persisted_buffer = bufferList[1];
		sound_mgr.HearHear_sound.connect(audio_context.destination);

		sound_mgr.BooBoo_sound = audio_context.createBufferSource();
		sound_mgr.BooBoo_sound.buffer = bufferList[2];
		sound_mgr.BooBoo_sound_persisted_buffer = bufferList[2];
		sound_mgr.BooBoo_sound.connect(audio_context.destination);

		sound_mgr.Taken_sound = audio_context.createBufferSource();
		sound_mgr.Taken_sound.buffer = bufferList[3];
		sound_mgr.Taken_sound_persisted_buffer = bufferList[3];
		sound_mgr.Taken_sound.connect(audio_context.destination);

		sound_mgr.PoiFinish_sound = audio_context.createBufferSource();
		sound_mgr.PoiFinish_sound.buffer = bufferList[4];
		sound_mgr.PoiFinish_sound_persisted_buffer = bufferList[4];
		sound_mgr.PoiFinish_sound.connect(audio_context.destination);

		sound_mgr.PinOne_sound = audio_context.createBufferSource();
		sound_mgr.PinOne_sound.buffer = bufferList[5];
		sound_mgr.PinOne_sound_persisted_buffer = bufferList[5];
		sound_mgr.PinOne_sound.connect(audio_context.destination);

		sound_mgr.PinTwo_sound = audio_context.createBufferSource();
		sound_mgr.PinTwo_sound.buffer = bufferList[6];
		sound_mgr.PinTwo_sound_persisted_buffer = bufferList[6];
		sound_mgr.PinTwo_sound.connect(audio_context.destination);

		sound_mgr.PinThree_sound = audio_context.createBufferSource();
		sound_mgr.PinThree_sound.buffer = bufferList[7];
		sound_mgr.PinThree_sound_persisted_buffer = bufferList[7];
		sound_mgr.PinThree_sound.connect(audio_context.destination);

		sound_mgr.Cursol_sound = audio_context.createBufferSource();
		sound_mgr.Cursol_sound.buffer = bufferList[8];
		sound_mgr.Cursol_sound_persisted_buffer = bufferList[8];
		sound_mgr.Cursol_sound.connect(audio_context.destination);

		sound_mgr.SpeechStart_sound = audio_context.createBufferSource();
		sound_mgr.SpeechStart_sound.buffer = bufferList[9];
		sound_mgr.SpeechStart_sound_persisted_buffer = bufferList[9];
		sound_mgr.SpeechStart_sound.connect(audio_context.destination);
	}
}]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.SpeechStatusService
 * @description
 * # SpeechStatusService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('SpeechStatusService',['MixideaSetting', '$firebaseObject','ParticipantMgrService','UtilService','$timeout','SoundPlayService', function (MixideaSetting,$firebaseObject, ParticipantMgrService, UtilService, $timeout, SoundPlayService) {


  var SpeechStatus_object = new Object();
  SpeechStatus_object.speaker_obj = new Object();
  SpeechStatus_object.poi_speaker_obj = new Object();
 // SpeechStatus_object.current_speaker = null
  SpeechStatus_object.speaker_obj.speech_start_time = 0;
  SpeechStatus_object.watch_counter = 0;
  SpeechStatus_object.poi_candidate_userobj_array = new Array();

  var video_status_ref = global_firebase_root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
  var video_status_fireobj = $firebaseObject(video_status_ref);
  var speaker_ref = video_status_ref.child("speaker");
  var speaker_fireobj = $firebaseObject(speaker_ref);

  var speaker_ref_own = video_status_ref.child("speaker/" + MixideaSetting.own_user_id);
  var speaker_fireobj_own = $firebaseObject(speaker_ref_own);


  var poi_ref = video_status_ref.child("poi");
  var poi_fireobj = $firebaseObject(poi_ref);

  var poi_candidate_ref = video_status_ref.child("poi/candidate");
  var poi_candidate_fireobj = $firebaseObject(poi_candidate_ref);

  var poi_candidate_ref_own = video_status_ref.child("poi/candidate/" + MixideaSetting.own_user_id);
  var poi_candidate_fireobj_own = $firebaseObject(poi_candidate_ref_own);

  var poi_taken_ref = video_status_ref.child("poi/taken");
  var poi_taken_fireobj = $firebaseObject(poi_taken_ref);
  var poi_taken_ref_own = video_status_ref.child("poi/taken/" + MixideaSetting.own_user_id);
  var poi_taken_fireobj_own = $firebaseObject(poi_taken_ref_own);

  var poitaken_fireobj_unwatch = null;
  var speaker_fireobj_unwatch = null;

  SpeechStatus_object.initial_execution = function(){


    // in case of hangout both firebase and hangout synchronization execute
    // update_syncdata_XXX function filter
    
    if(MixideaSetting.hangout_execution){
      gapi.hangout.onApiReady.add(function(e){
        if(e.isApiReady){
 
          gapi.hangout.data.onStateChanged.add(hangout_status_speaker);
          gapi.hangout.data.onStateChanged.add(hangout_status_poitaken);
          gapi.hangout.data.onStateChanged.add(hangout_status_poitcandidate);          
          gapi.hangout.onParticipantsRemoved.add(hangout_participant_removed);
          hangout_status_speaker();
          hangout_status_poitaken();
        }
      });
    }

    speaker_fireobj_unwatch =  speaker_fireobj.$watch(function(){
      var speaker_obj = speaker_fireobj;
      var keys = Object.keys(speaker_obj);
      var filtered_key = keys.filter(function(element){return (element.charAt(0) !="$");});
      var obj = new Object();
      if(filtered_key.length > 0){
        obj[filtered_key] = speaker_fireobj[filtered_key];
      }
      update_syncdata_speaker(obj);
    });

    poitaken_fireobj_unwatch = poi_taken_fireobj.$watch(function() {

      var poi_taken_obj = poi_taken_fireobj;
      var keys = Object.keys(poi_taken_obj);
      var filtered_key = keys.filter(function(element){return (element.charAt(0) !="$");});
      var obj = new Object();
      if(filtered_key.length > 0){
        obj[filtered_key] = poi_taken_obj[filtered_key];
      }
      update_syncdata_poi_taken(obj);
    });

  }

/*disconnection is only catched by hangout api
  It can be also ditected by firebase but 
   the firebase disconnection is triggered by the person who is disconnected
  it lead to the mismatch between other user and the person who is disconnected
  because sometimes that is triggered to only the person who is disconnected but
   not triggered to others and only the person who is disconnected have different status
   That is why this management is done only by hangout api.
   
*/
  var hangout_participant_removed = function(Removed_obj){

    var removed_participants_array = Removed_obj.removedParticipants;

    for(var i=0; i< removed_participants_array.length; i++){
      var hangout_id = removed_participants_array[i].id
      var removed_user_id = ParticipantMgrService.getUserid_fromHangoutid(hangout_id);
      if(removed_user_id){
        if(SpeechStatus_object.speaker_obj && (removed_user_id == SpeechStatus_object.speaker_obj.id)){
          SpeechStatus_object.Clear_AllSpeechData();

        }else if(SpeechStatus_object.poi_speaker_obj && (removed_user_id == SpeechStatus_object.poi_speaker_obj.id)){
          SpeechStatus_object.finish_poi();
        }else if(SpeechStatus_object.poi_candidate_userobj_array != 0){
          // poi user related part
          remove_poi_candidate(removed_user_id);
        }
      }
    }
  }


  var hangout_status_speaker = function(){

    var speaker_status_str = gapi.hangout.data.getValue("speaker_status");
    console.log("hangout speaker status" + speaker_status_str);
    var speaker_obj = new Object();

    if(speaker_status_str){
      speaker_obj = JSON.parse(speaker_status_str);
    }
    update_syncdata_speaker(speaker_obj);

  }


  var update_syncdata_speaker = function(updated_speaker_obj){

      var speaker_changed = false;
      var key = Object.keys(updated_speaker_obj)[0];

      if(!key){
        if(SpeechStatus_object.speaker_obj.id){
          speaker_changed = true;
        }
        for(var key in SpeechStatus_object.speaker_obj){
          delete SpeechStatus_object.speaker_obj[key]
        }
        //SpeechStatus_object.current_speaker = null;
        SpeechStatus_object.speaker_obj.speech_start_time = 0;
      }else{
        if(SpeechStatus_object.speaker_obj.id != key){
          SpeechStatus_object.speaker_obj.id = key;
          SpeechStatus_object.speaker_obj.name = updated_speaker_obj[key].name;
          SpeechStatus_object.speaker_obj.role = updated_speaker_obj[key].role;
          //SpeechStatus_object.current_speaker = updated_speaker_obj[key].role;
          SpeechStatus_object.speaker_obj.side = updated_speaker_obj[key].side;
          SpeechStatus_object.speaker_obj.full_role_name = updated_speaker_obj[key].full_role_name;
          SpeechStatus_object.speaker_obj.speech_start_time = updated_speaker_obj[key].speech_start_time;
          speaker_changed = true;
        }
      }
      if(speaker_changed){
        SpeechStatus_object.watch_counter++; 
        $timeout(function() {});
      }
  }



  SpeechStatus_object.speech_start = function(role){
      var own_side = ParticipantMgrService.own_side;
      var own_name = ParticipantMgrService.own_first_name;
      var full_role_name = UtilService.get_full_role_name(role);
      var speech_start_time_value = Date.now();

      var speaker_obj = {
        role: role,
        name:own_name,
        side: own_side,
        full_role_name: full_role_name,
        speech_start_time: speech_start_time_value
      }

      if(MixideaSetting.hangout_execution){
        var own_speaker_obj = new Object();
        own_speaker_obj[MixideaSetting.own_user_id] = speaker_obj;
        var own_speaker_str = JSON.stringify(own_speaker_obj);
        gapi.hangout.data.submitDelta({"speaker_status":own_speaker_str});
      }
      speaker_fireobj[MixideaSetting.own_user_id] = speaker_obj;
      speaker_fireobj.$save();
      //speaker_ref_own.onDisconnect().set(null);   
  }



  SpeechStatus_object.complete_speech = function(){

      if(MixideaSetting.hangout_execution){
        gapi.hangout.data.clearValue("speaker_status");
        gapi.hangout.data.clearValue("poi_taken");
        gapi.hangout.data.clearValue("poi_candidate");
      }
      speaker_fireobj.$remove();
      poi_taken_fireobj.$remove();
      poi_candidate_fireobj.$remove();
  }


/**/




  SpeechStatus_object.poi = function(){

    var own_group = ParticipantMgrService.own_group;
    poi_candidate_fireobj_own.$value = own_group;
    poi_candidate_fireobj_own.$save();
    //poi_candidate_ref_own.onDisconnect().set(null);
    //poi_taken_ref_own.onDisconnect().set(null);

    if(MixideaSetting.hangout_execution){

      var poi_candidate_str = gapi.hangout.data.getValue("poi_candidate");
      var poi_candidate_obj = new Object();
      if(poi_candidate_str){
        poi_candidate_obj = JSON.parse(poi_candidate_str);
      }
      poi_candidate_obj[MixideaSetting.own_user_id] = own_group;
      var poi_candidate_str = JSON.stringify(poi_candidate_obj);
      gapi.hangout.data.submitDelta({"poi_candidate":poi_candidate_str});

    }

  }


  var hangout_status_poitcandidate = function(){

    var poi_candidate_str = gapi.hangout.data.getValue("poi_candidate");
    var poi_candidate_obj = new Object();
    if(poi_candidate_str){
      poi_candidate_obj = JSON.parse(poi_candidate_str);
    }
    update_syncdata_poi_candidate(poi_candidate_obj);
  }


  poi_candidate_ref.on("value", function(snapshot){
    var poi_candidate_obj = snapshot.val();
    update_syncdata_poi_candidate(poi_candidate_obj);

  });

  var update_syncdata_poi_candidate = function(poi_candidate_obj){

    var update_exist = false;

    // add if not

    for( var key in poi_candidate_obj){
      var key_exist = false;
      for(var i=0; i<SpeechStatus_object.poi_candidate_userobj_array.length; i++){
        if(key == SpeechStatus_object.poi_candidate_userobj_array[i].id){
          key_exist = true;
        }
      }
      if(!key_exist){
        var obj = {id: key, group:poi_candidate_obj[key]};
        SpeechStatus_object.poi_candidate_userobj_array.push(obj);
        update_exist = true;
        SoundPlayService.Poi();
      }
    }

    // delete if it does not exist

    for(var i=0; i<SpeechStatus_object.poi_candidate_userobj_array.length; i++){

      var user_id = SpeechStatus_object.poi_candidate_userobj_array[i].id;
      var user_id_exist = false;

      for( var key in poi_candidate_obj){
        if(poi_candidate_obj[user_id]){
          user_id_exist = true;
        }
      }
      if(!user_id_exist){
        SpeechStatus_object.poi_candidate_userobj_array.splice(i,1);
        update_exist = true;
      }

    }

    if(update_exist){
      $timeout(function() {}); 
    }


/////////////////////////

/*
    var previous_num = SpeechStatus_object.poi_candidate_userobj_array.length;
    var new_num = 0;
    SpeechStatus_object.poi_candidate_userobj_array.length=0;
    for (var key in poi_obj){
      var obj = {id: key, group:poi_obj[key]};
      SpeechStatus_object.poi_candidate_userobj_array.push(obj);
      new_num++;
    }; 
    if(new_num - previous_num > 0){
      SoundPlayService.Poi();
    }
    $timeout(function() {}); 
*/

  }

  var remove_poi_candidate = function(removed_user_id){


    var poi_candidate_str = gapi.hangout.data.getValue("poi_candidate");
    if(!poi_candidate_str){
      return;
    }
    var poi_candidate_obj = JSON.parse(poi_candidate_str);
 
    var remove_user_exist = false;

    for( var key in poi_candidate_obj){
      if(key == removed_user_id){
        delete poi_candidate_obj[key];
        var poi_candidate_remove_ref = video_status_ref.child("poi/candidate/" + removed_user_id);
        poi_candidate_remove_ref.set(null);
        remove_user_exist = true
      }
    }
    if(remove_user_exist){
      var poi_candidate_str = JSON.stringify(poi_candidate_obj);
      gapi.hangout.data.submitDelta({"poi_candidate":poi_candidate_str});
    }


  }


  SpeechStatus_object.cancel_poi = function(){
    poi_candidate_fireobj_own.$remove();

    if(MixideaSetting.hangout_execution){
      remove_poi_candidate(MixideaSetting.own_user_id);
    }
  }

  SpeechStatus_object.take_poi = function(user_id, group){

    if(MixideaSetting.hangout_execution){
      var poi_taken_obj = new Object();
      poi_taken_obj[user_id] = group
      var poi_taken_str = JSON.stringify(poi_taken_obj);
      gapi.hangout.data.submitDelta({"poi_taken":poi_taken_str});
      gapi.hangout.data.clearValue("poi_candidate");
    }
    poi_taken_fireobj[user_id] = group;
    poi_taken_fireobj.$save();
    
    poi_candidate_fireobj.$remove();
  }


  SpeechStatus_object.finish_poi = function(){

    if(MixideaSetting.hangout_execution){
      gapi.hangout.data.clearValue("poi_taken");
      gapi.hangout.data.clearValue("poi_candidate");
    }
    poi_fireobj.$remove();
    poi_candidate_fireobj.$remove();

  }

 

  var hangout_status_poitaken = function(){

    var poitaken_status_str = gapi.hangout.data.getValue("poi_taken");
    console.log("hangout poitaken status : " + poitaken_status_str);
    var poitaken_obj = new Object();

    if(poitaken_status_str){
      poitaken_obj = JSON.parse(poitaken_status_str);
    }
    update_syncdata_poi_taken(poitaken_obj);
  }


  var update_syncdata_poi_taken = function(updated_poitaken_obj){

      var key = Object.keys(updated_poitaken_obj)[0];
      var speaker_changed = false;

      if(!key){
        if(SpeechStatus_object.poi_speaker_obj && SpeechStatus_object.poi_speaker_obj.id){
          speaker_changed = true;
        }
        for(var key in SpeechStatus_object.poi_speaker_obj){
          delete SpeechStatus_object.poi_speaker_obj[key];  
        }
      }else{
          if(SpeechStatus_object.poi_speaker_obj.id != key){
            var poi_user_id = key;
            var poi_user_group = updated_poitaken_obj[poi_user_id];
            SpeechStatus_object.poi_speaker_obj.id = poi_user_id;
            SpeechStatus_object.poi_speaker_obj.speaker_group = 'Poi from ' + poi_user_group; 
            speaker_changed = true;
          }
      }
      if(speaker_changed){
        SpeechStatus_object.watch_counter++; 
        $timeout(function() {});
      }
  }


  // clear all the data but listener is still working
  SpeechStatus_object.Clear_AllSpeechData = function(){
      if(MixideaSetting.hangout_execution){
        gapi.hangout.data.clearValue("speaker_status");
        gapi.hangout.data.clearValue("poi_taken");
        gapi.hangout.data.clearValue("poi_candidate");
      }
      speaker_fireobj.$remove();
      poi_taken_fireobj.$remove();
      poi_candidate_fireobj.$remove();
  }


  // Service itself remained as a singleton but data and lisnter is removed
  SpeechStatus_object.Finalize_Service = function(){
      if(MixideaSetting.hangout_execution){
        gapi.hangout.data.clearValue("speaker_status");
        gapi.hangout.data.clearValue("poi_taken");
        gapi.hangout.data.clearValue("poi_candidate");
        gapi.hangout.data.onStateChanged.remove(hangout_status_speaker);
        gapi.hangout.data.onStateChanged.remove(hangout_status_poitaken);
        gapi.hangout.onParticipantsRemoved.remove(hangout_participant_removed);
      }
      speaker_fireobj.$remove();
      poi_taken_fireobj.$remove();
      speaker_fireobj_unwatch();
      poitaken_fireobj_unwatch();
      
      poi_candidate_fireobj.$remove();
      poi_candidate_ref.off("value");

  }
  //initial_execution();



  return SpeechStatus_object;

  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.StatusMgrService
 * @description
 * # StatusMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('StatusMgrService',['MixideaSetting','$state','HangoutService','SoundPlayService', function (MixideaSetting,$state, HangoutService, SoundPlayService) {

  var StatusMgr_Object = new Object()
  StatusMgr_Object.game_status = null;

/*hangout status will be added*/

  if(MixideaSetting.hangout_execution){
    gapi.hangout.onApiReady.add(function(e){
      if(e.isApiReady){
        gapi.hangout.data.onStateChanged.add(hangout_game_status);
      }
    });
  }
  function hangout_game_status(){
    var game_status_str = gapi.hangout.data.getValue("game_status");
    console.log("game status from hangout : " + game_status_str);
    if(!game_status_str){
      return;
    }
    update_ui_router(game_status_str);
  }

/*********************/


  //var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  game_status_ref.on("value", function(snapshot) {

    var value = snapshot.val();
    update_ui_router(value);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  function update_ui_router(value){

    if(value !=StatusMgr_Object.game_status){
      StatusMgr_Object.game_status = value;
      if(value=="reflection"){
        $state.go('main.reflection.write_article');
      }else{
        $state.go('main.' + value);
      }
      if(value =='reflection' || value=='complete'){
        HangoutService.set_video_visible(false);
      }
      SoundPlayService.Cursol();
    }
  }


  return StatusMgr_Object;
    
}]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.TitleService
 * @description
 * # TitleService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('TitleService',['MixideaSetting','$timeout', function (MixideaSetting, $timeout) {
 
    var title_obj = new Object();
    title_obj.motion_server = null;
    title_obj.motion_screen = null;
    title_obj.style = null;

   // var root_ref = new Firebase(MixideaSetting.firebase_url);
    var title_ref = global_firebase_root_ref.child("event_related/game/" + MixideaSetting.event_id + "/motion")


    title_ref.on("value", function(snapshot) {
      title_obj.motion_server = snapshot.val();
      organize_data();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


    var  organize_data = function(){

      title_obj.motion_screen = title_obj.motion_server
      if(!title_obj.motion_server){
        title_obj.style = "motion_sentence_Red_xlarge";
        title_obj.motion_screen = "input motion here";
        title_obj.motion_exist = false;
      }else{
        var title_len = title_obj.motion_server.length;      
        if(title_len == 0){
          title_obj.style = "motion_sentence_Red_xlarge";
          $scope.data.motion_screen = "input motion here";
          title_obj.motion_exist = false;
        }if(title_len < 60 ){
          title_obj.style = "motion_sentence_large";
          title_obj.motion_exist = true;
        }else if (title_len < 100){
          title_obj.style = "motion_sentence_middle";
          title_obj.motion_exist = true;
        }else{
          title_obj.style= "motion_sentence_small";
          title_obj.motion_exist = true;
        }
      }
      $timeout(function() {});

    }


    title_obj.save = function(){
      title_ref.set(title_obj.motion_screen);
    }

    title_obj.cancel = function(){
      organize_data();
    }

    title_obj.edit_start = function(){
      if(!title_obj.motion_exist){
        title_obj.motion_screen = "";
      }
    }

    // Public API here
    return title_obj




  }]);

'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.UtilService
 * @description
 * # UtilService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('UtilService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function


  	this.get_full_role_name = function(role){

  		switch (role){
  			case "PM":
  			return "Prime Minister";
  			break;

  			case "LO":
  			return "Leader Opposition";
  			break;

  			case "MG":
  			return "Member Government";
  			break;

  			case "MO":
  			return "Member Opposition";
  			break;

  			case "PMR":
  			return "Prime Minister Reply";
  			break;

  			case "LOR":
  			return "Leader Opposition Reply";
  			break;


  			case "DPM":
  			return "Depty Prime Minister";
  			break;

  			case "DLO":
  			return "Depty Leader Opposition";
  			break;

  			case "WG":
  			return "Whip Government";
  			break;

  			case "WO":
  			return "Whip Opposition";
  			break;

  			case "GW":
  			return "Govenment Whip";
  			break;

  			case "OW":
  			return "Opposition Whip";
  			break;


  			default: 
          	return ""
          	break;
  		}
  	};


    this.add_linebreak_html = function(context){
      if(!context){
        return null;
      }
      var converted_context = context.split("<").join("&lt;");
      converted_context = converted_context.split(">").join("&gt;");
      converted_context = converted_context.split("\n").join("<br>");

      return converted_context;
    }






  });

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:LinkMainroomCtrl
 * @description
 * # LinkMainroomCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('LinkMainroomCtrl',['$scope','MixideaSetting','$timeout', function ($scope, MixideaSetting,$timeout) {



	var hangout_gid = "?gid=";
	var hangout_appid = MixideaSetting.hangout_appid;
	var hangout_query_key = "&gd=";
	var first_query_value = MixideaSetting.own_user_id;;
	var second_query_value = MixideaSetting.event_id;
	var third_query_value = "main";


	//var root_ref = new Firebase(MixideaSetting.firebase_url);
	var hangoutlist_team_ref = global_firebase_root_ref.child("event_related/game_hangout_obj_list/" + MixideaSetting.event_id + "/main");
	hangoutlist_team_ref.on("value", function(snapshot) {
		$timeout(function() {
			var hangout_url = snapshot.val();
			$scope.hangout_url = hangout_url + hangout_gid + hangout_appid 
							+ hangout_query_key + first_query_value + "^" 
							+ second_query_value + "^" + third_query_value;
		});
	}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);

	});


    $scope.$on("$destroy", function() {
    	hangoutlist_team_ref.off("value");
    });


  }]);

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

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TeamdiscussRoomnameCtrl
 * @description
 * # TeamdiscussRoomnameCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TeamdiscussRoomnameCtrl', ['$scope','MixideaSetting',  function ($scope, MixideaSetting) {

	$scope.room_name = MixideaSetting.team_discuss_team_side;

  }]);
