(function (window, document, L, undefined) {
	'use strict';

	/* create leaflet map */
	var map = L.map('map', {
		center: [44.8997, -0.8157],
		zoom: 9
	});

	/**
	 * Object to store svg:element property for future use
	 */
	var props = {
		circle: {
			default: 2,
			active: 5
		}
	}

	/**
	 * 
	 */
	var links = [];

	/* add default stamen tile layer */
	new L.tileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);

	var svg				= d3.select(map.getPanes().overlayPane).append('svg'),
		g				= svg.append('g').attr('class', 'leaflet-zoom-hide'),
		entities		= g.append('g').attr('id', 'entities'),
		entitiesLabels	= g.append('g').attr('id', 'entities-labels'),
		centres			= g.append('g').attr('id', 'centres'),
		routes			= g.append('g').attr('id', 'routes')
	;

	var path, entity, label, centre;

	// Use Leaflet to implement a D3 geographic projection.
	function projectPoint(x) {
		var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
		return [point.x, point.y];
	}

	d3.csv('scripts/liste-adresse-centre.csv', function (error, dataset) {
		centre = centres.selectAll('.centre')
			.data(dataset)
			.enter()
			.append('circle')
			.on('mouseover', function (d) {
				// reset style on others elements
				d3.selectAll('.route').classed('highlight', false);
				// apply style to element(s)
				d3.selectAll('.route.' + idify(d.MOA)).classed('highlight', true);
			})
			.on('mouseout', function () {
				d3.selectAll('.route').classed('highlight', false);
			})
		;

		d3.csv('scripts/routes-dechets.csv', function (error, dataRoutes) {
			// Standard enter / update 
			var routePath = routes.selectAll('.route')
				.data(dataRoutes)
				.enter()
				.append('path')
					.attr('d', function (d) {
						var coordDepart = [ d.lon_depart, d.lat_depart ];
						var coordArrivee = [ d.lon_arrivee, d.lat_arrivee ];
						return path({
							type: 'LineString',
							coordinates: [
								coordDepart,
								coordArrivee
							]
						});
					})
			;

		});


		map.on('viewreset', reset);
		reset();

		function reset() {
			centre.attr('class', function (d) { return 'centre ' + idify(d.MOA); })
				.attr('r', props.circle.default)
				.attr('cx', function (d) {return projectPoint([d.LON, d.LAT])[0]; })
				.attr('cy', function (d) { return projectPoint([d.LON, d.LAT])[1]; })
			;
		}
	});

}(window, document, L));