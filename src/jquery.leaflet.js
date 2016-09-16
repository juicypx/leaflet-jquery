(function($) {
$.fn.leaflet = function(options) {
	var settings = $.extend({}, { // TODO extend leaflet options
		attributeLatitude: "data-lat",
		attributeLongitude: "data-long",
		attributeZoom: "data-zoom",
		attributeTileLayers: "data-tilelayers",
		attributeControls: "data-controls",
		tileLayers: [{
				source: "",
				attribution: ""
			},
		],
		controls: [{

		}],
		zoom: 18,
		imagePath: "images/maps"
	}, options);

	return this.each(function() {
		var lat = $(this).attr("data-lat");
		var long = $(this).attr("data-long");
		var zoom = $(this).attr("data-zoom") || settings.zoom;

		var map = L.map(this).setView([lat, long], zoom);

		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
		}).addTo(map);

		L.Icon.Default.imagePath = "leaflet/images";
		L.marker([lat, long]).addTo(map);
		L.control.scale().addTo(map);
	});
	// TODO make marker and controls separate method to chain after map
	// TODO decorate leaflet https://blog.engineyard.com/2015/7-patterns-refactor-javascript-decorators
};
}(jQuery));
