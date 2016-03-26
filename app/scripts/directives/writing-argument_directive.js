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
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;
        scope.element = element;
        scope.participant_mgr = ParticipantMgrService;


        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = root_ref.child(argument_content_path);

/*title management*/
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


/*content management*/
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


/*refute management*/
        var refute_ref = argument_content_ref.child("refute");
        refute_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.refute = snapshot.val();
            scope.refute_div = UtilService.add_linebreak_html(scope.refute);
            update_refute_height()

          });
        }); 
        function update_refute_height(){
            $timeout(function(){
              var refute_div_element = scope.element[0].getElementsByClassName("Refute_Content");
              var refute_div_height = refute_div_element[0].offsetHeight;
              refute_div_height = refute_div_height + 15;
              refute_div_height = String(refute_div_height) + "px";
              scope.refute_height = {height:refute_div_height};
            });
        }

        scope.change_refute = function(){
          var refute = scope.refute;
          refute_ref.set(refute);
        }


/*** focus***/
        var argument_focused_path = "event_related/Article_Context/" + event_id + "/focused/" 
                + arg_id;
        var argument_focused_ref = root_ref.child(argument_focused_path);


/*title focus*/
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
        }
        scope.title_save = function(){
          title_own_focused_ref.set(null);
        }
        title_own_focused_ref.onDisconnect().remove();




/*content focus*/
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
        }
        scope.save_content = function(){
         content_own_focused_ref.set(null);
        }
        content_own_focused_ref.onDisconnect().remove();


/*refute focus*/

        var refute_focused_ref = argument_focused_ref.child("refute");
        refute_focused_ref.on("value", function(snapshot){
         $timeout(function(){
            var focused_user_obj = snapshot.val();
            scope.writing_refute_byothers = false; 
            for(var key in focused_user_obj){
              if(key != MixideaSetting.own_user_id){
                scope.writing_refute_byothers = true;
                scope.others_id_refute = key;
              }
            }
            if(scope.writing_refute_byothers){
              scope.show_hide_refute_textarea = "child_hide";
              scope.show_hide_refute_context = "child_show";
            }else{
              scope.show_hide_refute_textarea = "child_show";
              scope.show_hide_refute_context = "child_hide";
            }
          });
        }); 
        var refute_own_focused_ref = argument_focused_ref.child("refute/" + MixideaSetting.own_user_id);

        scope.refute_unfocused = function(){
         refute_own_focused_ref.set(null);
        }

        scope.refute_focused = function(){
          refute_own_focused_ref.set(true);

        }


/*removing this argument*/

        var one_argument_id_path = "event_related/Article_Context/" + event_id + "/identifier/" 
                + deb_style + "/" + team + "/arguments/" + arg_id;
        var one_argument_id_ref = root_ref.child(one_argument_id_path);
        scope.remove_argument = function(){
          one_argument_id_ref.set(null);
        }

        scope.$on("$destroy", function() {
          title_ref.off("value");
          content_ref.off("value");
          refute_ref.off("value");

          title_focused_ref.off("value");
          content_focused_ref.off("value");
          refute_focused_ref.off("value");
          
          title_own_focused_ref.set(null);
          content_own_focused_ref.set(null);
          refute_own_focused_ref.set(null);
        });




      }
    };
  }]);

