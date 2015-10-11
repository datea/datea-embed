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
	var dateo     = {}
    , dateoFull = {}
	  , campaign  = {}
	  , stats     = {}
    , comment   = {}
	  ;

	dateo.rsrc   = $resource( config.api.url + 'dateo/', {},
	{ 'query': { method: 'GET' }
	} );

  dateoFull.rsrc   = $resource( config.api.url + 'dateo_full/:id', {},
  { 'query': { method : 'GET'
             , params : {id: '@id'}
             }
  } );

	campaign.rsrc = $resource( config.api.url + 'campaign/', {},
	{ 'query': { method : 'GET' }
	} );

	stats.rsrc = $resource( config.api.url + 'dateo/stats', {},
	{ 'query': { method : 'GET' }
	} );

  comment.rsrc = $resource( config.api.url + 'comment/', {},
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

  // get full Dateo (with comments)
  dateo.getFullDateo = function ( givens ) {
    var dfd = $q.defer();
    dateoFull.rsrc.query( givens, function ( response ) {
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

  comment.getList = function (givens) {
    var dfd = $q.defer();
    comment.rsrc.query( givens
    , function ( response ) {
      dfd.resolve( response );
    }
    , function ( error ) {
      dfd.reject( error );
    } );
    return dfd.promise;
  };

	return { dateo    : dateo
	       , campaign : campaign
	       , stats    : stats
         , comment  : comment
	       };
});
