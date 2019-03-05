var L;
var $;

//initialize map
var map = L.map('map', {
    center: [33.4383, -112.07],
    zoom: 10,
    minZoom: 2,
    maxZoom: 18
});

//attempt to add a search bar
/*
var markersLayer = new L.layerGroup();

map.addLayer(markersLayer)

var controlSearch = new L.Control.search({
    position:'topright',
    layer: markersLayer,
    initial: false,
    zoom: 10,
    marker: false
});

map.addControl(controlSearch);
*/

//add leaflet tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoiam15YXR0IiwiYSI6ImNqbG9vMnc4MjA5ZTczcHBiYmlzYTNhcDAifQ.BaYtqvvn4Lzsl6mdotKeLQ'
}).addTo(map);


var attribute = "Pop2010";

//build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        }
    }

    //check result
    console.log(attributes);

    return attributes;
}

//Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute] + " million</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        }  
    });
}

//point to layer function
function pointToLayer(feature, LatLng, attributes) {
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    console.log(attribute);
}

//popup function
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    
    //build popup content string starting with city...Example 2.1 line 24
    var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

    //add formatted attribute to popup content string
    var year = attribute.split("Pop")[1];
    popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + "</p>";
    
    layer.bindPopup(popupContent);
    
     //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }/*,
        click: function(){
            $("#panel").html(popupContent);
        }*/
    });
    
    /*
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    */
    
    }
/*
}
*/


// Create new sequence controls
function createSequenceControls(map){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
        max: 11,
        min: 0,
        value: 0,
        step: 1
    });
    
    //add skip and reverse buttons
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    /*
    $('#reverse').html('<img src="img/reverse.png');
    $('#forward').html('<img src="img/forward.png');
    */
    // Step 5: click listener for buttons
    $('.skip').click(function(){
        //sequence
    });
    
    //Step 5: input listeners for slider
    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 11 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 11 : index;
        }

        //Step 8: update slider
        $('.range-slider').val(index);
        
        //Called in both skip button and slider event listener handlers
        //Step 9: pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
}


//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#0D69FF",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };
    
    //Step 4: Determine which attribute to visualize with proportional symbols
    // var attribute = "Pop2010";
    
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //examine the attribute value to check that it is correct
            console.log(feature.properties, attValue);
            
            geojsonMarkerOptions.radius = calcPropRadius(attValue);
                        
            return L.circleMarker(latlng, geojsonMarkerOptions);
            
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
}


//Import GeoJSON data
function getData(map){
   //load the data
   $.ajax("data/MC_AZ.json", {
       dataType: "json",
       success: function(response){
            //create an attributes array
            var attributes = processData(response);
           
           //call function to create proportional symbols
           createPropSymbols(response, map);
           createSequenceControls(map, attributes);
       }
   });
}


getData(map);


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
   //scale factor to adjust symbol size evenly
   var scaleFactor = 0.02;
   //area based on attribute value and scale factor
   var area = attValue * scaleFactor;
   //radius calculated based on area
   var radius = Math.sqrt(area/Math.PI);

   return radius;
}


$(document).ready(Map);


/*
I failed to get the slider widget to change to the correct attributes array and utilize their values to change the size of the circle markers but did do it with a static variable. I did not manage to add a search function into the map or any other additional map functions
*/