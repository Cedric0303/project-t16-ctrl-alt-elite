// harvesine distance between 2 location
// code modified and obtained from https://stackoverflow.com/a/48805273

function distance([long1, lat1], [long2, lat2]) {
    const toRad = angle => (Math.PI / 180) * angle;
    const dist = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    const dLat = dist(lat2, lat1);
    const dLong = dist(long2, long1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    // harvesine distance formula
    const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLong / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.asin(Math.sqrt(a));

    var finalDistance = RADIUS_OF_EARTH_IN_KM * c;
    return finalDistance;
}

function createMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoianVubGljIiwiYSI6ImNrbzVpY3psNjAzODMydnBiYWVycXd2cDIifQ.sEdF7QZVuor4EbMa3hWdfA'
    // generates map
    var map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [144.95878, -37.7983416], // starting position [lng, lat]
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

function createLocationMarker() {
    var pos = map.getCenter()
    return new mapboxgl.Marker({
        color: '#000000',
        draggable: true
    }) 
    .setLngLat([pos.lng, pos.lat]) // Marker [lng, lat] coordinates
    .setPopup(new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        closeOnMove: true,
    }).setHTML("Current location:<br>" + pos.lng.toString() + " " + pos.lat.toString()))
    .addTo(map)
}

function createVanMarker(points) {
    var vanMarkers = []
    for (i in points) {
        if (i==5) {
            break;
        }
        var long = points[i][0].longitude
        var lat = points[i][0].latitude
        vanMarkers.push([
            points[i][0],
            new mapboxgl.Marker({color: '#65737D'})
            .setPopup(new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: true,
                closeOnMove: false,
            }).setHTML(long.toString() + " " + lat.toString() + '<br><a href="/customer/' + points[i][0].loginID +'/menu">Select Van</a>'))
            .setLngLat([long, lat]) // Marker [lng, lat] coordinates
            .addTo(map)]); // Add the marker to the map
    }
    return vanMarkers
}

function createMarkers(curPosition, vans) {
    var position = curPosition.getLngLat();
    var point_distance = []
    for (var van in vans) {
        var latitude = vans[van].latitude
        // console.log(latitude)
        var longitude = vans[van].longitude
        // console.log(longitude)
        var dist = distance([longitude, latitude],[position.lng, position.lat]);
        point_distance.push([vans[van], dist])
    }
    point_distance.sort((a, b) => (a[1] > b[1] ? 1: -1));
    var vanMarkers = createVanMarker(point_distance);
    return vanMarkers;
}

var {map, geolocate} = createMap()
map.addControl(geolocate)
geolocate.on('geolocate', function() {
    geolocate.trigger();
    setTimeout(function () {
        curPosition.remove();
        curPosition = createLocationMarker()}, 5000);
        for (i in vanMarkers) {
            vanMarkers[i][1].remove()
        }
        vanMarkers = []
        vanMarkers = createMarkers(curPosition, vans)
        // curPosition = map.getCenter()
    });
var curPosition = createLocationMarker()
var vanMarkers = createMarkers(curPosition, vans)
curPosition.on('dragend', function () {
    for (i in vanMarkers) {
        vanMarkers[i][1].remove()
    }
    vanMarkers = []
    vanMarkers = createMarkers(curPosition, vans)
})

// var map = new mapboxgl.Map({
//     container: 'map',
//     style: "https://api.jawg.io/styles/jawg-streets.json?access-token=WNOUDThn1YkriWZNGrnIqTGPSf40C2FkPsYJ1anAcEAcjBHopzZfVO0OddI9bRLI",
//     zoom: 14,
//     center: [144.95878, -37.7983416]
// });
// mapboxgl.setRTLTextPlugin(
//   "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"
// );