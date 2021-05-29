// create map
function createMap(curPos) {
    mapboxgl.accessToken = 'pk.eyJ1IjoianVubGljIiwiYSI6ImNrbzVpY3psNjAzODMydnBiYWVycXd2cDIifQ.sEdF7QZVuor4EbMa3hWdfA'

    var map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [curPos.long, curPos.lat], // starting position [lng, lat]
        zoom: 14 // starting zoom
    });
    // location getter button
    var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: false
    });
    // map.addControl(new mapboxgl.AttributionControl(), 'top-left');
    return {map, geolocate};
}

// create user location marker in center of map
function createLocationMarker(curPos) {
    var el = document.createElement('div');
    el.className = 'selfMarker'
    return new mapboxgl.Marker(el, {}) // development purposes to test different user locations  
    .setLngLat([curPos.long, curPos.lat]) // Marker [lng, lat] coordinates
    .addTo(map)
}

var curPos = {"long": van.longitude, "lat": van.latitude}
// }
var {map, geolocate} = createMap(curPos)
document.getElementById("mapdescription").innerHTML = "GPS Location: [" + curPos.long + ", " + curPos.lat + "]";
map.addControl(geolocate)
var curMarker = createLocationMarker(curPos)

geolocate.on('geolocate', function() {
    curPos.long = geolocate._lastKnownPosition.coords.longitude
    curPos.lat = geolocate._lastKnownPosition.coords.latitude
    curMarker.remove();
    curMarker = createLocationMarker(curPos)
    document.getElementById("mapdescription").innerHTML = "GPS Location: [" + curPos.long + ", " + curPos.lat + "]";
})