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
