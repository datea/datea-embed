'use strict';

/**
 * @ngdoc service
 * @name dateaEmbedApp.Piecluster
 * @description
 * # Piecluster
 * Service in the dateaEmbedApp.
 */
angular.module( 'dateaEmbedApp' )
.service( 'Piecluster' , function Piecluster( config ) {
	var clusterSizeRange
	  , serializeXmlNode
	  , makeSVGPie
	  ;

	clusterSizeRange = d3.scale.linear()
	  .domain( [0, 100] )
	  .range( [50, 80] )
	  .clamp( true );

	makeSVGPie = function ( givens ) {
		var svg
		  , vis
		  , arc
		  , pie
		  , arcs
		  , campaign
		  , secondaryTags
		  ;
		campaign      = givens && givens.campaign;
		secondaryTags = givens && givens.secondaryTags;

		svg = document.createElementNS( d3.ns.prefix.svg, 'svg' );
		vis = d3.select( svg ).data( [ givens.data ] )
		  .attr( 'width', givens.d )
		  .attr( 'height', givens.d )
		  .append( 'svg:g' )
		  .attr( 'transform', 'translate('+givens.r+','+givens.r+')' );

		arc  = d3.svg.arc().outerRadius( givens.r );
		pie  = d3.layout.pie().value( function ( d ) { return d.value; } );
		arcs = vis.selectAll( 'g.slice' ).data( pie ).enter().append( 'svg:g' ).attr( 'class', 'slice' );
		arcs.append( 'svg:path' )
		.attr( 'fill', function ( a ){
			if ( campaign.secondary_tags.length === 0 ){
				return config.customClustering.defaultColor;
			} else if ( a.data.tag === 'Otros' ) {
				return config.customClustering.defaultColor1;
			} else {
				return secondaryTags[a.data.tag].color;
			}
		})
		.attr( 'd', arc )
		.attr( 'opacity', 0.75 );

		vis.append( 'circle' )
		   .attr( 'fill', '#fff' )
		   .attr( 'r', givens.r / 2.2 )
		   .attr( 'cx', 0 )
		   .attr( 'cy', 0 );

		vis.append( 'text' )
		   .attr( 'x', 0 )
		   .attr( 'y', 0 )
		   .attr( 'class', 'cpie-label' )
		   .attr( 'text-anchor', 'middle' )
		   .attr( 'dy', '.3em' )
		   .text( givens.n );

		return serializeXmlNode( svg );
	};

	serializeXmlNode = function ( xmlNode ) {
		if ( typeof window.XMLSerializer !== 'undefined' ) {
			return ( new window.XMLSerializer() ).serializeToString( xmlNode );
		} else if ( typeof xmlNode.xml !== 'undefined' ) {
			return xmlNode.xml;
		}
		return '';
	};

	return { clusterSizeRange : clusterSizeRange
	       , serializeXmlNode : serializeXmlNode
	       , makeSVGPie       : makeSVGPie
	       };
});
