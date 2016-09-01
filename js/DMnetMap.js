/*  August 2016 version.  Copyright 2016 DisasterMap.net, LLC

Code created by Ezra Boyd with contributions from William Wilkerson of Octance Development, Oliver Burd of BurdGIS, Antonio Santiago, Ashley Emilay & Marc Senac of BoundlessGEO, and Matt Travis 

- Aug 2016:  Switched WMS to REST 
*/

//  Create Map
var map = new L.Map('map',
{maxzoom:19,zoom: 4, center: new L.LatLng(38, -94)
});

// Add basemap layers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '<a href="http://openstreetmap.org" target="_blank">OpenStreetMap </a>',
	}).addTo(map);

var osmbw = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

var osmHOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
	});

var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 16,
	attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});

/*
var MapQuestAerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
	type: 'sat',
	ext: 'jpg',
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
	subdomains: '1234'
	});
*/

var NightLights = L.tileLayer('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: '<a href="https://earthdata.nasa.gov">NASA-ESDIS</a>',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
	});

// add servers for additional layers
var URL2 = 'http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer'
var URL3 = 'http://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/WMSServer'
var URL4 = 'http://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/WMSServer'
var URL5 = 'http://gis.fema.gov/REST/services/NSS/OpenShelters/MapServer/0/'
var URL6 = 'http://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_goes_time/MapServer/WMSServer'
var URL7 = 'https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Observations/radar_base_reflectivity/MapServer/WMSServer'

// add storm reports
var StormReports = L.layerGroup();

// custom icon details 
var tornadoIcon = L.icon({
  iconUrl: 'http://disastermap.net/WebMapApps/icons/tornado_red.png',
  iconSize:     [20, 20], 
});

var hailIcon = L.icon({
  iconUrl: 'http://disastermap.net/WebMapApps/icons/hail_red.png',
  iconSize:     [15, 15], 
});

var windIcon = L.icon({
  iconUrl: 'http://disastermap.net/WebMapApps/icons/wind_red.png',
  iconSize:     [15, 15], 
});

var tornadoIcon2 = L.icon({
  iconUrl: 'http://disastermap.net/WebMapApps/icons/tornado_yel.png',
  iconSize:     [15, 15], 
});

var hailIcon2 = L.icon({
  iconUrl: 'http://disastermap.net/WebMapApps/icons/hail_yel.png',
  iconSize:     [12, 12], 
});

var windIcon2 = L.icon({
  iconUrl: 'http://disastermap.net/WebMapApps/icons/wind_yel.png',
  iconSize:     [12, 12], });

// todays storm reports 
omnivore.csv('localdata/today_torn.csv') 
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(tornadoIcon); 
    });
  }).addTo(StormReports);

omnivore.csv('localdata/today_hail.csv') 
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(hailIcon); 
    });
  }).addTo(StormReports);

omnivore.csv('localdata/today_wind.csv') 
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(windIcon); 
    });
  }).addTo(StormReports);

// yesterdays storm reports 
omnivore.csv('localdata/yesterday_torn.csv')
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(tornadoIcon2);
    });
  }).addTo(StormReports);

omnivore.csv('localdata/yesterday_hail.csv') 
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(hailIcon2); 
    });
  }).addTo(StormReports);

omnivore.csv('localdata/yesterday_wind.csv') 
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(windIcon2);
    });
  }).addTo(StormReports);

StormReports.addTo(map);

// add precipitation
var precip = L.layerGroup();

	radar = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
	    	layers: 'nexrad-n0r-900913',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.75,
	    	attribution: "Nexrad"
		}).addTo(precip);
precip.addTo(map);

// add IGEMS layers using L.tileLayer.wms & URL2
var tectonic = L.layerGroup();

	volcanoes = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '1',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.9
		}).addTo(tectonic);
	
	othervolcanoes = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '2',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.9
		}).addTo(tectonic);
		
	earthquakes = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '3',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  1.0
		}).addTo(tectonic);

	shakemaps = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '4',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.8
		}).addTo(tectonic);

tectonic.addTo(map);

//add weather layer group
var weather = L.layerGroup();

	severe = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '12',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.5
		}).addTo(weather);

	warnings = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '13',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.5
		}).addTo(weather);

	watches = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '14',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.4
		}).addTo(weather);

	advisories = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '15',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.3
		}).addTo(weather);

weather.addTo(map);

//add tropical weather layer usings NowCoast Troical Cyclone server as URL3

var source3 = L.WMS.source(
	URL3,
	{
		"format": "image/png",
		"transparent": "true",
		"opacity":  0.5,
		"identify": true,
		"attribution": "NHC"
	}
)

var source4 = L.WMS.source(
	URL4,
	{
		"format": "image/png",
		"transparent": "true",
		"opacity":  0.5,
		"identify": true
	}
)

var tropical = L.layerGroup();

