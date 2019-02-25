var L;
var $;
var data;

var map = L.map('map', {
    center: [33.4383, -112.07],
    zoom: 9,
    minZoom: 2,
    maxZoom: 18
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoiam15YXR0IiwiYSI6ImNqbG9vMnc4MjA5ZTczcHBiYmlzYTNhcDAifQ.BaYtqvvn4Lzsl6mdotKeLQ'
}).addTo(map);


//Step 2: Import GeoJSON data
function getData(map){
   //load the data
   $.ajax("data/MC_AZ.json", {
       dataType: "json",
       success: function(response){
           //call function to create proportional symbols
           // createPropSymbols(response, map);
       }
   });
}


getData(map);


//load the data...Example 2.3 line 22
$.ajax("data/MC_AZ.json", {
        dataType: "json",
    success: function(response) {
        //create a Leaflet GeoJSON layer and add it to the map
        L.geoJson(response, {
            containerPointToLayerPoint: function (feature, LatLng) {
                return L.circleMarker(LatLng, geojsonMarkerOptions);
            //onEachFeature: featurePopUp;
            }
        }).addTo(map);
    }
})

/*
//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
   //scale factor to adjust symbol size evenly
   var scaleFactor = 50;
   //area based on attribute value and scale factor
   var area = attValue * scaleFactor;
   //radius calculated based on area
   var radius = Math.sqrt(area/Math.PI);

   return radius;
};
*/


/*
function cactus(feature, layer) {
    layer.bindPopUp("<h1>Hi, I am a pop-up!</h1>");
    layer.setIcon(tearDrop);
}

function featurePopUp(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var attribute = "Pop2000"


var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
*/



/*
//create a Leaflet GeoJSON layer and add it to the map
   L.geoJson(data, {
       containerPointToLayerPoint: function (feature, latlng) {

            //Step 5: For each feature, determine its value for the selected attribute
           var attValue = Number(feature.properties[attribute]);

          //Step 6: Give each feature's circle marker a radius based on its attribute value
           geojsonMarkerOptions.radius = calcPropRadius(attValue);

           return L.circleMarker(latlng, geojsonMarkerOptions);
       }
   }).addTo(map);
*/




// var tearDrop = new L.Icon({iconUrl: "img/marker-icon.png"});



/*
L.geoJSON("js/MaricopaCounty.js/maricopa", {
    
    onEachFeature: cactus
    
}).addTo(map);
*/

// mcLayer.addData("js/MaricopaCounty.js/maricopa");

$(document).ready(createMap);