var map = new L.Map('map',
{maxzoom:19,zoom: 4, center: new L.LatLng(38, -94)
});

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

var MapQuestAerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
	type: 'sat',
	ext: 'jpg',
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
	subdomains: '1234'
	});

var NightLights = L.tileLayer('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
	});

// add storm reports
var StormReports = L.layerGroup();

/* custom icon details */
var tornadoIcon = L.icon({
  iconUrl: '../icons/tornado_red.png',
  iconSize:     [15, 15], // size of the icon
});

var hailIcon = L.icon({
  iconUrl: '../icons/hail_red.png',
  iconSize:     [15, 15], // size of the icon
});

var windIcon = L.icon({
  iconUrl: '../icons/wind_red.png',
  iconSize:     [15, 15], // size of the icon
});

var tornadoIcon2 = L.icon({
  iconUrl: '../icons/tornado_yel.png',
  iconSize:     [12, 12], // size of the icon
});

var hailIcon2 = L.icon({
  iconUrl: '../icons/hail_yel.png',
  iconSize:     [12, 12], // size of the icon
});

var windIcon2 = L.icon({
  iconUrl: '../icons/wind_yel.png',
  iconSize:     [12, 12], // size of the icon
});

/* today's reports */
omnivore.csv('localdata/today_tornado.csv') //csv location
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(tornadoIcon); //name of icon
    });
  })
  .addTo(StormReports);

omnivore.csv('localdata/today_hail.csv') //csv location
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(hailIcon); //name of icon
    });
  })
  .addTo(StormReports);

omnivore.csv('localdata/today_wind.csv') //csv location
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(windIcon); //name of icon
    });
  })
  .addTo(StormReports);


/* yesterday's reports */
omnivore.csv('localdata/yesterday_tornado.csv') //csv location
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(tornadoIcon2); //name of icon
    });
  })
  .addTo(StormReports);

omnivore.csv('localdata/yesterday_hail.csv') //csv location
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(hailIcon2); //name of icon
    });
  })
  .addTo(StormReports);

omnivore.csv('localdata/yesterday_wind.csv') //csv location
  .on('ready', function(layer) {
    this.eachLayer(function(marker) {
      marker.setIcon(windIcon2); //name of icon
    });
  })
  .addTo(StormReports);

StormReports.addTo(map);
// add precipitation
var precip = L.layerGroup();

var radar = L.tileLayer.wms("https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Observations/radar_base_reflectivity/MapServer/WMSServer", {
    layers: '1',
    format: 'image/png',
    transparent: true,
    attribution: "NOAA-NCEP"
});
radar.addTo(precip);
precip.addTo(map);

// add IGEMS server
var URL2 = 'http://igems.doi.gov/arcgis/services/igems_haz/MapServer/WMSServer'

var source2 = L.WMS.source(
	URL2,
	{
		"format": "image/png",
		"transparent": "true",
		"opacity":  0.5,
		"identify": true
	}
)

//add tectonic layers to map
var tectonic = L.layerGroup();

shakemaps = source2.getLayer('11');
shakemaps.addTo(tectonic);

earthquakes = source2.getLayer('12');
earthquakes.addTo(tectonic);

volcanoes = source2.getLayer('13');
volcanoes.addTo(tectonic);

othervolcanoes = source2.getLayer('14');
othervolcanoes.addTo(tectonic);

tectonic.addTo(map);

//add weather layer group
var weather = L.layerGroup();

advisory = source2.getLayer('0');
advisory.addTo(weather);

watches = source2.getLayer('1');
watches.addTo(weather);

warnings = source2.getLayer('2')
warnings.addTo(weather);

severe = source2.getLayer('3')
severe.addTo(weather);

weather.addTo(map);

//add tropical weather layer group
var tropical = L.layerGroup();

forecasts = source2.getLayer('6');
forecasts.addTo(tropical);

forecastspls= source2.getLayer('7');
forecastspls.addTo(tropical);

forecastslns = source2.getLayer('8');
forecastslns.addTo(tropical);

forecastspts = source2.getLayer('9');
forecastspts.addTo(tropical);

hurricanes = source2.getLayer('10');
hurricanes.addTo(tropical);

tropical.addTo(map);

//add fires layer group
var fires = L.layerGroup();

fireperimeters = source2.getLayer('4');
fireperimeters.addTo(fires);

wildfires = source2.getLayer('5');
wildfires.addTo(fires);

fires.addTo(map);

//add hydro layer group
var hydro = L.layerGroup();

floods = source2.getLayer('15');
floods.addTo(hydro);

hydro.addTo(map);

/* New shelter markers. Can change the popup info to make it a bit neater.
 * Utilises esri-leaflet and REST from fema instead of SOAP.
 * useCors: false disables circumnavigates CORs problem
 * 28-Apr-2016, OJB
 */


var URL3 = 'http://gis.fema.gov/REST/services/NSS/OpenShelters/MapServer/0/'

var source3 = L.esri.featureLayer({
	url: URL3,
	useCors: false,
	pointToLayer: function(feature, latlng) {
		   var smallIcon = L.icon({
                      iconSize: [14, 14],
                      iconAnchor: [7, 7],
                      popupAnchor:  [1, -24],
                      iconUrl: 'http://gis.fema.gov/REST/services/NSS/OpenShelters/MapServer/0/images/655c6833.png'
   });

   		return L.marker(latlng, {icon: smallIcon});
	}
});

// Binds the popup using info from geoJson

source3.bindPopup(function(features){
	return "Name: " + features.feature.properties.SHELTER_NAME + /n "Address: " +  features.feature.properties.ADDRESS +
		/n "City: " + features.feature.properties.CITY + /n "State: "+ features.feature.properties.STATE + /n "Zip: " +
		+ features.feature.properties.ZIP	
		;
});

map.addLayer(source3);

/* Old method of adding shelters. Created problem with CORs
 * The png also covered all areas so a click event regitered a getFeatureInfo call
 * even if there were no visible features.
 * This tripped up leaflet.wms.js into trying to use an iframe workaround
 * Iframe failed
 * 28-Apr-2016, OJB
 */

/*var URL4 = 'http://gis.fema.gov/SOAP/NSS/OpenShelters/MapServer/WMSServer'

var source3 = L.WMS.source(
	URL4,
	{
		"format": "image/png",
		"transparent": "true",
		"identify": true
	}
);

var response = L.layerGroup();

shelters = source3.getLayer('0');
shelters.addTo(response);
*/
response.addTo(map);

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
	"MapQuest Imagery":  MapQuestAerial,
	"Earth at Night": NightLights
};

var overlayMaps =  {
'Recent Storm Reports':  StormReports,
'Wildfire Hazards': fires,
'Tropical Weather Hazards': tropical,
'Geologic Hazards':  tectonic,
'Weather Hazards' : weather,
'Flood Hazards': hydro,
'Precipitation': precip,
'Traffic': traffic,
'Shelters-REST': source3,
'Shelters-SOAP': response
};

L.control.layers(basemapscontrol, overlayMaps).addTo(map);

new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google()
}).addTo(map);
