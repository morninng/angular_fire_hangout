"use strict";angular.module("angularFireHangoutApp",["ngAnimate","ui.router","firebase"]),angular.module("angularFireHangoutApp").run(["$state","MixideaSetting",function(a,b){console.log("event id:"+b.event_id),console.log("user id : "+b.own_user_id),console.log("room type : "+b.room_type),a.go("main.intro")}]),angular.module("angularFireHangoutApp").config(["$stateProvider","MixideaSetting",function(a,b){a.state("main",{views:{RootView:{templateUrl:b.source_domain+"views/main/main_room_layout.html"}}}).state("main.intro",{views:{container_top:{templateUrl:b.source_domain+"views/common/title.html",controller:"TitleMgrCtrl"}}})}]),angular.module("angularFireHangoutApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("angularFireHangoutApp").controller("TitleMgrCtrl",["$scope",function(a){a.title="aaa"}]);