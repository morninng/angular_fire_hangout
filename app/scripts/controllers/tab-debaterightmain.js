'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:TabDebaterightmainCtrl
 * @description
 * # TabDebaterightmainCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('TabDebaterightmainCtrl',['$scope','ParticipantMgrService','$state', function ( $scope ,ParticipantMgrService, $state) {


  	$scope.participant_mgr = ParticipantMgrService;

	$scope.$watch('participant_mgr.own_group',function(){goto_child_state();} );
	$scope.$watch('participant_mgr.is_audience_or_debater',function(){goto_child_state();} );

	function goto_child_state(){
	  	var own_group = $scope.participant_mgr.own_group;
	  	var is_audience_or_debater =  $scope.participant_mgr.is_audience_or_debater
		if(own_group && is_audience_or_debater){
			if(is_audience_or_debater == "debater"){
				$state.go('main.debate.prep_note');
			}else{
				$state.go('main.debate.own_note');
			}
		}
	}

	goto_child_state();



  }]);
