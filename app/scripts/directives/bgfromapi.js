'use strict';

/**
 * @ngdoc directive
 * @name dateaEmbedApp.directive:bgFromApi
 * @description
 * # bgFromApi
 */
angular.module('dateaEmbedApp')
.directive('bgFromApi', function ( config ) {
	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
			var img
			  , setImg
			  ;

			setImg = function () {
				img = attrs.bgFromApi ? config.api.imgUrl + attrs.bgFromApi : config.defaultImgBackground;
			};

			attrs.$observe( 'bgFromApi', function () {
				setImg();
				element.css( { 'background': 'url('+img+') no-repeat center center'
				             , 'background-size': 'cover'
				             } );
			} );
		}
	};
});
