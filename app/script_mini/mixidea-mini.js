"use strict";angular.module("angularFireHangoutApp",["ngAnimate","ui.router","firebase"]),angular.module("angularFireHangoutApp").run(["$state",function(a){console.log("initial state"),a.go("main.intro")}]),angular.module("angularFireHangoutApp").config(["$stateProvider",function(a){console.log("state provider is called"),a.state("main",{views:{RootView:{templateUrl:"https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/views/main/main_room_layout.html"}}}).state("main.intro",{views:{container_top:{templateUrl:"https://s3.amazonaws.com/mixideahangoutsource/angular_fire_hangout/app/views/common/title.html",controller:"TitleMgrCtrl"}}})}]),angular.module("angularFireHangoutApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("angularFireHangoutApp").controller("TitleMgrCtrl",["$scope",function(a){a.title="aaa"}]);