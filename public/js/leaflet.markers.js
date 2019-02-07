const mapboxToken = 'pk.eyJ1IjoiaGR1cmRsZSIsImEiOiJjanJxbTYzeTEwMjNlNDNudjAyNnpweG5nIn0.AwvSAFG6ID115icCGkg1gQ';

var map = L.map('map', {
    center: [53.6345098, -2.262089],
    minZoom: 4,
    zoom: 7
})

map.zoomControl.setPosition('topright');

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxToken, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: mapboxToken
}).addTo(map);

var personIcon = L.ExtraMarkers.icon({
    prefix: 'fa',
    icon: 'fa-user',
    markerColor: 'orange',
    iconColor: 'black',
    shape: 'circle'
});

var markerClusters = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {

        return L.ExtraMarkers.icon({
            prefix: 'fa',
            icon: 'fa-number',
            markerColor: 'green-light',
            iconColor: 'black',
            shape: 'square',
            number: cluster.getChildCount()
        });
    }
});

var mapmarkers = [];
L.Util.ajax("/markers").then(function (markers) {
    markers = markers.sort((a, b) => (a.lastname > b.lastname) ? 1 : ((b.lastname > a.lastname) ? -1 : 0));
    mapmarkers = markers;
    for (var i = 0; i < markers.length; ++i) {
        var popup = markers[i].firstname + ' ' + markers[i].lastname +
            '<br/>' + markers[i].location;
        var title = markers[i].firstname + ' ' + markers[i].lastname + ':' + markers[i].location;

        var m = L.marker([markers[i].lat, markers[i].lng], {icon: personIcon, title: title})
            .bindPopup(popup);

        markerClusters.addLayer(m);
    }

});

var sidebar = L.control.sidebar('sidebar', {
    position: 'left', closeButton: true
});

$(document).ready(function () {
    map.addLayer(markerClusters);

    var searchboxControl = createSearchboxControl();
    var control = new searchboxControl({});
    control._searchfunctionCallBack = function (searchkeywords) {
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }
        alert(searchkeywords);
    }
    map.addControl(control);

    map.addControl(sidebar);

});

map.on('move', function () {
    // construct an empty list to fill with onscreen markers
    var inBounds = [],
        // get the map bounds - the top-left and bottom-right locations
        bounds = map.getBounds();


    // for each marker, consider whether it is currently visible by comparing
    // with the current map bounds
    for (var i = 0, len = mapmarkers.length; i < len; i++) {
        var marker = mapmarkers[i];
        console.log(marker);
        if (bounds.contains(L.latLng(marker.lat, marker.lng))) {

            var text = '<strong>' + marker.firstname + ' ' + marker.lastname + '</strong> (' + marker.location + ')';

            inBounds.push(text);
        }
    }


    sidebar.setContent("<h1>Marker Map</h1>" + "<p>Found " + inBounds.length + " Markers:</p><p>" + inBounds.join('<br>\n') + "</p>");
});