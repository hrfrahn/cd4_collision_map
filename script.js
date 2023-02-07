var map = L.map('map').setView([34.159, -118.38], 12);
var basemap =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map)

function bindBoundaryPopups(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}
function bindPointPopups(feature, layer) {
    if (feature.properties) {
        layer.bindPopup("<b>Date: "+feature.properties["Date Occurred"]+"<br>Age: "+feature.properties["Victim Age"]+"<br> Fatal Crash: "+feature.properties["Fatal Crash"]+"<br>MO Codes: "+feature.properties["MO Codes"]);
    }
}



var boundaryURL = "layers/cd4_divisions.geojson"

var boundary = new L.GeoJSON.AJAX("layers/cd4_divisions.geojson", {
    onEachFeature: bindBoundaryPopups,
    style: {
        "color":"#000000", 
        "weight": 2, 
        "fillOpacity": 0
    }
})
boundary.addTo(map)


function redMarker(shape){
    return {
    shape: shape,
    color: "white",
    fillColor: "red",
    radius: 6,
    weight: 1,
    opacity: 1,
    fillOpacity: 1}
}

    

function blackMarker(shape){
    return {
    shape: shape,
    color: "white",
    fillColor: "black",
    radius: 6,
    weight: 1,
    opacity: 1,
    fillOpacity: 1}
}

//MO codes: 3003 = ped, 3008 = bike

var collisions2019 = new L.GeoJSON.AJAX("layers/2019collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Killed\/Seriusly Injured"] == "True"){
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, redMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, redMarker("circle"))
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, blackMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, blackMarker("circle"))
            
        }
    }
})
var collisions2020 = new L.GeoJSON.AJAX("layers/2020collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Killed\/Seriusly Injured"] == "True"){
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, redMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, redMarker("circle"))
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, blackMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, blackMarker("circle"))        }
    }
})




var collisions2021 = new L.GeoJSON.AJAX("layers/2021collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Killed\/Seriusly Injured"] == "True"){
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, redMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, redMarker("circle"))
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, blackMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, blackMarker("circle"))        }
    }
})


var markerClusters = L.markerClusterGroup({ disableClusteringAtZoom: 13 }).addTo(map);

var collisions2022 = new L.GeoJSON.AJAX("layers/2022collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Killed\/Seriusly Injured"] == "True"){
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, redMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, redMarker("circle"))
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                return L.shapeMarker(latlng, blackMarker("triangle"))
            }
            //not ped so bike
            return L.circleMarker(latlng, blackMarker("circle"))        }
    }
})

// collisions2022.on('data:loaded', function(){
//     markers2022.addLayer(collisions2022)
//     markers2022.addTo(map)
// })


var dummy2019 = L.marker([0,0])
var dummy2020 = L.marker([0,0])
var dummy2021 = L.marker([0,0])
var dummy2022 = L.marker([0,0])


var overlayMaps = {
    2019: dummy2019, 
    2020: dummy2020,
    2021: dummy2021, 
    2022: dummy2022
}

var layerControl = L.control.layers(null, overlayMaps).addTo(map)

var heatmapURL = "layers/heatmap_smallerkernels.tif"

fetch(heatmapURL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
        parseGeoraster(arrayBuffer).then(georaster => {
        const min = georaster.mins[0];
        const max = georaster.maxs[0];
        const range = georaster.ranges[0];

        var scale = chroma.scale(["green", "green", "yellow", "red"]);
        var layer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.5,
            resolution: 128,
            pixelValuesToColorFn: function(pixelValues) {
                var pixelValue = pixelValues[0]; 
                // if there's zero density, don't return a color
                if (pixelValue < 0.005) return null;
                var scaledPixelValue = ((pixelValue - min) / range)+0.3;
                var color = scale(scaledPixelValue).hex();
                return color;
              },

        });
        layerControl.addOverlay(layer, "heatmap")
        layer.addTo(map)
    });
 });


 map.on('overlayadd', function(e){
    if(e.name=='2019'){
        markerClusters.addLayer(collisions2019)
    }
    if(e.name=='2020'){
        markerClusters.addLayer(collisions2020)
    }
    if(e.name=='2021'){
        markerClusters.addLayer(collisions2021)
    }
    if(e.name=='2022'){
        markerClusters.addLayer(collisions2022)
    }
 })
 map.on('overlayremove', function(e){
    if(e.name=='2019'){
        markerClusters.removeLayer(collisions2019)
    }
    if(e.name=='2020'){
        markerClusters.removeLayer(collisions2020)
    }
    if(e.name=='2021'){
        markerClusters.removeLayer(collisions2021)
    }
    if(e.name=='2022'){
        markerClusters.removeLayer(collisions2022)
    }
 })
