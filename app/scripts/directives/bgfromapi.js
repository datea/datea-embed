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
        , imgType
        , imgSize
        , defaultImg
			  , setImg
			  ;

      imgType = attrs.imgType;
      imgSize = attrs.imgSize || 'cover';

      if (imgType === 'user') {
        defaultImg = config.defaultImgProfile;
      }else if (imgType === 'campaign') {
        defaultImg = config.defaultImgCampaign;
      }else {
        defaultImg = config.defaultImgBackground;
      }

			setImg = function () {
				img = attrs.bgFromApi ? config.api.imgUrl + attrs.bgFromApi : defaultImg;
			};

			attrs.$observe( 'bgFromApi', function () {
				setImg();
				element.css( { 'background': 'url('+img+') no-repeat center center'
				             , 'background-size': imgSize
				             } );
			} );
		}
	};
});
