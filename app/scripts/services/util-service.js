'use strict';

/**
 * @ngdoc service
 * @name angularFireHangoutApp.UtilService
 * @description
 * # UtilService
 * Service in the angularFireHangoutApp.
 */
angular.module('angularFireHangoutApp')
  .service('UtilService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function


  	this.get_full_role_name = function(role){

  		switch (role){
  			case "PM":
  			return "Prime Minister";
  			break;

  			case "LO":
  			return "Leader Opposition";
  			break;

  			case "MG":
  			return "Member Government";
  			break;

  			case "MO":
  			return "Member Opposition";
  			break;

  			case "PMR":
  			return "Prime Minister Reply";
  			break;

  			case "LOR":
  			return "Leader Opposition Reply";
  			break;


  			case "DPM":
  			return "Depty Prime Minister";
  			break;

  			case "DLO":
  			return "Depty Leader Opposition";
  			break;

  			case "WG":
  			return "Whip Government";
  			break;

  			case "WO":
  			return "Whip Opposition";
  			break;

  			case "GW":
  			return "Govenment Whip";
  			break;

  			case "OW":
  			return "Opposition Whip";
  			break;


  			default: 
          	return ""
          	break;
  		}
  	};


    this.add_linebreak_html = function(context){
      if(!context){
        return null;
      }
      var converted_context = context.split("<").join("&lt;");
      converted_context = converted_context.split(">").join("&gt;");
      converted_context = converted_context.split("\n").join("<br>");

      return converted_context;
    }






  });
