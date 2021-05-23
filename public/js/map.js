// harvesine distance between 2 location
// code modified and obtained from https://stackoverflow.com/a/48805273
function distance([long1, lat1], [long2, lat2]) {
    const toRad = angle => (Math.PI / 180) * angle;
    const dist = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;
    const KM_TO_M = 1000

    const dLat = dist(lat2, lat1);
    const dLong = dist(long2, long1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    // harvesine distance formula
    const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLong / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.asin(Math.sqrt(a));

    var finalDistance = RADIUS_OF_EARTH_IN_KM * KM_TO_M * c;
    return finalDistance;
}

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
    map.addControl(new mapboxgl.AttributionControl(), 'top-left');
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

// create van markers, array of the 5 nearest vans with the van object and its respective marker
// [ [van Object, marker Object], ........]
// vanPoints is iterable of van location points
function createVanMarker(vanPoints) {
    var vanMarkers = []
    vanPoints.forEach((van, index) => {
        if (index < 5) {
            var el = document.createElement('div');
            // closest van is automatically selected
            if (index==0) {
                el.className = 'selectedMarker'
            }
            else {
                el.className = 'marker'
            }
            var long = van[0].longitude
            var lat = van[0].latitude
            // var cur_van = van[0]
            // var dist = Math.round(van[1])
            var marker = new mapboxgl.Marker(el)
                .setLngLat([long, lat]) // Marker [lng, lat] coordinates
                .addTo(map); // Add the marker to the map
            vanMarkers.push([van[0], marker])
        }
    })
    return vanMarkers
}

// returns array of vans and their distance to the user ordered from nearest to furthest 
function calcVanDist(curPos, vans) {
    var point_distance = []
    for (var van in vans) {
        var latitude = vans[van].latitude
        var longitude = vans[van].longitude
        var dist = distance([longitude, latitude],[curPos.long, curPos.lat]);
        point_distance.push([vans[van], dist])
    }
    point_distance.sort((a, b) => (a[1] > b[1] ? 1: -1));
    return point_distance;
}


var curPos = {"long":144.95878, "lat": -37.7983416}
var {map, geolocate} = createMap(curPos)
map.addControl(geolocate)
// when user refreshes location, update all markers
geolocate.on('geolocate', function() {
    curPos.long = geolocate._lastKnownPosition.coords.longitude
    curPos.lat = geolocate._lastKnownPosition.coords.latitude
    curMarker.remove();
    curMarker = createLocationMarker(curPos)
    vanDist = calcVanDist(curPos, vans);
    for (i in vanMarkers) {
        vanMarkers[i][1].remove()
    }
    vanMarkers = []
    vanMarkers = createVanMarker(vanDist);
    vanMarkers.forEach((marker) => {
        marker[1].getElement().addEventListener('click', updateSelection);
        marker[1].getElement().addEventListener('click', updateMarkers);
    })
    nearestVan = vanDist[0][0]
    upadteVanStats()
    displayVanList(ordered)
});
var curMarker = createLocationMarker(curPos)
var vanDist = calcVanDist(curPos, vans); // [ [van Object, dist Number], ........]
var vanMarkers = createVanMarker(vanDist); // [ [van Object, marker Object], ........]
var nearestVan = vanDist[0][0] // nearestVan contains the van object closest to the user's current location