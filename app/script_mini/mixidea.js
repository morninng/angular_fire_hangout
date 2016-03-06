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
				templateUrl: MixideaSetting.source_domain + 'views/main/main_room_layout.html'
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
			templateUrl: MixideaSetting.source_domain + 'views/main/static_video.html',
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
			templateUrl: MixideaSetting.source_domain + 'views/main/static_video.html',
			controller: 'StaticvideoCtrl'
			},
			"container_main_left_above_right":{
			templateUrl: MixideaSetting.source_domain + 'views/main/direction_prep.html',
			controller: 'StatusUpdateCtrl'
			},
			"container_main_left_below":{
			templateUrl: MixideaSetting.source_domain + 'views/main/info_prep.html',
			controller: 'LinkTeamdiscussCtrl'
			}
		}
	})
	.state('main.debate', {
		views:{
			"top_left":{
			templateUrl: MixideaSetting.source_domain + 'views/common/title.html',
			controller: 'TitleMgrCtrl'
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
  .controller('LinkTeamdiscussCtrl',['$scope','ParticipantMgrService','MixideaSetting', function ($scope, ParticipantMgrService, MixideaSetting) {
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
  }

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
    team_discuss_own_team: global_own_team_side
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

  global_event_id = "-KC9WfxpLwKbaWiSjqg6";
  global_own_user_id = "facebook:1520978701540732";
  global_room_type = "team_discussion";

  if(global_room_type == "team_discussion"){
    global_team_side = "Gov";
    global_own_team_side = "Gov";
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
    team_discuss_own_team: global_own_team_side
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

  global_event_id = "-KC9WfxpLwKbaWiSjqg6";
  global_own_user_id = "facebook:997119893702319";
  global_room_type = "team_discussion";

  if(global_room_type == "team_discussion"){
    global_team_side = "Gov";
    global_own_team_side = "Gov";
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
    team_discuss_own_team: global_own_team_side
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

  global_event_id = "-KC9WfxpLwKbaWiSjqg6";
  global_own_user_id = "facebook:1520978701540732";
  global_room_type = "team_discussion";
  //global_room_type = "main";
  
  
  if(global_room_type == "team_discussion"){
    global_team_side = "Gov";
    global_own_team_side = "Gov";
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
    team_discuss_own_team: global_own_team_side
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
  .directive('oneArgument',["$timeout","MixideaSetting","ParticipantMgrService","$sce",  function ($timeout, MixideaSetting,ParticipantMgrService, $sce) {
    return {
      templateUrl: $sce.trustAsResourceUrl( MixideaSetting.source_domain +'views/directive/oneArgument.html'),
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
            scope.content_div = add_linebreak_html(scope.content);
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

        function add_linebreak_html(context){
          if(!context){
            return null;
          }
          var converted_context = context.split("<").join("&lt;");
          converted_context = converted_context.split(">").join("&gt;");
          converted_context = converted_context.split("\n").join("<br>");

          return converted_context;
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
  .directive('oneDefintro',["$timeout","MixideaSetting","ParticipantMgrService","$sce",  function ($timeout,MixideaSetting,ParticipantMgrService ,$sce) {
    return {
      templateUrl: $sce.trustAsResourceUrl( MixideaSetting.source_domain + 'views/directive/oneDefintro.html'),
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
            scope.content_div = add_linebreak_html(scope.content);
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


        function add_linebreak_html(context){
          if(!context){
            return null;
          }
          var converted_context = context.split("<").join("&lt;");
          converted_context = converted_context.split(">").join("&gt;");
          converted_context = converted_context.split("\n").join("<br>");

          return converted_context;
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
      ParticipantMgr_Object.own_group_id = null;

      for( var role_key in ParticipantMgr_Object.participant_obj){
        if(ParticipantMgr_Object.participant_obj[role_key].id == MixideaSetting.own_user_id){
          ParticipantMgr_Object.own_role_array.push(role_key);
          ParticipantMgr_Object.own_group = ParticipantMgr_Object.participant_obj[role_key].group;
          ParticipantMgr_Object.own_group_id = ParticipantMgr_Object.participant_obj[role_key].group_id;
          ParticipantMgr_Object.is_audience_or_debater = "debater";
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
      $state.go('main.' + value);
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

  });


  return StatusMgr_Object;
    
}]);

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
