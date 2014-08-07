'use strict';

/**
* @ngdoc overview
* @name dateaEmbedApp
* @description
* # dateaEmbedApp
*
* Main module of the application.
*/
angular
.module('dateaEmbedApp', [
  'ngAnimate'
, 'ngCookies'
, 'ngResource'
, 'ngRoute'
, 'ngSanitize'
, 'ngTouch'
, 'ui.bootstrap'
, 'leaflet-directive'
, 'angularCharts'
, 'daPiecluster'
])
.config(function ($routeProvider) {
	$routeProvider
	.when('/:campaignName',
	{ templateUrl: 'views/main.html'
	, controller: 'MainCtrl'
	})
	.otherwise( { redirectTo: '/' } );
});
