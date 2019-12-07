//---------------------------------------------------------------------------------------
// ------------------------------- Step 1: Create The Map -------------------------------
//---------------------------------------------------------------------------------------
// All parameter options such as attributionControl, minZoom, style, etc... are found here... https://docs.mapbox.com/mapbox-gl-js/api/#map

mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5jIiwiYSI6Im53UGgtaVEifQ.RJiPqXwEtCLTLl-Vmd1GWQ';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/dylanc/ck3w08cz608g01cmnhwew0dxa',
zoom: 0,
attributionControl: false,
});

map.addControl(new mapboxgl.AttributionControl({
    compact: true,   
    }));

toggleLayer ('satellite', ['mapbox-satellite'], 'Satallite Baselayer');

function toggleLayer(htmlID, ids, name) {
    var link = document.createElement('button');
    link.setAttribute('id', htmlID);
    link.href = '#';
    link.className = '';
    link.textContent = name;
   

    link.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        for (layers in ids){
            var visibility = map.getLayoutProperty(ids[layers], 'visibility');
            if (visibility === 'visible') {
                map.setLayoutProperty(ids[layers], 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(ids[layers], 'visibility', 'visible');
            }
         }
    };
    var layers = document.getElementById('controls');
    layers.appendChild(link);
}

map.on('load', function () {
// We use D3 to fetch the JSON here so that we can parse and use it separately
// from GL JS's use in the added source. You can use any request method (library
// or otherwise) that you want.
d3.json('routes/AZT.json', function(err, data) {
if (err) throw err;
 
// save full coordinate list for later
var coordinates = data.features[0].geometry.coordinates;
 
// start by showing just the first coordinate
data.features[0].geometry.coordinates = [coordinates[0]];
 
// add it to the map
map.addSource('trace', { type: 'geojson', data: data });
map.addLayer({
"id": "trace",
"type": "line",
"source": "trace",
"paint": {
"line-color": "yellow",
"line-opacity": 0.75,
"line-width": 5
}
});

/*var output = $('h1');
        var isPaused = false;
        var time = 0;
        var timer;
        var t = window.setInterval(function() {
          if(!isPaused) {
            time++;
            output.text("Seconds: " + time);
          }
        }, 1000);*/

        //with jquery
        $('.pause').on('click', function(e) {
          e.preventDefault();
          isPaused = true;
          timer = window.clearInterval();
        });

        $('.fly').on('click', function(e) {
          e.preventDefault();
          isPaused = false;
          map.jumpTo({ 'center': coordinates[0], 'zoom': 11 });
                    map.setPitch(30);
                    i=0;
                    // on a regular basis, add more coordinates from the saved list and update the map
                    timer = window.setInterval(function() {
                    if (i < coordinates.length) {
                    data.features[0].geometry.coordinates.push(coordinates[i]);
                    map.getSource('trace').setData(data);
                    map.panTo(coordinates[i]);
                    i++;
                    } else {
                    window.clearInterval(timer);
                    }
                    }, 100);
        });
 
// setup the viewport
map.jumpTo({ 'center': coordinates[0], 'zoom': 11 });
map.setPitch(30);
 
// on a regular basis, add more coordinates from the saved list and update the map
var i = 0;
var timer = window.setInterval(function() {
if (i < coordinates.length) {
data.features[0].geometry.coordinates.push(coordinates[i]);
map.getSource('trace').setData(data);
map.panTo(coordinates[i]);
i++;
} else {
window.clearInterval(timer);
}
}, 100);
});
});

