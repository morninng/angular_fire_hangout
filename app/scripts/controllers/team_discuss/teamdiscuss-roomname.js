'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TeamdiscussRoomnameCtrl
 * @description
 * # TeamdiscussRoomnameCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TeamdiscussRoomnameCtrl', ['$scope','MixideaSetting',  function ($scope, MixideaSetting) {

	$scope.room_name = MixideaSetting.team_discuss_team_side;

  }]);
