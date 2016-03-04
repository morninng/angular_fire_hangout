'use strict';

/**
 * @ngdoc directive
 * @name angularFireHangoutApp.directive:oneArgument
 * @description
 * # oneArgument
 */
angular.module('angularFireHangoutApp')
  .directive('oneArgument', function ($timeout) {
    return {
      templateUrl: 'views/common/oneArgument.html',
      restrict: 'E',
      scope: {
      	argument_id_obj: '=argId'
      },
      link: function postLink(scope, element, attrs) {
        console.log("link is called");
        console.log(scope.argument_id_obj);
        var arg_id = scope.argument_id_obj.arg_id;
        var event_id = scope.argument_id_obj.event_id;
        var deb_style = scope.argument_id_obj.deb_style;
        var team = scope.argument_id_obj.team;


        var root_ref = new Firebase("https://mixidea.firebaseio.com/");
        var argument_content_path = "event_related/Article_Context/" + event_id + "/context/" 
        				+ arg_id;
        var argument_content_ref = root_ref.child(argument_content_path);


        var title_ref = argument_content_ref.child("title");
        title_ref.on("value", function(snapshot){
          $timeout(function(){
            scope.title = snapshot.val();
          });
        }); 
        scope.change_title = function(){
          var title = scope.title;
          title_ref.set(title);
        }


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


        var one_argument_id_path = "event_related/Article_Context/" + event_id + "/identifier/" 
                + deb_style + "/" + team + "/arguments/" + arg_id;
        var one_argument_id_ref = root_ref.child(one_argument_id_path);
        scope.remove_argument = function(){
          console.log("remove" + arg_id);
          one_argument_id_ref.set(null);
        }
      }
    };
  });
