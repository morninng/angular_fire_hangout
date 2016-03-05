'use strict';

/**
 * @ngdoc directive
 * @name angularFireHangoutApp.directive:oneDefintro
 * @description
 * # oneDefintro
 */
angular.module('angularFireHangoutApp')
  .directive('oneDefintro',["$timeout","MixideaSetting",  function ($timeout,MixideaSetting) {
    return {
      templateUrl: 'views/common/oneDefintro.html',
      restrict: 'E',
      scope: {
      	argument_id_obj: '=argId'
      },
      link: function postLink(scope, element, attrs) {
      	
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;

        var root_ref = new Firebase(MixideaSetting.firebase_url);
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = root_ref.child(argument_content_path);

        var content_ref = argument_content_ref.child("content");
        content_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.content = snapshot.val();
          });
        }); 
        scope.change_content = function(){
        	var content = scope.content;
          content_ref.set(content);
        }
      }
    };
  }]);
