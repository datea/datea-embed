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
	  , parseTagsNamesFromDateo
	  , resetAllMarkerIcons
	  ;

	buildMarkerIcon = function ( givens ) {
		var catWidth
		  , colors        = []
		  , dateo         = givens && givens.dateo
		  , html
		  , secondaryTags = givens && givens.secondaryTags
		  ;

		angular.forEach( dateo.tags, function ( value, key ) {
			!!secondaryTags[value.tag] && ( colors.push( secondaryTags[value.tag].color ) );
		});

		colors.length || ( colors.push( config.customSVGIcon.defaultColor ) );
		catWidth = ( 29 / colors.length );

		// html = '<svg width="29" height="40"><g style="clip-path: url(#pinpath);">';
		html = '<svg width="29" height="40"><g style="clip-path: url(#pinpath);">';
		angular.forEach( colors, function ( color, i ) {
			html = html + '<rect height="40" width="'+catWidth+'" fill="'+color+'" x="'+(i*catWidth)+'" />';
		});
		html = html + '<circle class="datea-svg-marker-circle" data-datea-svg-circle-id="'+givens.dateo.id+'" cx="14.5" cy="14" r="5" fill="white" />' + '</g></svg>';

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
		var id = +$(marker.html).find('circle').data('datea-svg-circle-id');
		$timeout( function () {
			$('[data-datea-svg-circle-id="'+id+'"]').attr('style','fill:#D62728!important;');
		}, 200 );
		return marker;
	};

	resetAllMarkerIcons = function () {
		$('.datea-svg-marker-circle').removeAttr('style');
	};

	filterCampaignTagsFromDateo = function ( givens ) {
		var filteredTags = []
		  , dateoTags    = givens && givens.tags
		  , campaignTags = givens && givens.campaignTags
		  ;

		angular.forEach( dateoTags, function ( value, key ) {
			!!campaignTags[ value.tag ] && ( filteredTags.push( '#'+value.tag ) );
		});

		return filteredTags;
	};

	parseTagsNamesFromDateo = function ( givens ) {
		var tagsNames = []
		  , dateoTags = givens && givens.tags
		  ;
		angular.forEach( dateoTags, function ( value, key ) {
			tagsNames.push( value.tag );
		});
		return tagsNames;
	};

	parseFromApi = function ( givens ) {
		// givens : { dateos, campaign }
		var markers           = {}
		  , sessionMarkersIdx = 0
		  , dateos            = givens.dateos
		  , campaign          = givens.campaign
		  , colors            = givens && givens.colors
		  , markersBounds     = []
		  ;

		angular.forEach( dateos, function ( value ) {
			// Defaults
			value.user.image_small = value.user.image_small
			? value.user.image_small
			: config.defaultImgProfile;
			value._prettyDate = $filter('date')( value.date, 'fullDate' );
			// Build Marker
			markers['marker'+sessionMarkersIdx] = {
			  lat         : value.position.coordinates[1]
			, lng         : value.position.coordinates[0]
			, group       : campaign.main_tag.tag
			, label       : { message: filterCampaignTagsFromDateo( { tags: value.tags, campaignTags: colors } ).join(',') }
			// , message     : $interpolate( config.marker )(value)
			, draggable   : false
			, focus       : false
			, icon        : buildMarkerIcon( { dateo: value, secondaryTags: colors } )
			, riseOnHover : true
			, _tags       : parseTagsNamesFromDateo( { tags: value.tags } )
			, _id         : value.id
			};
			// console.log( 'Marker labels', filterCampaignTagsFromDateo( { tags: value.tags, campaignTags: colors } ).join(','), colors );
			sessionMarkersIdx += 1;
			markersBounds.push( [ value.position.coordinates[1], value.position.coordinates[0] ] );
		});
		return { markers           : markers
		       , markersBounds     : markersBounds
		       , sessionMarkersIdx : sessionMarkersIdx
		       };
	};

	return { parseFromApi                : parseFromApi
	       , filterCampaignTagsFromDateo : filterCampaignTagsFromDateo
	       , parseTagsNamesFromDateo     : parseTagsNamesFromDateo
	       , buildMarkerFocusedIcon      : buildMarkerFocusedIcon
	       , resetAllMarkerIcons         : resetAllMarkerIcons
	       };
});
