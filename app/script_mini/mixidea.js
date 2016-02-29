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
    'firebase'
  ]);




angular.module('angularFireHangoutApp')
  .run(['$state','MixideaSetting', function($state, MixideaSetting) {

  	console.log("event id:" + MixideaSetting.event_id);
  	console.log("user id : " + MixideaSetting.own_user_id);
  	console.log("room type : " + MixideaSetting.room_type);
	 var event_id = MixideaSetting.event_id;
	 var room_type = MixideaSetting.room_type;

	var root_ref = new Firebase(MixideaSetting.firebase_url);
	var game_status_ref = root_ref.child("event_related/game/" + event_id + "/game_status");
	game_status_ref.once("value", function(snapshot){
		var game_status = snapshot.val();
		goto_state(room_type, game_status);
	}, function(error_obj){
		alert("event is corrupted, please confirm with mixidea administrator");
	});

	 

	function goto_state(room_type, game_status){
		switch(room_type){
			case "main":
				switch(game_status){
					case "introduction":
						$state.go('main.intro');
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
					$state.go('team_discussion');
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
	.state('main.intro', {
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
			templateUrl: MixideaSetting.source_domain + 'views/main/direction_intro.html'
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

}]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

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

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  	$scope.change_shown = false;
  	$scope.debate_style = null;

  	$scope.participant_mgr = ParticipantMgrService;




	$scope.show_change_style = function(){

	}

  	$scope.change_style = function(){

  	}

  }]);


angular.module('angularFireHangoutApp')
  .controller('ParticipantTableChildCtrl',['$scope','ParticipantMgrService', 'MixideaSetting',function ($scope, ParticipantMgrService,MixideaSetting) {

  var root_ref = new Firebase(MixideaSetting.firebase_url);
  $scope.participant_mgr = ParticipantMgrService;
  $scope.own_user_id = MixideaSetting.own_user_id

	$scope.join = function(role_name){
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + role_name);
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
    var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role/" + role_name);
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
 * @name angularFireHangoutApp.controller:StatusbarCtrl
 * @description
 * # StatusbarCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('StatusbarCtrl',["$scope", function ($scope) {

  	$scope.status_intro = "status_bar_element";
  	$scope.status_prep = "status_bar_element";
  	$scope.status_debate = "status_bar_element_selected";
  	$scope.status_reflec = "status_bar_element";
  	$scope.status_complete = "status_bar_element_last";




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
			var title_len = $scope.data.motion.length;
			if(title_len == 0){
				$scope.motion_sentence = "motion_sentence_Red_xlarge";
  				$scope.data.motion = "input motion here";
  				$scope.data.motion_exist = false;
			}else if(title_len < 60 ){
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
 * @name angularFireHangoutApp.ParticipantMgrService
 * @description
 * # ParticipantMgrService
 * Factory in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
.factory('ParticipantMgrService',['MixideaSetting','$timeout', function (MixideaSetting, $timeout) {


  var root_ref = new Firebase(MixideaSetting.firebase_url);

  var ParticipantMgr_Object = new Object();
  ParticipantMgr_Object.debate_style = null;
  ParticipantMgr_Object.participant_obj = new Object();
  ParticipantMgr_Object.own_group = null;
  ParticipantMgr_Object.participant_obj_bp_open = new Object();
  ParticipantMgr_Object.participant_obj_bp_close = new Object();
  ParticipantMgr_Object.audience_array = new Array();
  ParticipantMgr_Object.is_audience_yourself = true;


  var game_role_obj = new Object();
  var user_object_data = new Object();
  var debate_style = null;
  var full_participants_object = new Object();
  var mapping_object = new Object();
  var total_number_participants = 0;
  var role_group_name_mappin = new Object();



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

    user_object_data= new Object();
    total_number_participants = 0
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
      user_object_data[user_key] = user_obj;
      var user_object_data_len = check_object_length(user_object_data);
      if(user_object_data_len == total_number_participants){
        update_ParticipantMgr_Object();
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  function check_object_length(obj){
    var len = 0;
    for(var key in obj){
      len++
    }
    return len;
  }



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


  var role_participants_ref = root_ref.child("event_related/participants/" + MixideaSetting.event_id + "/game_role");
  role_participants_ref.on("value", function(snapshot) {
    var value  = snapshot.val();
    if(value){
      game_role_obj  = value;
    }else{
      game_role_obj = new Object()
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
              team:'Gov',
              login:false,
              css_style:"no_applicant"
            },
            LO:{
              user_name:'no applilcant',
              profile_pict:no_applicant_img,
              applicant:false,
              id:null,
              team:'Gov',
              login:false,
              css_style:"no_applicant"
            }
          }
          ParticipantMgr_Object.audience_array.length=0;
        break;
        case "Asian":

        break;
        case "BP":
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
              team:'Aud',
              login:false,
              css_style:"logoff"
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
        if(user_object_data[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].user_name = user_object_data[user_id].first_name;
          ParticipantMgr_Object.participant_obj[role_key].profile_pict = user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.participant_obj[role_key].css_style = "logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.participant_obj[role_key].css_style = "login";
          ParticipantMgr_Object.participant_obj[role_key].login = true;
        }
      }
      for( var i=0; i< ParticipantMgr_Object.audience_array.length; i++ ){

        var user_id =  ParticipantMgr_Object.audience_array[i].id;
        if(user_object_data[user_id]){
          ParticipantMgr_Object.audience_array[i].user_name = user_object_data[user_id].first_name;
          ParticipantMgr_Object.audience_array[i].profile_pict = user_object_data[user_id].profile_pict;
          ParticipantMgr_Object.audience_array[i].applicant = true;
          ParticipantMgr_Object.audience_array[i].css_style = "logoff";
        }
        if(mapping_object[user_id]){
          ParticipantMgr_Object.audience_array[i].css_style = "login";
        }
      }
    });

  }



  ParticipantMgr_Object.get_hangout_id = function(){

  }

  ParticipantMgr_Object.get_user_info = function(){

  }





    return ParticipantMgr_Object;
}]);
