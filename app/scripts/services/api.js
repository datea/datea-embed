'use strict';

/**
 * @ngdoc service
 * @name dateaEmbedApp.Api
 * @description
 * # Api
 * Service in the dateaEmbedApp.
 */

angular.module('dateaEmbedApp')
.service('Api', function Api(
  $resource
, config
, $q
) {
	var dateo    = {}
	  , campaign = {}
	  , stats    = {}
	  ;

	dateo.rsrc   = $resource( config.api.url + 'dateo/', {},
	{ 'query': { method: 'GET' }
	} );

	campaign.rsrc = $resource( config.api.url + 'campaign/', {},
	{ 'query': { method : 'GET' }
	} );

	stats.rsrc = $resource( config.api.url + 'dateo/stats', {},
	{ 'query': { method : 'GET' }
	} );

	// Campaign
	campaign.getCampaigns = function ( givens ) {
		var dfd = $q.defer();
		campaign.rsrc.query( givens, function ( response ) {
			dfd.resolve( response );
		}, function ( error ) {
			dfd.reject( error );
		} );
		return dfd.promise;
	};

	// Dateo
	dateo.getDateos = function ( givens ) {
		var dfd = $q.defer();
		dateo.rsrc.query( givens, function ( response ) {
			dfd.resolve( response );
		}, function ( error ) {
			dfd.reject( error );
		} );
		return dfd.promise;
	};

	// Stats
	stats.getStats = function ( givens ) {
		var dfd = $q.defer();
		stats.rsrc.query( givens, function ( response ) {
			dfd.resolve( response );
		}, function ( error ) {
			dfd.reject( error );
		} );
		return dfd.promise;
	};

	return { dateo    : dateo
	       , campaign : campaign
	       , stats    : stats
	       };
});
