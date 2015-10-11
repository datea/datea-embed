'use strict';

/**
 * @ngdoc service
 * @name dateaEmbedApp.Marker
 * @description
 * # Marker
 * Service in the dateaEmbedApp.
 */
angular.module('dateaEmbedApp')
.service('Marker', function Marker( config, $filter, $timeout ) {
	var buildMarkerIcon
	  , buildMarkerFocusedIcon
	  , parseFromApi
	  , filterCampaignTagsFromDateo
	  , resetAllMarkerIcons
    , idxToDateoId
	  ;

	buildMarkerIcon = function ( givens ) {
		var catWidth
		  , colors        = []
		  , dateo         = givens && givens.dateo
		  , html
		  , secondaryTags = givens && givens.secondaryTags
		  ;

		angular.forEach( dateo.tags, function ( tag ) {
			!!secondaryTags[tag] && ( colors.push( secondaryTags[tag].color ) );
		});

		colors.length || ( colors.push( config.customSVGIcon.defaultColor ) );
		catWidth = ( 29 / colors.length );

    html = '<svg width="'+config.customSVGIcon.markerWidth+'" height="'+config.customSVGIcon.markerHeight+'"><g style="clip-path: url(#pinpath);">';
    angular.forEach(colors, function (color, i) {
      html = html + '<rect height="'+config.customSVGIcon.markerHeight+'" width="'+parseInt(Math.ceil(catWidth))+'" fill="'+color+'" x="'+parseInt(Math.ceil(i*catWidth))+'" />';
    });
    html = html
         + '<circle cx="14.5" cy="13" r="4" fill="white" />'
         + '<path class="datea-svg-marker-border datea-svg-marker-border-'+givens.dateo.id+'" d="'+config.customSVGIcon.markerSvgPath+'" stroke="#777777" fill="none" stroke-width="0" />'
         + '</g></svg>';

		return { type        : 'div'
		       , iconSize    : [29, 40]
		       , iconAnchor  : [14.5, 40]
		       , popupAnchor : [0, -33]
		       , labelAnchor : [8, -25]
		       , html        : html
		       , className   : config.customSVGIcon.className
		       };
	};

	buildMarkerFocusedIcon = function ( marker ) {
    var id = marker._id;
		$timeout( function () {
			$('.datea-svg-marker-border-'+id).attr('stroke','white').attr('stroke-width', '2');
		}, 200 );
		return marker;
	};

	resetAllMarkerIcons = function () {
		$('.datea-svg-marker-border').attr('stroke', '#777777').attr('stroke-width', 0);
	};

	filterCampaignTagsFromDateo = function ( givens ) {
		var filteredTags = []
		  , dateoTags    = givens && givens.tags
		  , campaignTags = givens && givens.campaignTags
		  ;

		angular.forEach( dateoTags, function ( tag ) {
			!!campaignTags[ tag ] && ( filteredTags.push( '#'+tag ) );
		});

		return filteredTags;
	};

	parseFromApi = function ( givens ) {
		// givens : { dateos, campaign }
		var markers           = {}
		  , sessionMarkersIdx = 0
		  , dateos            = givens.dateos
		  //, campaign          = givens.campaign
		  , colors            = givens && givens.colors
		  , markersBounds     = []
		  ;

		angular.forEach( dateos, function ( value ) {
			// Defaults
			value.user.image_small = value.user.image_small ? value.user.image_small : config.defaultImgProfile;
			value._prettyDate = $filter('date')( value.date, 'fullDate' );
			// Build Marker
			markers['marker'+sessionMarkersIdx] = {
			  lat         : value.position.coordinates[1]
			, lng         : value.position.coordinates[0]
			, group       : 'embedCluster'
			, label       : { message: filterCampaignTagsFromDateo( { tags: value.tags, campaignTags: colors } ).join(',') }
			// , message     : $interpolate( config.marker )(value)
			, draggable   : false
			, focus       : false
			, icon        : buildMarkerIcon( { dateo: value, secondaryTags: colors } )
			, riseOnHover : true
			, _tags       : value.tags
			, _id         : value.id
			};
			// console.log( 'Marker labels', filterCampaignTagsFromDateo( { tags: value.tags, campaignTags: colors } ).join(','), colors );
			sessionMarkersIdx += 1;
			markersBounds.push( [ value.position.coordinates[1], value.position.coordinates[0] ] );
		});
		return { markers           : markers
		       , markersBounds     : markersBounds
		       , sessionMarkersIdx : sessionMarkersIdx
           , idxToDateoId      : idxToDateoId
		       };
	};

	return { parseFromApi                : parseFromApi
	       , filterCampaignTagsFromDateo : filterCampaignTagsFromDateo
	       , buildMarkerFocusedIcon      : buildMarkerFocusedIcon
	       , resetAllMarkerIcons         : resetAllMarkerIcons
	       };
});
