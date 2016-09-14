(function($) {
$.fn.leaflet = function(options) {
	var settings = $.extend({}, { // TODO extend leaflet options
		selector: ".map", // TODO not needed
		attributeLatitude: "data-lat",
		attributeLongitude: "data-long",
		attributeZoom: "data-zoom",
		attributeTileLayers: "data-tilelayers",
		tileLayers: [{
				source: "",
				attribution: ""
			},
		],
		imagePath: "images/maps"
	}, options);

	//var elements = $(settings.selector);
	//console.log(arr);

	return this.each(function(index, element) { // TODO maybe parameters not needed
		//console.log($(val).attr('data-lat'));
		var htmlObject = $(element).get(); // TODO this.get or $(this).get ?

		var lat = $(element).attr("data-lat");
		var long = $(element).attr("data-long");
		var zoom = $(element).attr("data-zoom");

		var map = L.map(htmlObject).setView([lat, long], zoom);

		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
		}).addTo(map);

		L.Icon.Default.imagePath = "images/maps";
		L.marker([lat, long]).addTo(map);
		L.control.scale().addTo(map);
	});
	// TODO make marker and controls separate method to chain after map
	// TODO decorate leaflet https://blog.engineyard.com/2015/7-patterns-refactor-javascript-decorators
};
}(jQuery));
