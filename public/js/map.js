mapboxgl.accessToken = 'pk.eyJ1IjoianVubGljIiwiYSI6ImNrbzVpY3psNjAzODMydnBiYWVycXd2cDIifQ.sEdF7QZVuor4EbMa3hWdfA'

var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [144.95878, -37.7983416], // starting position [lng, lat]
    zoom: 14 // starting zoom
});

var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: false
      },
      trackUserLocation: true,
      showAccuracyCircle: false
    });

map.addControl(geolocate)

var vans_array = vans
for (var van in vans_array) {
    var latitude = vans_array[van].latitude
    var longitude = vans_array[van].longitude
    var van_marker = new mapboxgl.Marker({
        color: '#FFFFFF'
        }) // initialize a new marker
        .setLngLat([longitude, latitude]) // Marker [lng, lat] coordinates
        .addTo(map); // Add the marker to the map
}

// var map = new mapboxgl.Map({
//     container: 'map',
//     style: "https://api.jawg.io/styles/jawg-streets.json?access-token=WNOUDThn1YkriWZNGrnIqTGPSf40C2FkPsYJ1anAcEAcjBHopzZfVO0OddI9bRLI",
//     zoom: 14,
//     center: [144.95878, -37.7983416]
// });
// mapboxgl.setRTLTextPlugin(
//   "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"
// );


// var geocoder = new MapboxGeocoder({ // Initialize the geocoder
//     accessToken: mapboxgl.accessToken, // Set the access token
//     mapboxgl: mapboxgl, // Set the mapbox-gl instance
//     marker: true, // Do not use the default marker style
//   });
  
//   // Add the geocoder to the map
//   map.addControl(geocoder);

var marker = new mapboxgl.Marker({
    color: '#000000'
    }) // initialize a new marker
    .setLngLat([144.95878, -37.7983416]) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map

// function getNearestVans(vans) {
//     // var cur_loc = geolocate.trigger()
//     // var cur_loc = [144.95878, -37.7983416]
//     for (van in vans) {
//         console.log(van_loc)
//         new mapboxgl.Marker({
//             color: '#FFFFFF'
//             }) // initialize a new marker
//             .setLngLat([van.longitude, van.latitude]) // Marker [lng, lat] coordinates
//             .addTo(map); // Add the marker to the map
//     }
// }

// map.on('load', function() {
//     geolocate.trigger(); //<- Automatically activates geolocation
//   });
// getNearestVans(vans);