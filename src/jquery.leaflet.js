(function($) {
$.fn.leaflet = function(options) {
	var omit = require('lodash.omit');
	var transform = require('lodash.transform');
	var settings = $.extend({}, { // TODO extend leaflet options, calculate attribute name from the leaflet option name
		attributeLatitude: "data-lat",
		attributeLongitude: "data-long",
		attributeZoom: "data-zoom",
		attributeMinZoom: "data-minzoom",
		attributeMaxZoom: "data-maxzoom",
		attributeTileLayers: "data-tilelayers",
		attributeControls: "data-controls",
		attributes: {
			latitude: "data-lat",
			longitude: "data-long"
		},
		tileLayers: [{
				source: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
				attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
			}
		],
		controls: [], // TODO implement: iterate through this, if it's an object, "name" is member name and other components are options, if it's a string it's the member name. for each control, parse data-:name-:option attributes
		zoom: 18,
		imagePath: "leaflet/images"
	}, options);

	return this.each(function() {
		var that = $(this);

		function attribute(name) {
			if (name in settings.attributes && settings.attributes[name] !== undefined) {
				return settings.attributes[name];
			}
			return "data-" + name.toLowerCase();
		}

		function option(property) {
			var value = that.attr(attribute(property));
			if (value === undefined) {
				value = settings[property];
			}
			return value;
		}

		function requiredOption(property) {
			var value = that.attr(attribute(property));
			if (value === undefined) {
				throw new Error("The required option \"" + attribute + "\" is missing");
			}
			return value;
		}

	  /**
		 * Loads multiple objects each consisting of a name and several properties.
		 * Objects are loaded from an HTML attribute containing the
		 * space-separated list of object names and multiple separate HTML attributes
		 * containing each of the properties of the complex object.
		 */
		function complexOption(property) {
			/**
			 * Retrieve all attributes from a HTML node
			 */
			function htmlAllAttributes(node) {
				return transform(node.attributes, function(attrs, attribute) {
		        attrs[attribute.name] = attribute.value;
		    }, {});
			}
			var objects = [];
			var value = that.attr(attribute(property));
			var objectNames = [];
			if (value !== undefined) {
				objectNames = value.split(" ");
			}
			objectNames.forEach(function(objectName) {
				if (objectName == "inherit") {
					return;
				}
				var attributes = htmlAllAttributes(that);
				$.each(attributes, function(attribute, value) {
					if (attribute.startsWith("data-" + objectName + "-")) {
						var key = attribute.match(new RegExp("data-" + objectName + "-(.*)"))[0];
						var object = {};
						object[key] = value;
						objects.push(object);
					}
				});
				// TODO get all attributes that follow the pattern, extend jQuery with $().attrs(pattern) for this, https://github.com/isaacs/minimatch https://www.npmjs.com/package/matcher
				// TODO http://stackoverflow.com/questions/14645806/get-all-attributes-of-an-element-using-jquery (2nd answer)
			});
			if (objectNames.includes("inherit")) {
				return objects.concat(settings.controls);
			}
			else {
				return objects;
			}
		}

		var lat = requiredOption("latitude"); // TODO if this attribute doesn't exist, look for this attribute at parent elements for ease of use
		var long = requiredOption("longitude");
		var zoom = option("zoom");

		var map = L.map(this).setView([lat, long], zoom);

		settings.tileLayers.forEach(function(tileLayer) {
			var tileLayerOptions = omit(tileLayer, "source");
			L.tileLayer(tileLayer.source, tileLayerOptions).addTo(map);
		});

		L.Icon.Default.imagePath = settings.imagePath;
		L.marker([lat, long]).addTo(map);
		complexOption("controls").forEach(function(control) {
			var controlName = control;
			var controlOptions = {};
			if (typeof control === "object") {
				controlName = control.name;
				controlOptions = omit(control, "name");
			}
			L.control[controlName](controlOptions).addTo(map);
		});
	});
	// TODO make marker and controls separate method to chain after map
	// TODO decorate leaflet https://blog.engineyard.com/2015/7-patterns-refactor-javascript-decorators
};
}(jQuery));
