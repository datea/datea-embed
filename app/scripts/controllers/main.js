'use strict';

/**
 * @ngdoc function
 * @name dateaEmbedApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dateaEmbedApp
 */

angular.module('dateaEmbedApp')
.controller('MainCtrl', function ($scope, config, Api, Marker, leafletData, $routeParams, $q, leafletEvents, leafletLayerHelpers, $timeout, $window, $document, Piecluster) {

	var lastMarkerWithFocus
	  , lastMarkerIcon
	  , markersFromApi
	  , secondaryTags    = []
	  , statsData
	// fn declarations
	  , buildChart
	  , buildClusterIcon
	  , buildEmbed
	  , buildDateos
	  , buildDateosWithImages
	  , buildDateoInside
	  , buildStats
	  , buildTeaser
	  , focusMarker
	  , isMainTag
	  , keepInsidePanelOpen
	  , openSpiderfy
	  , parseSecondaryTags
	  , setupLegendTags
	  , resetMarkers
	  ;

	$scope.main                        = {};
	$scope.main.leaflet                = angular.copy( config.defaultMap );
	$scope.main.leaflet.clusterOptions = { disableClusteringAtZoom: config.defaultStopClusteringAtZoom };
	$scope.main.redirUrl               = config.app.redirUrl;
	$scope.main.chart                  = {};
	$scope.main.legend                 = {};

	// Chart Init
	$scope.main.chart.render           = {};
	$scope.main.chart.render.type      = 'pie';
	$scope.main.chart.render.data      = [];
	$scope.main.chart.render.series    = [];
	$scope.main.chart.render.config    = angular.copy( config.charts.pie );

	// Arrows Nav
	$scope.main.navArrows = {};
	lastMarkerWithFocus   = 0;

	// Loading
	$scope.main.loading = {};
	$scope.main.loading.campaignIsLoaded = true;
	$scope.main.loading.currentDateoInsideIsLoaded = true;

	// Nav
	$scope.main.nav                    = {};
	$scope.main.nav.showNaviconPanel   = false;
	$scope.main.nav.showInfoPanel      = false;
	$scope.main.nav.showInsidePanel    = false;
	$scope.main.nav.showSearchBoxPanel = false;
	$scope.main.nav.showTeaserPanel    = true;

	// Visualizations
	$scope.main.vis               = {};
	$scope.main.vis.showMap       = true;
	$scope.main.vis.showImg       = false;
	$scope.main.vis.showCharts    = false;
	$scope.main.vis.showTimeline  = false;
	$scope.main.vis.legend        = false;

	// Dateo with images vis
	$scope.main.dwi = {};

	// Search box
	$scope.main.searchBox = {};

	// Custom Clustering
	$scope.main.colorRange = d3.scale.category10().range();

	$scope.main.nav.resetPanels = function () {
		$scope.main.nav.showNaviconPanel   = false;
		$scope.main.nav.showInfoPanel      = false;
		$scope.main.nav.showInsidePanel    = false;
		$scope.main.nav.showSearchBoxPanel = false;
	};

	$scope.main.navArrows.next = function () {
		if ( markersFromApi.markers[ 'marker'+lastMarkerWithFocus ] ) {
			lastMarkerWithFocus = typeof lastMarkerWithFocus ===	'undefined' || lastMarkerWithFocus >= markersFromApi.markersBounds.length-1 ? 0 : lastMarkerWithFocus + 1;
			$scope.main.loading.currentDateoInsideIsLoaded = true;
			buildDateoInside( { id: markersFromApi.markers[ 'marker'+lastMarkerWithFocus ]._id } );
			focusMarker();
		}
	};

	$scope.main.navArrows.prev = function () {
		if ( markersFromApi.markers[ 'marker'+lastMarkerWithFocus ] ) {
			lastMarkerWithFocus = typeof lastMarkerWithFocus ===	'undefined' || lastMarkerWithFocus <= 0 ? markersFromApi.markersBounds.length-1 : lastMarkerWithFocus - 1;
			$scope.main.loading.currentDateoInsideIsLoaded = true;
			buildDateoInside( { id: markersFromApi.markers[ 'marker'+lastMarkerWithFocus ]._id } );
			focusMarker();
		}
	};

	$scope.main.searchBox.search = function () {
		resetMarkers();
		$scope.main.loading.campaignIsLoaded = true;
		$scope.main.nav.toggleSearchBoxPanel();
		if ( $scope.main.searchBox.keyword ) {
			buildDateos( { q: $scope.main.searchBox.keyword } );
			buildDateosWithImages( { q: $scope.main.searchBox.keyword } );
		} else {
			buildDateos();
			buildDateosWithImages();
		}
	};

	$scope.main.nav.toggleNaviconPanel = function () {
		$scope.main.nav.showNaviconPanel = $scope.main.nav.showNaviconPanel ? false : true;
	};

	$scope.main.nav.toggleInfoPanel = function () {
		$scope.main.nav.showInfoPanel = $scope.main.nav.showInfoPanel ? false : true;
		if ( $scope.main.nav.showInsidePanel ) {
			$scope.main.nav.showInsidePanel = false;
		}
	};

	$scope.main.nav.toggleInsidePanel = function () {
		$scope.main.nav.showInsidePanel = $scope.main.nav.showInsidePanel ? false : true;
	};

	$scope.main.nav.toggleSearchBoxPanel = function () {
		$scope.main.nav.showSearchBoxPanel = $scope.main.nav.showSearchBoxPanel ? false : true;
	};

	$scope.main.nav.closeInsidePanel = function () {
		$scope.main.nav.showInsidePanel = false;
	};

	$scope.main.dwi.openInsidePanel = function ( givens ) {
		buildDateoInside( { id: givens.id } );
		$scope.main.loading.currentDateoInsideIsLoaded = false;
	};

	// TODO: Needs a better visualization mgmt
	$scope.main.vis.showMapVisualization = function () {
		$scope.main.nav.closeInsidePanel();
		$scope.main.vis.showMap       = true;
		$scope.main.vis.showImg       = false;
		$scope.main.vis.showTimeline  = false;
		$scope.main.vis.showCharts    = false;
	};

	$scope.main.vis.showImgVisualization = function () {
		$scope.main.nav.closeInsidePanel();
		$scope.main.vis.showMap       = false;
		$scope.main.vis.showImg       = true;
		$scope.main.vis.showTimeline  = false;
		$scope.main.vis.showCharts    = false;
	};

	$scope.main.vis.showChartsVisualization = function () {
		$scope.main.nav.closeInsidePanel();
		$scope.main.vis.showMap       = false;
		$scope.main.vis.showImg       = false;
		$scope.main.vis.showTimeline  = false;
		$scope.main.vis.showCharts    = true;
		$scope.main.chart.render.loaded || buildChart( statsData );
	};

	$scope.main.toggleZoomImg = function ( givens) {
		$( givens.target ).toggleClass( 'dateo-img-lg' );
	};

	// leafletDirectiveMarker on click
	$scope.$on( 'leafletDirectiveMarker.click', function ( ev, data ) {
		buildDateoInside( { id: markersFromApi.markers[ data.markerName ]._id } );
		$scope.main.loading.currentDateoInsideIsLoaded = true;
		lastMarkerWithFocus = +data.markerName.replace('marker','');
		focusMarker( { noZoom: true } );
		console.log( 'on click lastMarkerWithFocus', lastMarkerWithFocus );
	} );

	// Fix zoom control
	$scope.$watch( 'main.nav.showInsidePanel', function () {
		var zoomControl = $('div.leaflet-control-container').find('div.leaflet-control-zoom');
		if ( $scope.main.nav.showInsidePanel ) {
			zoomControl.addClass( 'datea-zoom-control-fix' );
		} else {
			zoomControl.removeClass( 'datea-zoom-control-fix' );
		}
	} );

	// Watch Stats control type select
	$scope.$watch( 'main.chart.controlType', function () {
		if ( $scope.main.chart.render.loaded ) {
			$scope.main.chart.render.type = $scope.main.chart.controlType || 'pie';
			buildChart( { data: $scope.main.chart.data, type: $scope.main.chart.controlType } );
		}
	} );

	buildChart = function ( givens ) {
		var data = givens && givens.data.tags
		  , type = givens && givens.type
		  ;

		if ( type === 'pie' ) {
			$scope.main.chart.render.config = angular.copy( config.charts.pie );
			$scope.main.chart.render.data   = [];
			angular.forEach( data, function ( value ){
				$scope.main.chart.render.data.push( { x: '#'+value.tag, y: [value.count] } );
				$scope.main.chart.render.series.push( '#'+value.tag );
			});
		} else if ( type === 'bar' ) {
			$scope.main.chart.render.config = angular.copy( config.charts.bar );
			$scope.main.chart.render.data   = [ { x:'por etiquetas', y:[] } ];
			angular.forEach( data, function ( value ){
				$scope.main.chart.render.data[0].y.push( value.count );
				$scope.main.chart.render.series.push( '#'+value.tag );
			});
		}
		$scope.main.chart.render.loaded = true;
	};

	buildClusterIcon = function ( cluster ) {
		var children
		  , n
		  , d
		  , di
		  , r
		  , dataObj = {}
		  , data    = []
		  , html
		  , clusterIcon
		  , j
		  ;
		children = cluster.getAllChildMarkers();
		n        = children.length;
		d        = Piecluster.clusterSizeRange( children.length );
		di       = d + 1;
		r        = d / 2;

		angular.forEach( children, function ( marker ) {
			angular.forEach( marker.options._tags, function ( tag ) {
				if ( tag !== $scope.main.campaign.main_tag.tag && !!$scope.main.legend.secondaryTags[tag] ) {
					if ( angular.isDefined( dataObj[ tag ] ) ) {
						dataObj[ tag ].value = dataObj[ tag ].value + 1;
						dataObj[ tag ].ids.push( marker.options._id );
					} else {
						dataObj[ tag ] = { label: '#'+tag, value: 1, tag: tag, ids: [ marker.options._id ] };
					}
				}
			} );
		} );

		for ( j in dataObj ) {
			if ( dataObj.hasOwnProperty( j ) ) {
				data.push( dataObj[ j ] );
			}
		}

		html = Piecluster.makeSVGPie(
		{ n             : n
		, r             : r
		, d             : d
		, data          : data
		, campaign      : $scope.main.campaign
		, secondaryTags : $scope.main.legend.secondaryTags
		} );

		clusterIcon = new L.DivIcon(
		{ html      : html
		, className : Piecluster.pieclusterConfig.clusterIconClassName
		, iconSize  : new L.Point(di,di)
		} );

		return clusterIcon;
	};

	buildDateos = function ( givens ) {
		var getDateosGivens;
		// Default
		getDateosGivens =
		{ tags          : $routeParams.campaignName
		, is_geolocated : true
		};

		givens && givens.q && ( getDateosGivens.q = givens.q );

		Api.dateo.getDateos( getDateosGivens )
		.then( function ( response ) {
			var newCenter      = {}
			  ;
			$scope.main.dateos  = response.objects;
			// Parse Markers from Api
			console.log( '$scope.main.campaign', $scope.main.campaign );
			markersFromApi = Marker.parseFromApi( { dateos: response.objects, campaign: $scope.main.campaign, colors: $scope.main.legend.secondaryTags } );
			angular.extend( $scope.main.leaflet.markers, markersFromApi.markers );

			// New Center
			newCenter.lat  = markersFromApi.markers.marker0.lat;
			newCenter.lng  = markersFromApi.markers.marker0.lng;
			newCenter.zoom = config.defaultMap.center.zoom;
			angular.extend( $scope.main.leaflet.center, newCenter );

			// New Bounds
			leafletData.getMap('embedMap')
			.then( function ( map ) {
				map.fitBounds( markersFromApi.markersBounds );
				$scope.main.loading.campaignIsLoaded = false;
			} );
		} );
	};

	buildDateosWithImages = function ( givens ) {
		var getDateosGivens;
		// Default
		getDateosGivens =
		{ tags       : $routeParams.campaignName
		, has_images : 1
		};

		givens && givens.q && ( getDateosGivens.q = givens.q );

		Api.dateo.getDateos( getDateosGivens )
		.then( function ( response ) {
			$scope.main.dateosWithImages = response.objects;
		}, function ( reason ) {
			console.log( reason );
		} );
	};

	buildDateoInside = function ( givens ) {
		var dateoId = givens.id;
		Api.dateo.getDateos( { id: dateoId } )
		.then( function ( response ) {
			$scope.main.currentDateoInside = response.objects[0];
			keepInsidePanelOpen();
			$scope.main.loading.currentDateoInsideIsLoaded = false;
			// console.log( 'buildDateoInside', response.objects[0] );
		} );
	};

	buildEmbed = function () {
		// If we need more colors
		if( $scope.main.campaign.secondary_tags && $scope.main.campaign.secondary_tags.length > 10 ) {
			$scope.main.colorRange = d3.scale.category20().range();
		}
		// Build stuff
		buildDateos();
		buildTeaser();
		buildDateosWithImages();
		buildStats();
		parseSecondaryTags();
	};

	buildStats = function () {
		Api.stats.getStats( { campaign: $scope.main.campaign.id } )
		.then( function ( response ) {
			statsData = { data: response, type: 'pie' };
			$scope.main.chart.data = response;
		}, function ( reason ) {
			console.log( reason );
		} );
	};

	buildTeaser = function () {
		Api.dateo.getDateos( { tags : $routeParams.campaignName , is_geolocated: true, limit: 1} )
		.then( function ( response ) {
			$scope.main.dateoTeaser = response.objects[0];
			// After DOM rendered
			$timeout( function () {
				$($document).on('click', function () {
					$scope.main.nav.showTeaserPanel = false;
				});
			} );
		}, function ( reason ) { console.log( reason ); } );
	};

	focusMarker = function ( givens ) {
		var id     = givens && givens.id
		  , noZoom = givens && givens.noZoom
		  ;
		lastMarkerIcon = $scope.main.leaflet.markers['marker'+lastMarkerWithFocus].icon;
		if ( !id ) {
			!noZoom && ( $scope.main.leaflet.center.zoom = config.defaultStopClusteringAtZoom + 2 );
			// Fix center position in favor of Inside Panel
			leafletData.getMap('embedMap')
			.then( function ( map ) {
				var factor;
				factor = map.unproject( config.centerFix.point, $scope.main.leaflet.center.zoom );
				$scope.main.leaflet.center.lat = $scope.main.leaflet.markers['marker'+lastMarkerWithFocus].lat;
				$scope.main.leaflet.center.lng = $scope.main.leaflet.markers['marker'+lastMarkerWithFocus].lng - ( factor.lng + config.centerFix.topToDiff );
			} );
			$scope.main.leaflet.markers['marker'+lastMarkerWithFocus].focus = true;
			// Open spiderfy
			$timeout( openSpiderfy, 100 );
			Marker.resetAllMarkerIcons();
			$scope.main.leaflet.markers['marker'+lastMarkerWithFocus].icon  = Marker.buildMarkerFocusedIcon($scope.main.leaflet.markers['marker'+lastMarkerWithFocus].icon);
		} else {
			$scope.main.leaflet.markers['marker'+id].focus = true;
		}
	};

	isMainTag = function () {
		var dfd = $q.defer();
		Api.campaign
		.getCampaigns( { main_tag: $routeParams.campaignName } )
		.then( function ( response ) {
			dfd.resolve( { isMainTag: !!response.objects.length, campaignObj: response.objects } );
		}, function ( error ) {
			dfd.reject( error );
		} );
		return dfd.promise;
	};

	keepInsidePanelOpen = function () {
		if ( !$scope.main.nav.showInsidePanel ) {
			$scope.main.nav.showInsidePanel = true;
		}
	};

	openSpiderfy = function () {
		var markerId
		  , sliceMarkerIds = []
		  , slicePosition
		  ;
		markerId  = $( $scope.main.leaflet.markers['marker'+lastMarkerWithFocus].icon.html ).find('circle').data('datea-svg-circle-id');
		// If there is no marker then it must be 'inside' the cluster
		if ( !$('[data-datea-svg-circle-id="'+markerId+'"]').length ) {
			// If multiples SVGs
			if ( $('[data-datea-svg-slice-id]').length > 1 ) {
				// Fill array with slice Ids
				$.each( $('[data-datea-svg-slice-id]'), function () {
					sliceMarkerIds.push( $(this).data('datea-svg-slice-id') );
				} );
				// Search for slice position to open
				$.each( sliceMarkerIds, function ( i,v ) {
					var idsBySlice = (v+'').split(',');
					!slicePosition && !!~idsBySlice.indexOf( markerId+'' ) && ( slicePosition = i );
				} );
				// Select slice and open marker-cluster parent
				$( $('[data-datea-svg-slice-id]').get( slicePosition ) ).parents('div.marker-cluster').click();
				slicePosition = null;
			} else {
				// Open marker-cluster parent
				$('[data-datea-svg-slice-id]').parents('div.marker-cluster').click();
			}
		}
	};

	parseSecondaryTags = function () {
		angular.forEach( $scope.main.campaign.secondary_tags, function ( value, key ) {
			secondaryTags[ value.tag ] = { obj: value, color: $scope.main.colorRange[ key ] };
		} );
		$scope.main.legend.secondaryTags = secondaryTags;

		// after DOM rendered
		$timeout( setupLegendTags );
	};

	resetMarkers = function () {
		lastMarkerWithFocus         = 0;
		markersFromApi              = null;
		$scope.main.leaflet.markers = {};
	};

	setupLegendTags = function () {
		var legendHolder
		  , heightDiff
		  , expanded
		  ;
		legendHolder = $('div.legend-holder');
		heightDiff   = legendHolder.height() - config.legend.holderHeight;
		if ( legendHolder.height() > config.legend.holderHeight ) {
			legendHolder.parent().addClass('expandable');
			$('<span>').addClass( config.legend.msgClassname ).on('click',function() {
				var $this = $(this);
				if ( !expanded ) {
					legendHolder.parent().css('margin-top','-'+heightDiff+'px').css('height',legendHolder.height()+'px');
					$this.text( config.legend.hideMsg );
					expanded = true;
				} else {
					legendHolder.parent().css('margin-top','0').css('height', config.legend.holderHeight+'px');
					$this.text( config.legend.showMsg );
					expanded = false;
				}
			}).text( config.legend.showMsg ).prependTo( legendHolder.parent() );
		}
	};

	$scope.main.leaflet.clusterOptions =
	{ iconCreateFunction      : buildClusterIcon
	, polygonOptions          : Piecluster.pieclusterConfig.polygonOptions
	// , disableClusteringAtZoom : config.defaultStopClusteringAtZoom
	};

	if ( $routeParams.campaignName ) {
		isMainTag().then( function ( givens ) {
			if ( givens.isMainTag ) {
				$scope.main.campaign = givens.campaignObj[0];
				buildEmbed();
			}
		} );
	}

	console.log( $routeParams );

});