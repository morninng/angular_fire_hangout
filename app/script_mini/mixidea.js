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
  .run(['$state','MixideaSetting', function($state, MixideaSetting) {

  	console.log("event id:" + MixideaSetting.event_id);
  	console.log("user id : " + MixideaSetting.own_user_id);
  	console.log("room type : " + MixideaSetting.room_type);
	 var event_id = MixideaSetting.event_id;
	 var room_type = MixideaSetting.room_type;

  if(room_type == "main"){

	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var game_status_ref = root_ref.child("event_related/game/" + event_id + "/game_status");
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

				//$scope.NA_Gov_summary = $scope.argument_id_data.NA.Gov.summary.keys();
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

	var root_ref = new Firebase("https://mixidea.firebaseio.com/");
	var mapping_data_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/preparation_timer/")
	mapping_data_ref.on("value", function(snapshot){
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

		$timeout(function() {
			$scope.prep_time = elapsed_minute + ":" + elapled_second + " has passed";
		});

	}, 1000);

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
  .controller('LinkTeamdiscussCtrl',['$scope','ParticipantMgrService','MixideaSetting','$timeout', function ($scope, ParticipantMgrService, MixideaSetting, $timeout) {
  	$scope.aaa = "name";
 
  	$scope.participant_mgr = ParticipantMgrService;
  	$scope.team_hangout_array = new Array();

  	var teamlist = new Object();
  	var url_list_array = new Array();


  	$scope.$watch('participant_mgr.own_group', 
  		function(newValue, oldValue){
  			update_link();
  		}
  	);

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var hangoutlist_team_ref = root_ref.child("event_related/game_hangout_obj_list/" + MixideaSetting.event_id + "/team_discussion");
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
    $timeout(function() {});
  }

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
		console.log( "status:" + newValue);

		$timeout(function() {
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
					$scope.main_width = {width:"1000px"};
					$scope.main_right_width = {width:"700px"};


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
		});




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

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.change_shown = false;
  $scope.participant_mgr = ParticipantMgrService;




  $scope.show_change_style = function(){
    $scope.change_shown = true;
  }

  $scope.change_style = function(){
    $scope.change_shown = false;
    var style = $scope.participant_mgr.debate_style;
    var deb_style_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style");
    deb_style_ref.set(style);
    console.log(style);
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

}]);


angular.module('angularFireHangoutApp')
  .controller('ParticipantTableChildCtrl',['$scope','ParticipantMgrService', 'MixideaSetting',function ($scope, ParticipantMgrService,MixideaSetting) {

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.participant_mgr = ParticipantMgrService;
  $scope.own_user_id = MixideaSetting.own_user_id

	$scope.join = function(role_name){
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + $scope.participant_mgr.debate_style + "/" + role_name);
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
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + $scope.participant_mgr.debate_style + "/" + role_name);
    role_participants_ref.set(null,  function(error) {
      if (error) {
        console.log("cannot cancel" + error);
      } else {
        console.log("cancel succed");
      }
    });
  }


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
  .controller('ReflecTabCtrl',["$scope", function ($scope) {

  



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
  .controller('StaticvideoCtrl',[ '$scope', function ($scope) {

  	var ratio = 0.8;
  	var layout_width = 300;
  	var layout_width_str = String(layout_width) + "px";
  	var layout_height = layout_width * ratio;
  	var layout_height_str = String(layout_height) + "px";

  	$scope.video_canvas_dummy_layout = {width: layout_width_str, height:layout_height_str};


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


  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  

  $scope.update_status = function(new_status){

  	if(new_status == "preparation"){
  		set_preparation_starttime();
  	}

    console.log(new_status);
    game_status_ref.set(new_status, function(error) {
	  if (error) {
	    console.log("saving status failed" + error);
	  } else {
	    console.log("status is updated");
	  }
	});
  }


  function set_preparation_starttime(){

  	var current_time = Date.now();

	  var root_ref = new Firebase("https://mixidea.firebaseio.com/");
	  var prep_time_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/preparation_timer/")
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

  	$scope.$watch('game_status_service.game_status', function(newValue, oldValue){
  		console.log( "status:" + newValue);
		$scope.status_intro = "status_bar_element";
		$scope.status_prep = "status_bar_element";
		$scope.status_debate = "status_bar_element";
		$scope.status_reflec = "status_bar_element";
		$scope.status_complete = "status_bar_element_last";

		$timeout(function() {
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
				break
			}
		});
  	})


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
  .controller('TitleMgrCtrl',['$scope', 'MixideaSetting','$timeout', function ($scope, MixideaSetting, $timeout) {


  	$scope.under_edit = false;
  	$scope.data = new Object();
  	$scope.data.motion = "";

	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var title_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/motion")

	title_ref.on("value", function(snapshot) {
		$timeout(function() {
			$scope.data.motion = snapshot.val();

			if(!$scope.data.motion){
				$scope.motion_sentence = "motion_sentence_Red_xlarge";
  				$scope.data.motion = "input motion here";
  				$scope.data.motion_exist = false;
  				return;	
			}
			var title_len = $scope.data.motion.length;			
			if(title_len == 0){
				$scope.motion_sentence = "motion_sentence_Red_xlarge";
  				$scope.data.motion = "input motion here";
  				$scope.data.motion_exist = false;
			}if(title_len < 60 ){
				$scope.motion_sentence = "motion_sentence_large";
  				$scope.data.motion_exist = true;
			}else if (title_len < 100){
				$scope.motion_sentence = "motion_sentence_middle";
  				$scope.data.motion_exist = true;
			}else{
				$scope.motion_sentence = "motion_sentence_small";
  				$scope.data.motion_exist = true;
			}
		});
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});

	function update_input_text_width(){
		var motion_length = $scope.data.motion.length;
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
		update_input_text_width()
		if(!$scope.data.motion_exist){
			$scope.data.motion = "";
		}
		$scope.under_edit = true;
	}

	$scope.save = function(){
		title_ref.set($scope.data.motion);
		$scope.under_edit = false;

	}

	$scope.cancel = function(){
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
  .controller('UrlSharingCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:VideodebateCtrl
 * @description
 * # VideodebateCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('VideodebateCtrl',["$scope","MixideaSetting", "ParticipantMgrService","$timeout","SoundPlayService","RecognitionService","UtilService","RecordingService",  function ($scope,MixideaSetting ,ParticipantMgrService, $timeout, SoundPlayService, RecognitionService, UtilService, RecordingService) {

  	$scope.participant_mgr = ParticipantMgrService;

/*******ui related part****************/
  	$scope.status = "break";
  	$scope.speaker_obj = new Object();
  	$scope.poi_speaker_obj = new Object();
  	$scope.poi_candidate_userobj_array = new Array();
  	$scope.timer_value = null;
    $scope.speech_start_time = 0;

	var root_ref = new Firebase(MixideaSetting.firebase_url);

	var video_status_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/video_status");
	var speaker_ref = video_status_ref.child("speaker");
	var speaker_ref_own = video_status_ref.child("speaker/" + MixideaSetting.own_user_id);
	var poi_ref = video_status_ref.child("poi");
	var poi_candidate_ref = video_status_ref.child("poi/candidate");
	var poi_candidate_ref_own = video_status_ref.child("poi/candidate/" + MixideaSetting.own_user_id);
	var poi_taken_ref = video_status_ref.child("poi/taken");
	var poi_taken_ref_own = video_status_ref.child("poi/taken/" + MixideaSetting.own_user_id);

  var current_speaker = null;

  	$scope.speech_start = function(role){
  		var own_side = $scope.participant_mgr.own_side;
  		var own_name = $scope.participant_mgr.own_first_name;
  		var full_role_name = UtilService.get_full_role_name(role);
      var speech_start_time_value = Date.now();

  		var speaker_obj = {
  			role: role,
  			name:own_name,
  			side: own_side,
  			full_role_name: full_role_name,
        speech_start_time: speech_start_time_value
  		}
  		var own_speaker_obj = new Object();
  		own_speaker_obj[MixideaSetting.own_user_id] = speaker_obj;
  		speaker_ref.transaction(function(current_value){
  			if(current_value){
  				return;
  			}
  			return own_speaker_obj;
  		});
  		speaker_ref_own.onDisconnect().set(null);
      SoundPlayService.SpeechStart();
  	}

  	speaker_ref.on("value", function(snapshot){
  		var updated_speaker_obj = snapshot.val();

  		if(!updated_speaker_obj){
  			for(var key in $scope.speaker_obj){
  				delete $scope.speaker_obj[key]
  			}
  		}else{
			var obj = new Object();
			for(var key in updated_speaker_obj){
				var speaker_user_id = key;
				$scope.speaker_obj.id = speaker_user_id;
				var obj = updated_speaker_obj[speaker_user_id];
				$scope.speaker_obj.name = obj.name;
				$scope.speaker_obj.role = obj.role;
        current_speaker = obj.role;
				$scope.speaker_obj.side = obj.side;
				$scope.speaker_obj.full_role_name = obj.full_role_name;
        $scope.speech_start_time = obj.speech_start_time;
			}
		}
		update_video_status()

  	}, function(error){
  		console.log("fail while to retrieve speaker obj" + error);
  	})

	$scope.complete_speech = function(){
		video_status_ref.set(null);

	}

	$scope.poi = function(){
    var own_group = $scope.participant_mgr.own_group
		poi_candidate_ref_own.set(own_group);
		poi_candidate_ref_own.onDisconnect().set(null);
    poi_taken_ref_own.onDisconnect().set(null);
    SoundPlayService.Poi();
	}
	poi_candidate_ref.on("value", function(snapshot){
		var poi_obj = snapshot.val();
		$scope.poi_candidate_userobj_array.length=0;
		$timeout(function() {
			for (var key in poi_obj){
        var obj = {id: key, group:poi_obj[key]};
				$scope.poi_candidate_userobj_array.push(obj);
			}
		});
	});
	$scope.finish_poi = function(){
		poi_ref.set(null);
    SoundPlayService.PoiFinish();
	}

	$scope.cancel_poi = function(){
		poi_candidate_ref_own.set(null);
	}

	$scope.take_poi = function(user_id, group){
		var poi_taken_obj = new Object();
		poi_taken_obj[user_id] = group;
		poi_taken_ref.transaction(function(current_value){
  			if(current_value){
  				return;
  			}
  			return poi_taken_obj;
  		});
    poi_candidate_ref.set(null);
    SoundPlayService.Taken();
	}

	poi_taken_ref.on("value", function(snapshot){
  		var poi_taken_obj = snapshot.val();
  		var poi_user_id = null;
      var poi_user_group = null;
  		for(var key in poi_taken_obj){
  			poi_user_id = key;
        poi_user_group = poi_taken_obj[key]
  		}
		if(poi_user_id){
			$scope.poi_speaker_obj.id = poi_user_id;
			$scope.poi_speaker_obj.speaker_group = 'Poi from ' + poi_user_group;
		//	$scope.poi_speaker_obj.name = $scope.participant_mgr.user_object_data[poi_user_id].first_name;
		}else{
			for(var key in $scope.poi_speaker_obj){
				delete $scope.poi_speaker_obj[key]
			}
		}
		
  		update_video_status();
  	});

  	function update_video_status(){

  		$timeout(function() {
  			if($scope.poi_speaker_obj.id){
          manage_speaker($scope.poi_speaker_obj.id, "poi");
  				$scope.status = "poi";

  			}else if ($scope.speaker_obj.id){
          if($scope.status=="break"){
            speech_execution_start();
          }
          manage_speaker($scope.speaker_obj.id, "speech");
  				$scope.status = "speech";
  			}else{
          if($scope.status !="break"){
            speech_execution_stop();
          }
          manage_speaker(null, "break");
  				$scope.status = "break";
  			}
  		});
  	}


    function speech_execution_start(){
      StartTimer()
      //sound_mgr.play_sound_speech_start()
    }

    function speech_execution_stop(){
      StopTimer()
      //sound_mgr.play_sound_speech_stop()
    }

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
        //sound_mgr.play_sound_PinOne();
        console.log("one minutes");
      }else if(minutes ==6 && second == 0){
        //sound_mgr.play_sound_PinOne();
        console.log("two minutes");
      }else if(minutes == 7  && second == 0){
        //sound_mgr.play_sound_PinTwo();
        console.log("seven minutes");
      }else if(minutes == 7  && second == 30){
        //sound_mgr.play_sound_PinThree();
        console.log("seven and half minutes");
      }
      $timeout(function() {
        $scope.timer_value = timer_str;
      });
    }

/*************speaker related part****************/

    $scope.current_speaker = null;

    function manage_speaker(speaker_id, type){

      if(speaker_id == MixideaSetting.own_user_id){
        //Recording.start();
        RecognitionService.start(type, current_speaker  ,$scope.speech_start_time);
        RecordingService.record_start_api(type, current_speaker, $scope.speech_start_time);
        //microphone.enable();
      }else if(speaker_id){
        RecognitionService.stop();
        RecordingService.record_finish_api("other", current_speaker, $scope.speech_start_time);
        //microphone.disabled();
      }else{
        RecognitionService.stop();
        RecordingService.record_finish_api("break", current_speaker, $scope.speech_start_time);
        //microphone.enable();
      }
      $scope.current_speaker == speaker_id;

    }



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

}());


angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
  	firebase_url: "https://mixidea.firebaseio.com/",
  	source_domain: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/',
  	own_user_id: global_own_user_id,
  	event_id: global_event_id,
  	room_type: global_room_type,
    hangout_appid: "211272797315",
    team_discuss_team_side: global_team_side,
    team_discuss_own_team: global_own_team_side,
    recording_domain: 'https://recording.mixidea.org:3000/'
  });

function set_mapping_data(user_id, hangout_id)
{
  
  var root_ref = new Firebase("https://mixidea.firebaseio.com/");
  var mapping_data_ref = root_ref.child("event_related/hangout_dynamic/" + global_event_id + "/mapping_data/" + global_own_user_id)
  mapping_data_ref.set(hangout_id, function(error) {
    if (error) {
      alert("mapping failed" + error);
    } else {
      console.log("hangout id " + hangout_id + " is set");
    }
  });

}
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
var global_team_side  = null;
var global_own_team_side = null;

(function () {

  global_event_id = "-KC_6f1izVFTY9sJt_rM";
  global_own_user_id = "facebook:1520978701540732";
  //global_room_type = "team_discussion";
  global_room_type = "main";

  if(global_room_type == "team_discussion"){
    global_team_side = "Prop";
    global_own_team_side = "Prop";
  }

  
  var dummy_hangout_id = "11111111111";
  set_mapping_data(global_own_user_id, dummy_hangout_id)

}());

angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
  	firebase_url: "https://mixidea.firebaseio.com/",
  	source_domain: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/',
  	own_user_id: global_own_user_id,
  	event_id: global_event_id,
  	room_type: global_room_type,
    hangout_appid: "211272797315",
    team_discuss_team_side: global_team_side,
    team_discuss_own_team: global_own_team_side,
    recording_domain: 'https://recording.mixidea.org:3000/'
  });


function set_mapping_data(user_id, hangout_id)
{
  var root_ref = new Firebase("https://mixidea.firebaseio.com/");
  var mapping_data_ref = root_ref.child("event_related/hangout_dynamic/" + global_event_id + "/mapping_data/" + global_own_user_id)
  mapping_data_ref.set(hangout_id, function(error) {
    if (error) {
      alert("mapping failed" + error);
    } else {
      console.log("hangout id " + hangout_id + " is set");
    }
  });

  mapping_data_ref.onDisconnect().remove();
}

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
var global_team_side  = null;
var global_own_team_side = null;

(function () {

  global_event_id = "-KC_6f1izVFTY9sJt_rM";
  global_own_user_id = "facebook:997119893702319";
  //global_room_type = "team_discussion";
  global_room_type = "main";

  if(global_room_type == "team_discussion"){
    global_team_side = "Prop";
    global_own_team_side = "Prop";
  }

  var dummy_hangout_id = "2222222222";
  set_mapping_data(global_own_user_id, dummy_hangout_id)

}());

angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
  	firebase_url: "https://mixidea.firebaseio.com/",
  	source_domain: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/',
  	own_user_id: global_own_user_id,
  	event_id: global_event_id,
  	room_type: global_room_type,
    hangout_appid: "211272797315",
    team_discuss_team_side: global_team_side,
    team_discuss_own_team: global_own_team_side,
    recording_domain: 'https://recording.mixidea.org:3000/'
  });


function set_mapping_data(user_id, hangout_id)
{
  var root_ref = new Firebase("https://mixidea.firebaseio.com/");
  var mapping_data_ref = root_ref.child("event_related/hangout_dynamic/" + global_event_id + "/mapping_data/" + global_own_user_id)
  mapping_data_ref.set(hangout_id, function(error) {
    if (error) {
      alert("mapping failed" + error);
    } else {
      console.log("hangout id " + hangout_id + " is set");
    }
  });

  mapping_data_ref.onDisconnect().remove();
}
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

(function () {

  global_event_id = "-KC_6f1izVFTY9sJt_rM";
  global_own_user_id = "facebook:1520978701540732";
  //global_room_type = "team_discussion";
  global_room_type = "main";
  
  
  if(global_room_type == "team_discussion"){
    global_team_side = "Gov";
    global_own_team_side = "Opp";
  }

  var dummy_hangout_id = "BBCCBBBBB";
  set_mapping_data(global_own_user_id, dummy_hangout_id);



}());

angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
  	firebase_url: "https://mixidea.firebaseio.com/",
  	source_domain: '/',
  	own_user_id: global_own_user_id,
  	event_id: global_event_id,
  	room_type: global_room_type,
    hangout_appid: "211272797315",
    team_discuss_team_side: global_team_side,
    team_discuss_own_team: global_own_team_side,
    recording_domain: 'https://recording.mixidea.org:3000/'
  });


function set_mapping_data(user_id, hangout_id)
{
  var root_ref = new Firebase("https://mixidea.firebaseio.com/");
  var mapping_data_ref = root_ref.child("event_related/hangout_dynamic/" + global_event_id + "/mapping_data/" + global_own_user_id)
  mapping_data_ref.set(hangout_id, function(error) {
    if (error) {
      alert("mapping failed" + error);
    } else {
      console.log("hangout id " + hangout_id + " is set");
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
        console.log("link is called");
        console.log(scope.argument_id_obj);
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;
        scope.element = element;
        scope.participant_mgr = ParticipantMgrService;
        scope.others_writing_title = false;
        scope.others_writing_content = false;

        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = root_ref.child(argument_content_path);


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






        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id;
        var argument_focused_ref = root_ref.child(argument_focused_path);


        var title_focused_ref = argument_focused_ref.child("title");
        title_focused_ref.on("value", function(snapshot){
          $timeout(function(){
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
          });
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
          $timeout(function(){
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



        var one_argument_id_path = "event_related/Article_Context/" + event_id + "/identifier/" 
                + deb_style + "/" + team + "/arguments/" + arg_id;
        var one_argument_id_ref = root_ref.child(one_argument_id_path);
        scope.remove_argument = function(){
          console.log("remove" + arg_id);
          one_argument_id_ref.set(null);
        }


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

        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = root_ref.child(argument_content_path);

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


        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id;
        var argument_focused_ref = root_ref.child(argument_focused_path);

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
        console.log("link is called");
        console.log(scope.argument_id_obj);
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;
        scope.element = element;
        scope.participant_mgr = ParticipantMgrService;
        scope.others_writing_title = false;
        scope.others_writing_content = false;

        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = root_ref.child(argument_content_path);


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




        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id;
        var argument_focused_ref = root_ref.child(argument_focused_path);


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
          console.log("title unfocused");
        }
        scope.title_save = function(){
          title_own_focused_ref.set(null);
          console.log("save");
        }
        title_own_focused_ref.onDisconnect().remove();




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
         console.log("content unfocused");
        }
        content_own_focused_ref.onDisconnect().remove();

        scope.save_content = function(){
         content_own_focused_ref.set(null);
        }


        var one_argument_id_path = "event_related/Article_Context/" + event_id + "/identifier/" 
                + deb_style + "/" + team + "/arguments/" + arg_id;
        var one_argument_id_ref = root_ref.child(one_argument_id_path);
        scope.remove_argument = function(){
          console.log("remove" + arg_id);
          one_argument_id_ref.set(null);
        }


      }
    };
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
.factory('ParticipantMgrService',['MixideaSetting','$timeout', function (MixideaSetting, $timeout) {


  var ParticipantMgr_Object = new Object();
  ParticipantMgr_Object.debate_style = null;
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
  var debate_style = null;
  var full_participants_object = new Object();
  var mapping_object = new Object();
  var total_number_participants = 0;
  var role_group_name_mappin = new Object();

//debate style

  var deb_style_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/deb_style")
  deb_style_ref.on("value", function(snapshot) {
    debate_style  = snapshot.val();
    $timeout(function() {
      ParticipantMgr_Object.debate_style = debate_style;
    });
    update_ParticipantMgr_Object();

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });

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

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var mapping_ref = root_ref.child("event_related/hangout_dynamic/" + MixideaSetting.event_id + "/mapping_data");
  mapping_ref.on("value", function(snapshot) {
    var value  = snapshot.val();
    var key  = snapshot.key();
    if(value){
      mapping_object = value;
    }else{
      mapping_object = new Object();
    }
    update_ParticipantMgr_Object();

  }, function (errorObject) {

    console.log("The read failed: " + errorObject.code);

  });

// game role

  var game_role_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/");
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

    $timeout(function() {
      var no_applicant_img = MixideaSetting.source_domain + "images/want_you.png";
      switch(debate_style){
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
            WG:{
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
            WO:{
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
      if(debate_style == "BP"){
        adopt_ParticipantObj_BP();
      }
      console.log("participant obj");
      console.log(ParticipantMgr_Object.participant_obj);
      console.log("audience array");
      console.log(ParticipantMgr_Object.audience_array);
      update_member_variable();
    });
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
    console.log("participant_obj_bp_open");
    console.log(ParticipantMgr_Object.participant_obj_bp_open);
    console.log("participant_obj_bp_close");
    console.log(ParticipantMgr_Object.participant_obj_bp_close);
  }


  function update_member_variable(){

      switch(debate_style){
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
      console.log("update_member_variable");
      console.log(ParticipantMgr_Object.own_role_array);
      console.log(ParticipantMgr_Object.own_group);
      console.log(ParticipantMgr_Object.own_group_id);
      console.log(ParticipantMgr_Object.is_audience_or_debater);

  }


  ParticipantMgr_Object.get_hangout_id = function(user_id){

  }

  ParticipantMgr_Object.get_user_info = function(user_id){

  }
  ParticipantMgr_Object.get_user_pict = function(user_id){
    ParticipantMgr_Object.user_object_data[user_id].profile_pict;
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
    var short_split_id_value="aaaa";
    var root_ref = new Firebase(MixideaSetting.firebase_url);
    var transcription_ref = null;
    var speech_type=null;
    var speech_start_time = 0;

	if(!window.webkitSpeechRecognition){
		available = false;
		return;
	}
	var recognition = new webkitSpeechRecognition();
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

    this.start = function(type, speaker_role, time_value){
    	if(!available){
    		return;
    	}
    	speech_start_time = time_value;
      	short_split_id_value = Date.now();
    	
    	speech_type = type;
    	transcription_ref = root_ref.child("event_related/audio_transcript/" + 
    						MixideaSetting.event_id + "/" + speaker_role + 
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
            console.log("recognition start")
    		recognition.start();
    		under_recording = true;
    	}

    }

    this.stop = function(){
        console.log("record stop")
    	if(!available || !under_recording){
    		return;
    	}
    	recognition.stop();
    	under_recording = false;
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
  .service('RecordingService',['MixideaSetting', function (MixideaSetting) {
    // AngularJS will instantiate a singleton by calling "new" on this function

	var audio_available = false;
	var socket_available = false;
	var stored_speech_id = null;
	var socket_io = null;
	var stream = null;
	var context = null;
	var sample_rate_value = null;
	var scriptNode = null;

    var under_recording = false;

    this.record_start_api = function(type, speaker_role_name, speech_id){
    	console.log("record start");

		if(!audio_available || !socket_available){
			return;
		}

		under_recording = true;
		var file_name = MixideaSetting.event_id + "_" + speaker_role_name + "_" + speech_id;
		switch(type){
			case "speech":
				if(stored_speech_id == speech_id){
					resume_record(file_name);
				}else{
					start_record(file_name);
				}
			break;
			case "poi":
				resume_record(file_name);
			break;
		}
		stored_speech_id = speech_id;

    }

    this.record_finish_api = function(type, speaker_role_name, speech_id){
		if(!audio_available || !socket_available || !under_recording){
			return;
		}
		under_recording = false;
		
		var file_name = MixideaSetting.event_id + "_" + speaker_role_name + "_" + speech_id;
		switch(type){
			case "break":
				stop_record_save(file_name, speaker_role_name, speech_id);
			break;
			case "other":
				suspend_record(file_name);
			break;
		}
    }


    function sockt_initialize(){

		socket_io = io.connect(MixideaSetting.recording_domain);

		socket_io.on('connect', function(){
			console.log("connect socket id=" + socket_io.id);
			socket_available = true;

			socket_io.emit('join_room', {'room_name':MixideaSetting.event_id});

			socket_io.on('audio_saved', function(data){
				console.log('record complete ' + data.file_saved);
				audio_transcript_obj.update();
			});
			

			socket_io.on('disconnect', function(){
				console.log('disconnected');
				socket_available = false;
				if(stream){
					console.log("disconnected");
					under_recording = false;
					stream.end();
					stream = null;
				}
			});
		});
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
				 	start_audio_polling(local_media_stream);
				},
				function(e) {console.log('Error'); } );
		} else{
			console.log('getUserMedia not supported');
		}

    }

    function start_record(in_file_name){
		if(!socket_available || !audio_available){
			return;
		}

		if(!stream){
			console.log(" start record socket id=" + socket_io.id);
			console.log("start recording");
			stream = ss.createStream();
			console.log("audio polling stream id " + stream.id);
			var start_emit_obj = {filename:in_file_name,sample_rate:sample_rate_value};
			console.log(start_emit_obj);
			ss(socket_io).emit('audio_record_start', stream, start_emit_obj );
		}else{
			console.log("recording is already on going");
		}
    }

    function resume_record(in_file_name){

		if(!socket_available || !audio_available){
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

    function suspend_record(in_file_name){
		if(!socket_available || !audio_available){
			return;
		}
		console.log("suspend recording");
		if(stream){
			stream.end();
			stream = null;
			socket_io.emit('audio_record_suspend', {filename:in_file_name});
		} 	
    }

    function stop_record_save(in_file_name, in_role_name, speech_id_val){

		var self = this;
		if(!socket_available || !audio_available){
			return;
		}
		console.log("stop recording");
		if(stream){
			console.log("stop record socket id=" + socket_io.id);
			stream.end();
			stream = null;
			var room_name_val = MixideaSetting.event_id;
			var stop_emit_obj = {filename:in_file_name, role_name: in_role_name, room_name: room_name_val, speech_id: speech_id_val }
			console.log(stop_emit_obj);
			socket_io.emit('audio_record_end', stop_emit_obj);
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
		  if(!under_recording || !socket_io ){
		   return;
		  }
		  var left = audioProcessingEvent.inputBuffer.getChannelData(0);
		  var audio_array_buffer = convertoFloat32ToInt16(left);
		  var stream_buffer = new ss.Buffer(audio_array_buffer);
		  stream.write(stream_buffer, 'buffer');
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

	sockt_initialize();
	recording_initialize();

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
		console.log("pin one");
		if(!sound_mgr.PinOne_sound){
			return;
		}
		sound_mgr.Poi_sound.start(0);
		sound_mgr.Poi_sound = audio_context.createBufferSource();
		sound_mgr.Poi_sound.buffer = sound_mgr.Poi_sound_persisted_buffer;
		sound_mgr.Poi_sound.connect(audio_context.destination);
	}

	this.HearHear = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.HearHear_sound.start(0);
		sound_mgr.HearHear_sound = audio_context.createBufferSource();
		sound_mgr.HearHear_sound.buffer = sound_mgr.HearHear_sound_persisted_buffer;
		sound_mgr.HearHear_sound.connect(audio_context.destination);
	}
	this.BooBoo = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.BooBoo_sound.start(0);
		sound_mgr.BooBoo_sound = audio_context.createBufferSource();
		sound_mgr.BooBoo_sound.buffer = sound_mgr.BooBoo_sound_persisted_buffer;
		sound_mgr.BooBoo_sound.connect(audio_context.destination);
	}
	this.Taken = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.Taken_sound.start(0);
		sound_mgr.Taken_sound = audio_context.createBufferSource();
		sound_mgr.Taken_sound.buffer = sound_mgr.Taken_sound_persisted_buffer;
		sound_mgr.Taken_sound.connect(audio_context.destination);
	}
	this.PoiFinish = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PoiFinish_sound.start(0);
		sound_mgr.PoiFinish_sound = audio_context.createBufferSource();
		sound_mgr.PoiFinish_sound.buffer = sound_mgr.PoiFinish_sound_persisted_buffer;
		sound_mgr.PoiFinish_sound.connect(audio_context.destination);
	}
	this.PinOne = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PinOne_sound.start(0);
		sound_mgr.PinOne_sound = audio_context.createBufferSource();
		sound_mgr.PinOne_sound.buffer = sound_mgr.PinOne_sound_persisted_buffer;
		sound_mgr.PinOne_sound.connect(audio_context.destination);
	}
	this.PinTwo = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PinTwo_sound.start(0);
		sound_mgr.PinTwo_sound = audio_context.createBufferSource();
		sound_mgr.PinTwo_sound.buffer = sound_mgr.PinTwo_sound_persisted_buffer;
		sound_mgr.PinTwo_sound.connect(audio_context.destination);
	}
	this.PinThree = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.PinThree_sound.start(0);
		sound_mgr.PinThree_sound = audio_context.createBufferSource();
		sound_mgr.PinThree_sound.buffer = sound_mgr.PinThree_sound_persisted_buffer;
		sound_mgr.PinThree_sound.connect(audio_context.destination);
	}
	this.Cursol = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.Cursol_sound.start(0);
		sound_mgr.Cursol_sound = audio_context.createBufferSource();
		sound_mgr.Cursol_sound.buffer = sound_mgr.Cursol_sound_persisted_buffer;
		sound_mgr.Cursol_sound.connect(audio_context.destination);
	}

	this.SpeechStart = function(){
		console.log("speech start");
		if(!sound_mgr.SpeechStart_sound){
			return;
		}
		sound_mgr.SpeechStart_sound.start(0);
		sound_mgr.SpeechStart_sound = audio_context.createBufferSource();
		sound_mgr.SpeechStart_sound.buffer = sound_mgr.SpeechStart_sound_persisted_buffer;
		sound_mgr.SpeechStart_sound.connect(audio_context.destination);
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
 * @name angularFireHangoutApp.StatusMgrService
 * @description
 * # StatusMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .factory('StatusMgrService',['MixideaSetting','$state', function (MixideaSetting,$state) {

  var StatusMgr_Object = new Object()
  StatusMgr_Object.game_status = null;

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  var game_status_ref = root_ref.child("event_related/game/" + MixideaSetting.event_id + "/game_status")
  game_status_ref.on("value", function(snapshot) {

    var value = snapshot.val();
    if(value !=StatusMgr_Object.game_status){
      StatusMgr_Object.game_status = value;
      if(value=="reflection"){
        $state.go('main.reflection.write_article');
      }else{
        $state.go('main.' + value);
      }
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });


  return StatusMgr_Object;
    
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


	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var hangoutlist_team_ref = root_ref.child("event_related/game_hangout_obj_list/" + MixideaSetting.event_id + "/main");
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
  .controller('TeamdiscussArgumentsCtrl',["$scope","MixideaSetting",'$timeout', function ($scope, MixideaSetting,$timeout) {

  $scope.arg_list = new Array();
  $scope.defintro_list = new Array();

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

	var defintro_id_path = "event_related/Article_Context/" + event_id_val + "/identifier/" 
				+ deb_style_val + "/" + team_val + "/def_intro";
	var defintro_id_ref = root_ref.child(defintro_id_path);
	defintro_id_ref.on("child_added", function(snapshot, previousKey){
		var defintro_id_key = snapshot.key();
		$timeout(function(){
			$scope.defintro_list.push({arg_id:defintro_id_key});
		});
	});

	$scope.add_argument = function(){
		console.log("add argument");
		var dummy_content = {dummy:true};
		argument_id_ref.push(dummy_content);
	}




  }








  	$scope.name="kkkk";

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
