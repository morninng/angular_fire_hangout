'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TeamchatCtrl
 * @description
 * # TeamchatCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TeamchatCtrl',["$scope","MixideaSetting","ParticipantMgrService","$timeout", function ($scope, MixideaSetting, ParticipantMgrService, $timeout) {



  	$scope.chat_text_input = new Object();
  	$scope.participant_mgr = ParticipantMgrService;
  	var team_chat_ref = null;
  	var team_chat_ref = null;
  	$scope.chat_message_array = new Array();
  	console.log("team chat control");
  	$scope.show_body = true;


	var own_group = ParticipantMgrService.own_group;

	$scope.$watch('participant_mgr.own_group', 
		function(newValue, oldValue){

			if(team_chat_ref){
				team_chat_ref.off();
				$scope.chat_message_array.length=0;
			}

			own_group = newValue;
			start_listen_message();


		}
	);

	function start_listen_message(){

		if(own_group){
			team_chat_ref = global_firebase_root_ref.child("event_related/team_chat/" + MixideaSetting.event_id + "/" + own_group);
			team_chat_ref.on("child_added", function(snapshot, prevChildKey){

				var message_obj = snapshot.val();
				if(message_obj.user == MixideaSetting.own_user_id){
					message_obj.position = "chat_msg_own";
				}else{
					message_obj.position = "chat_msg_other";
				}
				$scope.chat_message_array.push(message_obj);
				$scope.show_body = true;
		        $timeout(function() {
		          var scroller = document.getElementsByClassName("msg_body")[0];
		          scroller.scrollTop = scroller.scrollHeight;
		        }, 0,true);

			})
		}


	}



 	$scope.chat_keyup = function(e){

  		if(e.which==13){

			var message = $scope.chat_text_input.message;
			var message_obj = {
				context: message,
				user: MixideaSetting.own_user_id
			};
			console.log(message_obj);
			team_chat_ref.push(message_obj);
			$scope.chat_text_input.message = null;

		}
  	}

    $scope.click_header = function(){
    	console.log("click header");
    	$scope.show_body = !$scope.show_body;

    }



    $scope.$on("$destroy", function handler() {
    	console.log("team discussion finalize");

		if(team_chat_ref){
			team_chat_ref.off();
			chat_message_array.length=0;
		}
    });




  }]);
