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
        , url  : 'http://embed.datea.pe/'
        , redirUrl : 'http://datea.pe/#!/'
        }
, api : { url    : 'https://api.datea.io/api/v2/'
        , imgUrl : 'https://api.datea.io'
        /*  url    : 'http://127.0.0.1:8000/api/v2/'
        , imgUrl : 'http://127.0.0.1:8000'*/
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
, customSVGIcon : { defaultColor  : '#28BC45'
                  , className     : 'datea-pin-icon'
                  , markerSvgPath : 'M14.087,0.485c-7.566,0-13.694,6.133-13.698,13.695c0.027,3.938,2.02,8.328,4.637,10.878'
                                  + 'c2.615,3.363,6.536,8.889,6.488,11.033v0.07c0,4.195,0.364,3.92,0.4,4.051c0.128,0.441,0.527,0.746,0.99,0.746h2.179'
                                  + 'c0.464,0,0.858-0.309,0.983-0.74c0.04-0.137,0.407,0.139,0.411-4.057c0-0.039-0.004-0.059-0.004-0.068'
                                  + 'c-0.038-2.047,3.399-7.35,6.109-10.877c2.875-2.498,5.175-6.814,5.196-11.035C27.779,6.618,21.65,0.485,14.087,0.485z'
                  , markerWidth   : 29
                  , markerHeight  : 42
                  }
, defaultMap : { bounds      : [ [ -12.0735, -77.0336 ], [ -12.0829, -77.0467 ] ]
               , center      : { lat: -12.05, lng: -77.06, zoom: 13 }
               , defaults    : { scrollWheelZoom: false
                               , zoomControlPosition: 'topright' }
               , markers     : {}
               , defaultIcon : {}
               , focusedIcon : { type: 'awesomeMarker', icon: 'tag', markerColor: 'red' }
               , tiles    : { url     : 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png'
                            , options : { attribution : 'Tiles by <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                                        , subdomains  : ['otile1','otile2','otile3','otile4']
                                        }
                            }
               }
, defaultImgProfile           : 'images/globals/user-default.png'
, defaultImgCampaign          : 'images/globals/iniciativa-default.png'
, defaultImgBackground        : 'images/globals/bg-default.jpg'
, defaultCenterFix            : [200,0]
, defaultStopClusteringAtZoom : 16
, defaultDateFormat : 'd \'de\' MMMM yyyy - H:mm'
, legend : { holderHeight : 20
           , showMsg      : 'mostrar'
           , hideMsg      : 'ocultar'
           , msgClassname : 'expand-text'
           }
} );
