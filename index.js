function removeAllLayersExcept(new_layer) {
  console.log('new_layer._leaflet_id:' + new_layer._leaflet_id);
  var layer_index = 0;
  map.eachLayer(function(layer) {
    if (layer_index > 0 && layer._leaflet_id != new_layer._leaflet_id && layer._leaflet_id) {
      console.log('layer removed:' + layer._leaflet_id);
      setTimeout(function () { // give a little time before removing previous tile layer because new one will appear with some transition.
        map.removeLayer(layer);
      }, 500);
    }
    layer_index++;
  });
}

window.onload = function() {

  $("#mapContainer").append("<div id='map'></div>");

  var map = new L.Map('map', {
    center: [45.521069, -122.651820],
    zoom: 11
  });

  cartodb.createLayer(map, {
    user_name: 'manny',
    type: 'cartodb',
    sublayers: [
      {
        type: 'http',
        urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
      },
      {
        sql: 'select * from dataset_batestype',
        cartocss: '/** category visualization */#dataset_batestype {   polygon-opacity: 0.7;   line-color: #000000;   line-width: 0.2;   line-opacity: 1;}#dataset_batestype[nh_typo10_bps=""] {   polygon-fill: #A6CEE3;  polygon-opacity: 0;   line-color: #000000;   line-width: 0.1;   line-opacity: 0.5;}#dataset_batestype[nh_typo10_bps="Continued Loss"] {   polygon-fill: #212b59;}#dataset_batestype[nh_typo10_bps="Dynamic"] {   polygon-fill: #712529;}#dataset_batestype[nh_typo10_bps="Early: Type 1"] {   polygon-fill: #f28705;}#dataset_batestype[nh_typo10_bps="Early: Type 2"] {   polygon-fill: #d85b38;}#dataset_batestype[nh_typo10_bps="Late"] {   polygon-fill: #555b8e;}#dataset_batestype[nh_typo10_bps="Susceptible"] {   polygon-fill: #F6C14F;}',
        cartocss_version: '2.1.1'
      },
      {
        type: 'http',
        urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'
      }
    ]
  }).addTo(map).on('done', function (layer) {
    layer1 = layer;
  });
}

$('#layer-selector li').click(function() {
  var url = $(this).data('url');

  cartodb.createLayer(map, url)
  .addTo(map).on('done', function(layer) {
    removeAllLayersExcept(layer);
  });
});