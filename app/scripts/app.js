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
