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
  .config(['$stateProvider', function($stateProvider ) {

  	console.log("state provider is called");

	$stateProvider
	.state('main', {
		views:{
			"RootView":{
				templateUrl: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/views/main/main_room_layout.html'
			}
		}
	})
	.state('main.intro', {
		views:{
			"container_top":{
			templateUrl: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/views/common/title.html',
			controller: 'TitleMgrCtrl'
			}
		}
	})


}]);

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TitleMgrCtrl
 * @description
 * # TitleMgrCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TitleMgrCtrl',['$scope', function ($scope) {

  	$scope.title="aaa";


  }]);
