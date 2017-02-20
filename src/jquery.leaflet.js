(function($) {
$.fn.leaflet = function(options) {
	var settings = $.extend({}, { // TODO extend leaflet options, calculate attribute name from the leaflet option name
		attributeLatitude: "data-lat",
		attributeLongitude: "data-long",
		attributeZoom: "data-zoom",
		attributeMinZoom: "data-minzoom",
		attributeMaxZoom: "data-maxzoom",
		attributeTileLayers: "data-tilelayers",
		attributeControls: "data-controls",
		tileLayers: [{
				source: "",
				attribution: ""
			},
		],
		controls: [{

		}], // TODO implement: iterate through this, if it's an object, "name" is member name and other components are options, if it's a string it's the member name. for each control, parse data-:name-:option attributes
		zoom: 18,
		imagePath: "images/maps"
	}, options);

	return this.each(function() {
		var lat = $(this).attr(settings.attributeLatitude); // TODO if this attribute doesn't exist, look for this attribute at parent elements for ease of use
		var long = $(this).attr(settings.attributeLongitude);
		var zoom = $(this).attr(settings.attributeZoom) || settings.zoom;
		// TODO refactor to option("data-zoom", settings.zoom); requiredOption(settings.attributeLatitude); the latter should throw an error if missing

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
