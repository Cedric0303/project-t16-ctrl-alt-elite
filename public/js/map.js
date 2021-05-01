var mymap = L.map('map').setView([-37.8029981, 144.9561669], 15);
        
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
}).addTo(mymap);
// mymap.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});

var marker = L.marker([-37.8029981, 144.9561669]).addTo(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a marker.");
