// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [37, -122],
    zoom: 5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

//Query URL for data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//d3 to read data
d3.json(queryUrl, function(response) {

    createFeatures(response.features)
});

//Creating function for data
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h4>Location: " + feature.properties.place +
        "<br>Magnitude: "+ feature.properties.mag + 
        "<br> Depth: " + feature.geometry.coordinates[2] + "</h4");
    }
    console.log(earthquakeData)

//Create function for circles
    function markerColor(depth){
    if (depth <=10) {
        return "#6fad00";    
    } 
    else if (depth <30) {
        return "#a5d643";  
    }
    else if (depth <50) {
        return "#fff70a";  
    }
    else if (depth <70) {
        return "#f8c512";  
    }
    else if (depth <90) {
        return "#e88130";  
    }
    else {
        return "#cc0a00";  
    }
};

//Create function for circle size
function markerSize(mag){
    return mag * 25000
};


//Adding circles and assigning color/size values
var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
        return L.circle(latlng, {
            radius: markerSize(earthquakeData.properties.mag),
            fillColor: markerColor(earthquakeData.geometry.coordinates[2]),
            color: "#000",
            weight: 0.5,
            fillOpacity: 1,
            opacity: 0.5,
        });
    },
        onEachFeature: onEachFeature
    }).addTo(myMap);

//Create legend
var legend = L.control({
    position: "bottomright"
});

//Create data for legend
legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
    depth = [-10, 10, 30, 50, 70, 90],
    colors= ['#6fad00', '#a5d643', '#fff70a', '#f8c512', '#e88130', '#cc0a00'];
    
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colors [i] + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);
}