'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.MixideaHangoutSetting
 * @description
 * # MixideaHangoutSetting
 * Constant in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .constant('MixideaSetting', {
  	firebase_url: "https://mixidea.firebaseio.com/",
  	teamdiscuss_app_id: '211272797315',
  	source_domain: 'https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/',
  	own_user_id: 'aa',
  	event_id: 'bb'
  });

