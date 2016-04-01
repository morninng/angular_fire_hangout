'use strict';

/**
 * @ngdoc function
 * @name angularFireHangoutApp.controller:UrlSharingCtrl
 * @description
 * # UrlSharingCtrl
 * Controller of the angularFireHangoutApp
 */
angular.module('angularFireHangoutApp')
  .controller('UrlSharingCtrl',['$scope','$http','MixideaSetting','$timeout', function ($scope, $http, MixideaSetting, $timeout) {


	$scope.ogp_data_array = new Array();
  $scope.url_share = null;


	// var root_ref = new Firebase(MixideaSetting.firebase_url);
	var url_ref = global_firebase_root_ref.child("event_related/url_link/" + MixideaSetting.event_id)

	url_ref.on("child_added", function(snapshot, prevChildKey) {
		var url_id = snapshot.key();
		console.log(url_id);
		retrieve_ogp_data(url_id);
	});

  $scope.input_url_Key = function(e){
    if (e.which == 13) {
      share_url();
    }
  }
  $scope.click_share = function(){
    share_url();
  }

  function share_url(){
    var str_url = $scope.str_url;
    $scope.str_url = null;
    var is_url = is_valid_Url(str_url);
    if(is_url){
      $http({
        method: 'Get',
        url: MixideaSetting.recording_domain + 'set_ogp',
        params: {
          url: str_url,
          event_id: MixideaSetting.event_id 
        }
      }).success(function(data){
        console.log('success ' + data);
      }).error(function(err){
        console.log(err);
      })
    }
  }



	function is_valid_Url(s) {
    var regexp = /((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/; 
    return s.indexOf(' ') < 0 && regexp.test(s);
}

	 

	function retrieve_ogp_data(url_id){

    var ogp_content_ref = global_firebase_root_ref.child("url_related/url/" + url_id);
    ogp_content_ref.on("value", function(snapshot) {
      var ogp_obj  = snapshot.val();

      $timeout(function() {
        $scope.ogp_data_array.push(ogp_obj)
      });

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

	}

  $scope.$on("$destroy", function() {
    url_ref.off("child_added");
  });


  }]);
