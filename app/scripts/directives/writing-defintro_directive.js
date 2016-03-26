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

        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var defintro_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id + "/" + "content";
        var defintro_content_ref = root_ref.child(defintro_content_path);

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
        var defIntro_focused_ref = root_ref.child(defIntro_focused_path)

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
