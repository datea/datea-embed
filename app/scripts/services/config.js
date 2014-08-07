'use strict';

/**
 * @ngdoc service
 * @name dateaEmbedApp.config
 * @description
 * # config
 * Constant in the dateaEmbedApp.
 */

angular.module('dateaEmbedApp')
.constant('config',
{ app : { name : 'Datea.pe/embed'
        , url  : 'http://localhost:9000/#/'
        , redirUrl : 'http://datea-webapp.herokuapp.com/#/'
        }
, api : { url    : 'http://173.255.200.68/api/v2/'
        , imgUrl : 'http://173.255.200.68/'
        }
, charts : { pie : { title       : 'Estadísticas'
                   , tooltips    : true
                   , labels      : true
                   , legend      : { display  : true
                                   , position : 'right'
                                   }
                   , innerRadius : 0
                   }
           , bar : { title    : 'Estadísticas'
                   , tooltips : true
                   , labels   : false
                   , legend   : { display  : true
                                , position : 'right'
                                }
                   }
           }
, centerFix : { point     : [200,0]
              , topToDiff : 180
              }
// // Already in Piecluster config
// , customClustering : { defaultColor         : '#28BC45'
//                      , defaultColor1        : '#CCC'
//                      , clusterIconClassName : 'marker-cluster'
//                      , polygonOptions : { weight      : 1
//                                         , fillColor   : '#999'
//                                         , color       : '#999'
//                                         , fillOpacity : 0.4
//                                         }
//                      }
, customSVGIcon : { defaultColor : '#28BC45'
                  , className    : 'datea-pin-icon'
                  }
, defaultMap : { bounds      : [ [ -12.0735, -77.0336 ], [ -12.0829, -77.0467 ] ]
               , center      : { lat: -12.05, lng: -77.06, zoom: 13 }
               , defaults    : { scrollWheelZoom: false }
               , markers     : {}
               , defaultIcon : {}
               , focusedIcon : { type: 'awesomeMarker', icon: 'tag', markerColor: 'red' }
               }
, defaultImgProfile           : 'images/globals/user-profile-default.png'
, defaultImgBackground        : 'images/globals/bg-default.jpg'
, defaultCenterFix            : [200,0]
, defaultStopClusteringAtZoom : 16
, legend : { holderHeight : 20
           , showMsg      : 'mostrar'
           , hideMsg      : 'ocultar'
           , msgClassname : 'expand-text'
           }
} );