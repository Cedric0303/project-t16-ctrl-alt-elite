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
    return new mapboxgl.Marker(el, {draggable:true}) // development purposes to test different user locations  
    .setLngLat([curPos.long, curPos.lat]) // Marker [lng, lat] coordinates
    .setPopup(new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        closeOnMove: true,
    }).setHTML("Current location:<br>" + curPos.long.toString() + " " + curPos.lat.toString()))
    .addTo(map)
}

// create van markers
// points is iterable of van location points
function createVanMarker(vanPoints) {
    var el;
    var el1 = document.createElement('div')
    var el2 = document.createElement('div')
    var el3 = document.createElement('div')
    var el4 = document.createElement('div')
    var el5 = document.createElement('div')
    el1.className = 'nearestMarker'
    el2.className = 'marker'
    el3.className = 'marker'
    el4.className = 'marker'
    el5.className = 'marker'
    var vanMarkers = []
    for (i in vanPoints) { // only show 5 closest vans
        if (i==0) el = el1;
        else if (i==1) el =el2;
        else if (i==2) el =el3;
        else if (i==3) el =el4;
        else if (i==4) el =el5;
        if (i==5) {
            break;
        }
        var long = vanPoints[i][0].longitude
        var lat = vanPoints[i][0].latitude
        var vanID = vanPoints[i][0].loginID
        var dist = vanPoints[i][1]
        vanMarkers.push([
            vanPoints[i][0],
            new mapboxgl.Marker(el)
            .setPopup(new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: true,
                closeOnMove: false,
            })
            .setHTML(long.toString() + " " + lat.toString() + '<br><a href="/customer/' + vanID +'/menu/?dist=' + Math.round(dist) + '">Select Van</a>'))
            .setLngLat([long, lat]) // Marker [lng, lat] coordinates
            .addTo(map)]); // Add the marker to the map
    }
    return vanMarkers
}

function calcVanDist(curPos, vans) {
    var point_distance = []
    for (var van in vans) {
        var latitude = vans[van].latitude
        // console.log(latitude)
        var longitude = vans[van].longitude
        // console.log(longitude)
        var dist = distance([longitude, latitude],[curPos.long, curPos.lat]);
        point_distance.push([vans[van], dist])
    }
    point_distance.sort((a, b) => (a[1] > b[1] ? 1: -1));
    return point_distance;
}


var curPos = {"long":144.95878, "lat": -37.7983416}
var {map, geolocate} = createMap(curPos)
map.addControl(geolocate)
geolocate.on('geolocate', function() {
    geolocate.trigger();
    setTimeout(function () {
        curPos.long = geolocate._lastKnownPosition.coords.longitude
        curPos.lat = geolocate._lastKnownPosition.coords.latitude
        curPosition.remove();
        curPosition = createLocationMarker(curPos)}, 100);
        for (i in vanMarkers) {
            vanMarkers[i][1].remove()
        }
        vanMarkers = []
        var vanMarkers = createVanMarker(vanDist);
    });
var curMarker = createLocationMarker(curPos)
var vanDist = calcVanDist(curPos, vans);
var vanMarkers = createVanMarker(vanDist);
// var nearestVan = vanMarkers[0][0] // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< this is the nearestVan
curMarker.on('dragend', function () {
    for (i in vanMarkers) {
        vanMarkers[i][1].remove()
    }
    vanMarkers = []
    var vanMarkers = createVanMarker(vanDist);
    // nearestVan = vanMarkers[0][0]
})