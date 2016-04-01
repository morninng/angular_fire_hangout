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
