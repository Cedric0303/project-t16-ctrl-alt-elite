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
    var vanMarkers = []
    vanPoints.forEach((van, index) => {
        if (index < 5) {
            var el = document.createElement('div');
            if (index==0) {
                el.className = 'nearestMarker'
            }
            else {
                el.className = 'marker'
            }
            var long = van[0].longitude
            var lat = van[0].latitude
            var vanID = van[0].loginID
            var dist = van[1]
            var marker = new mapboxgl.Marker(el)
                    .setPopup(new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: true,
                        closeOnMove: false,
                    })
                    .setHTML(long.toString() + " " + lat.toString() + '<br><a href="/customer/' + vanID +'/menu/?dist=' + Math.round(dist) + '">Select Van</a>'))
                    .setLngLat([long, lat]) // Marker [lng, lat] coordinates
                    .addTo(map); // Add the marker to the map
            vanMarkers.push([van[0], marker])
        }
    })
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
        curMarker.remove();
        curMarker = createLocationMarker(curPos)}, 100);
        for (i in vanMarkers) {
            vanMarkers[i][1].remove()
        }
        vanMarkers = createVanMarker(vanDist);
    });
var curMarker = createLocationMarker(curPos)
var vanDist = calcVanDist(curPos, vans); // [ [van Object, dist Number], ........]
var vanMarkers = createVanMarker(vanDist); // [ [van Object, marker Object], ........]
var nearestVan = vanDist[0][0] // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< this is the nearestVan


curMarker.on('dragend', function () {
    for (i in vanMarkers) {
        vanMarkers[i][1].remove()
    }
    var marker_pos = curMarker.getLngLat()
    curPos.long = marker_pos.lng;
    curPos.lat = marker_pos.lat;
    vanDist = calcVanDist(curPos, vans);
    vanMarkers = []
    vanMarkers = createVanMarker(vanDist);
    nearestVan = vanDist[0][0]
})

map.on('click', () => {
    vanMarkers.forEach((marker, index) => {
        if (marker != null) {
            var vanID = marker[0].loginID
            var lnglat = marker[1].getLngLat()
            var dist = vanDist[index][1]
            marker[1].getElement().addEventListener('click', () => {
                vanMarkers.forEach((marker2, index2)=> {
                    if (marker2 != null) {
                        if (index2 != index) {
                            var vanID = marker2[0].loginID
                            var lnglat = marker2[1].getLngLat()
                            var dist = vanDist[index2][1]
                            var el = document.createElement('div')
                            el.className = 'marker'
                            marker2[1].remove()
                            marker2[1] = new mapboxgl.Marker(el)
                                .setLngLat([lnglat.lng, lnglat.lat]) // Marker [lng, lat] coordinates
                                .addTo(map); // Add the marker to the map
                        }
                    }
                })
                var el = document.createElement('div')
                el.className = 'nearestMarker'
                marker[1].remove()
                marker[1] = new mapboxgl.Marker(el)
                    .setLngLat([lnglat.lng, lnglat.lat]) // Marker [lng, lat] coordinates
                    .addTo(map); // Add the marker to the map
                vanMarkers[index][1] = marker[1]
            })
        }
    })
})