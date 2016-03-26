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


        scope.$on("$destroy", function() {
            content_own_focused_ref.set(null);
            content_ref.off("value");
            content_focused_ref.off("value");
        });


      }
    };
  }]);
