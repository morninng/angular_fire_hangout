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
  .run(['$state', function($state) {

  	console.log("initial state");
	 $state.go('main.intro');

}]);
 

angular.module('angularFireHangoutApp')
  .config(['$stateProvider','MixideaSetting', function($stateProvider, MixideaSetting ) {

  	console.log("state provider is called");

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
			"container_top":{
			templateUrl: MixideaSetting.source_domain + 'views/common/title.html',
			controller: 'TitleMgrCtrl'
			}
		}
	})

}]);
