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

  	console.log("mixidea setting")
  	console.log(MixideaSetting)

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