// Add layers using NOWCOAST server (source3)
obswind = source3.getLayer('2').addTo(tropical);
obstrack = source3.getLayer('3').addTo(tropical);
obscenter = source3.getLayer('4').addTo(tropical);
foreuncertain = source3.getLayer('6').addTo(tropical);
foreline = source3.getLayer('7').addTo(tropical);
forewarn = source3.getLayer('9').addTo(tropical);


// Add layers from NHC tropical weather server (source 4)
probpoint2day = source4.getLayer('61').addTo(tropical);
probarea2day = source4.getLayer('60').addTo(tropical);
obscenter = source4.getLayer('4').addTo(tropical);
ktwind34 = source4.getLayer('2').addTo(tropical);
ktwind50 = source4.getLayer('1').addTo(tropical);
ktwind64 = source4.getLayer('0').addTo(tropical);

tropical.addTo(map);


//add fires layer group
var fires = L.layerGroup();

fireperimeters = source2.getLayer('4');
fireperimeters.addTo(fires);

wildfires = source2.getLayer('5');
wildfires.addTo(fires);

fires.addTo(map);

//add flood layers group from URL2and URL4
var hydro = L.layerGroup();

floods = L.tileLayer.wms("http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer", {
	    	layers: '0',
	    	format: 'image/png',
	    	transparent: true,
		opacity:  0.8 
		}).addTo(hydro); 

surge1 = source4.getLayer('47').addTo(hydro);
surge2 = source4.getLayer('36').addTo(hydro);
surge3 = source4.getLayer('25').addTo(hydro);
surge4 = source4.getLayer('15').addTo(hydro);
surge5 = source4.getLayer('3').addTo(hydro);

hydro.addTo(map);

/* New shelter markers. Can change the popup info to make it a bit neater.
 * Utilises esri-leaflet and REST from fema instead of SOAP.
 * useCors: false disables circumnavigates CORs problem
 * 28-Apr-2016, OJB
 ** Modified by EB 5-May-2016 **
 */
 
var response = L.layerGroup();

var shelters = L.esri.featureLayer({
	url: URL5,
	useCors: false,
	pointToLayer: function(feature, latlng) {
		   var smallIcon = L.icon({
                      iconSize: [17, 17],
                      iconAnchor: [7, 7],
                      popupAnchor:  [1, -24],
                      iconUrl: 'http://gis.fema.gov/REST/services/NSS/OpenShelters/MapServer/0/images/655c6833.png'
   });

   		return L.marker(latlng, {icon: smallIcon});
	}
});

// Binds the popup using info from geoJson
shelters.bindPopup(function(features){
	return "<dt>Name</dt>" + features.feature.properties.SHELTER_NAME  + "</dd>" +
		"<dt>Address</dt>" +  "<dd>" + features.feature.properties.ADDRESS + "</dd>" + 
		"<dt>City</dt>" + "<dd>" + features.feature.properties.CITY + "</dd>" + 
		"<dt>State</dt>" + "<dd>" + features.feature.properties.STATE + "</dd>" + 
		"<dt>Zip</dt>" + "<dd>" + features.feature.properties.ZIP + "</dd>" +   
		"<dt>Population</dt>" + "<dd>" + features.feature.properties.TOTAL_POPULATION  + "</dd></dl>";
});

shelters.addTo(response);

response.addTo(map);

// Add Imagery layers for NOWCOAST (URL6)
var source6 = L.WMS.source(
	URL6,	{
		"format": "image/png",
		"transparent": "true",
		"opacity":  0.5,
		"identify": true,
		"attribution": "NOAA"
	})

//add Satellite layer group.  Will add infrared & visible later.
var satellite = L.layerGroup();

//infrared = source6.getLayer('1').addTo(satellite);
watervapor = source6.getLayer('5').addTo(satellite);
//visible = source6.getLayer('9').addTo(satellite);

// satellite.addTo(map);  ** Does not open by default currently


//Add mapquest traffic
var traffic = L.layerGroup();

trafficflow = MQ.trafficLayer({
layers: ['flow'],
minZoom: 8,
maxZoom: 14
});

trafficflow.addTo(traffic);
trafficincident = MQ.trafficLayer({
layers: ['incidents'],
minZoom: 8,
maxZoom: 14
});

trafficincident.addTo(traffic);
traffic.addTo(map);

//add controls
var basemapscontrol = {
    	"OpenStreetMap": osm,
    	"OpenStreetMap (Black & White)": osmbw,
	"OpenStreetMap (HOT)" : osmHOT,
	"OpenTopoMap": OpenTopoMap,
//	"MapQuest Imagery":  MapQuestAerial,
	"Earth at Night": NightLights
};

var overlayMaps =  {
'Recent Storm Reports':  StormReports,
//'Wildfire Hazards': fires,
//'Tropical Weather Hazards': tropical,
'Geologic Hazards':  tectonic,
'Weather Hazards' : weather,
'Flood Hazards': hydro,
'Precipitation': precip,
'Water Vapor': satellite,
'Traffic': traffic,
'Shelters': response
};

L.control.layers(basemapscontrol, overlayMaps).addTo(map);

new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google()
}).addTo(map);
