    var selectedTractIndex = -1;
    var visualizedTraitList = []
    var visMin = 10000;
    var visMax = -10000;
    var overlay = null;
    var currentCircleRadius = 304.8;
    var imageIcon = {
        url :'assets/img/school.JPG'
      };

    //% with bachelor's degree
    var educationRates = []
    var educationRateMin = 10000;
    var educationRateMax = -10000;
    var readEducation = function() {
      d3.csv("assets/data/tractEducation.csv", function(data){
        educationRates = new Array();
        for(var i = 0; i < data.length; i++) {
          var rate = parseFloat(data[i].percentBachelor);
          educationRates.push(rate);
          if(rate > educationRateMax) {
            educationRateMax = rate;
          }
          if(rate < educationRateMin) {
            educationRateMin = rate;
          }

        }
        
      });
    };
    readEducation();

  //% pop receiving food stamps or other public assistance
  var publicRates = new Array();
  var publicRateMin = 10000;
  var publicRateMax = -10000;
  var readPublic = function() {

    d3.csv("assets/data/tractPublicAssistance.csv", function(data){
      publicRates = []
      for(var i = 0; i < data.length; i++) {
        var rate = parseFloat(data[i].assistance);
        publicRates.push(rate);
        if(rate > publicRateMax) {
          publicRateMax = rate;
        }
        if(rate < publicRateMin) {
          publicRateMin = rate;
        }
      }

    });
  };
  readPublic();

  //median income
  var medianIncomes = new Array();
  var incomeMin = 10000000;
  var incomeMax = -10000000;
  var readIncome = function() {
    d3.csv("assets/data/tractMedianIncome.csv", function(data){
      medianIncomes = []
      for(var i = 0; i < data.length; i++) {
        if(data[i].income == "null") {
          medianIncomes.push("null");
        }
        else {
          var rate = parseInt(data[i].income)
          medianIncomes.push(rate);
          if(rate > incomeMax) {
            incomeMax = rate;
          }
          if(rate < incomeMin) {
            incomeMin = rate;
          }
        }
      }
    });
  };
  readIncome();

  //% without health insurance
  var healthRates = []
  var healthRateMin = 10000;
  var healthRateMax = -10000;
  var readHealth = function() {
    d3.csv("assets/data/tractNoHealthInsurance.csv", function(data){
      healthRates = new Array();
      for(var i = 0; i < data.length; i++) {
        var rate = parseFloat(data[i].healthrate);
        healthRates.push(rate);
        if(rate > healthRateMax) {
          healthRateMax = rate;
        }
        if(rate < healthRateMin) {
          healthRateMin = rate;
        }

      }
    });
  };
  readHealth();

  //% below poverty line
  var povertyRates= []
  var povertyMin = 10000;
  var povertyMax = -10000;
  var readPoverty = function() {
    d3.csv("assets/data/tractPovertyRatio.csv", function(data){
      povertyRates = new Array();
      for(var i = 0; i < data.length; i++) {
        var rate = parseFloat(data[i].povertyrate);
        povertyRates.push(rate);
        if(rate > povertyMax) {
          povertyMax = rate;
        }
        if(rate < povertyMin) {
          povertyMin = rate;
        }

      }
    });
  };
  readPoverty();

  //% female-headed households
  var fhhs = []
  var fhhMin = 10000;
  var fhhMax = -10000;
  var readFHHs = function() {
    d3.csv("assets/data/tractFHH.csv", function(data){
      fhhs = new Array();
      for(var i = 0; i < data.length; i++) {
        var rate = parseFloat(data[i].fhh);
        fhhs.push(rate);
        if(rate > fhhMax) {
          fhhMax = rate;
        }
        if(rate < fhhMin) {
          fhhMin = rate;
        }

      }
    });
  };
  readFHHs();

  //% household size > 4
  var hhSizes = []
  var hhSizeMin = 10000;
  var hhSizeMax = -10000;
  var readHHSizes = function() {
    d3.csv("assets/data/tractHHSize.csv", function(data){
      hhSizes = new Array();
      for(var i = 0; i < data.length; i++) {
        var rate = parseFloat(data[i].sizeGreaterThan5);
        hhSizes.push(rate);
        if(rate > hhSizeMax) {
          hhSizeMax = rate;
        }
        if(rate < hhSizeMin) {
          hhSizeMin = rate;
        }

      }
    });
  };
  readHHSizes();

  //% Under 18
  var under18s = []
  var u18Min = 10000;
  var u18Max = -10000;
  var readUnder18 = function() {
    d3.csv("assets/data/tractUnder18.csv", function(data){
      under18s = new Array();
      for(var i = 0; i < data.length; i++) {
        var rate = parseFloat(data[i].percentUnder18);
        under18s.push(rate);
        if(rate > u18Max) {
          u18Max = rate;
        }
        if(rate < u18Min) {
          u18Min = rate;
        }

      }
    });
  };
  readUnder18();

    //offender population density
    var offenderDensities = []
    var offenderRateMin = 10000;
    var offenderRateMax = -10000;
    var readOffenderDensities = function() {
      d3.csv("assets/data/tractOffenderDensity1.csv", function(data){
        offenderDensities = new Array();
        for(var i = 0; i < data.length; i++) {
          var rate = parseFloat(data[i].offenderDensity);
          offenderDensities.push(rate);
          if(rate > offenderRateMax) {
            offenderRateMax = rate;
          }
          if(rate < offenderRateMin) {
            offenderRateMin = rate;
          }

        }
        visMin = offenderRateMin;
        visMax = offenderRateMax;
        visualizedTraitList = offenderDensities;
      });
    };
    readOffenderDensities();


    window.initMap = function() {
      var el = document.querySelector('#heatmap');
      var width = $('#heatMapContainer').width();
      var height = $('#heatmap').height();
      var projection = d3.geoAlbersUsa().scale(5000).translate([width / 8, height / 2.5]);
      var google = window.google;
      var markers = [];
      var offenderMarkers = [];
      var locationCircles = [];

      var map = new google.maps.Map(el, {
        center: new google.maps.LatLng(38.659175,  -90.396881),
        zoom: 8,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
      'styled_map']
    }
  });
      //Google Maps search api: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });


  function SVGOverlay (map) {
    this.map = map;
    this.svg = null;
    this.coords = [];

    this.onPan = this.onPan.bind(this);

    this.setMap(map);
  }

  SVGOverlay.prototype = new google.maps.OverlayView();
  var g;
  var layer;

  SVGOverlay.prototype.onAdd = function () {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.style.position = 'absolute';
    this.svg.style.top = 0;
    this.svg.style.left = 0;
    this.svg.style.width = $('#heatMapContainer').width();
    this.svg.style.height = $('#heatmap').height();
    this.svg.style.pointerEvents = 'none';
    layer = d3.select(this.getPanes().overlayLayer).append("div");

    var bounds = this.map.getBounds(),
    center = bounds.getCenter(),
    ne = bounds.getNorthEast(),
    sw = bounds.getSouthWest();
    var topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
    var bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
    var scale = Math.pow(2, this.map.getZoom());

    var proj = this.map.getProjection();



    g = layer.append("svg")
    .attr('width', width)
    .attr('height', height);

    d3.json("assets/data/mo.json", function(error, data) {
      if (error) throw error;
      
      
      var simplifyTolerace = 0.0008;
      var newdata = [];
      var i = 0;
      data.features.forEach(function(d) {
        var points = d.geometry.coordinates[0];
        newpoints = simplify(points,simplifyTolerace,false);
        i+=1; 

        d.geometry.coordinates[0] = newpoints;
      });
      mapdata = data;
      var colorScale = d3.scaleLinear().domain([visMin,visMax]).range(["#ffc1c1","#a30000"]);



      var addListenersOnPolygon = function(polygon) {
        google.maps.event.addListener(polygon, 'click', function (event) {
          selectedTractIndex = polygon.index;
        });  
      }


      for(i = 0; i < mapdata.features.length; i++) {
        var currentCoords = mapdata.features[i].geometry.coordinates[0];
        var polygonCoords = [];
      //console.log(colorScale(visualizedTraitList[i]));
      for(j = 0; j < currentCoords.length; j++) {
        polygonCoords.push({lat: currentCoords[j][1], lng: currentCoords[j][0]});
      }
      var tractPolygon = new google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: colorScale(visualizedTraitList[i]),
        fillOpacity: 0.45,
        index: i
      });

      markers.push(tractPolygon);
    }
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      addListenersOnPolygon(markers[i]);
    }


  });

    d3.csv("assets/data/sexOffenders.csv", function(data) {
      for(var i = 0; i < data.length; i++) {
        var longitude = parseFloat(data[i].longitude);
        var lat = parseFloat(data[i].latitude);
        var coord = [longitude, lat];
        if(coord[1] < 40.559 && coord[0] > -95.8
          && coord[1] > 35.7 && coord[0] < -88.9
          ) {
          var offenderMarker = new google.maps.Marker({
          position: {lat: coord[1], lng: coord[0]},
          map: map,
        });
        offenderMarker.addListener('click', function(event) {
          if(offenderMarker.radiusCircle != null) {
            offenderMarker.radiusCircle.setMap(null);
            offenderMarker.radiusCircle = null;
          }
          else {
            addCircle(event.latLng);
          }    
        })

        //credit to http://www.techstrikers.com/GoogleMap/Code/how-to-draw-circle-on-marker-click-in-google-map.php
        function addCircle(location) {

          var offenderCircle = new google.maps.Circle({      
            strokeColor: '#000000',      
            strokeOpacity: 0.8,      
            strokeWeight: 1,      
            fillColor: '#00FF0F',      
            fillOpacity: 0.8,      
            map: map,      
            center: location,      
            radius: currentCircleRadius,    
            draggable:false    
          });
          offenderCircle.addListener('click', function(event) { 
            offenderCircle.setMap(null);
          });
          offenderMarker.radiusCircle = offenderCircle;
          locationCircles.push(offenderCircle);    
        }

        offenderMarkers.push(offenderMarker);
        
      }
    }
  });

    d3.csv("assets/data/publicschools.csv", function(data) {
      
      for(var i = 0; i < data.length; i++) {
        var longitude = parseFloat(data[i].longitude);
        var lat = parseFloat(data[i].latitude);
        var coord = [longitude, lat];
        if(coord[1] < 40.559 && coord[0] > -95.8
          && coord[1] > 35.7 && coord[0] < -88.9
          ) {
          var schoolMarker = new google.maps.Marker({
            position: {lat: coord[1], lng: coord[0]},
            icon: imageIcon,
            map: map
          });

          schoolMarker.addListener('click', function(event) {
          if(schoolMarker.radiusCircle != null) {
            schoolMarker.radiusCircle.setMap(null);
            schoolMarker.radiusCircle = null;
          }
          else {
            addCircle(event.latLng);
          }    
        });

        //credit to http://www.techstrikers.com/GoogleMap/Code/how-to-draw-circle-on-marker-click-in-google-map.php
        function addCircle(location) {

          var schoolCircle = new google.maps.Circle({      
            strokeColor: '#000000',      
            strokeOpacity: 0.8,      
            strokeWeight: 1,      
            fillColor: '#00FF0F',      
            fillOpacity: 0.8,      
            map: map,      
            center: location,      
            radius: currentCircleRadius,    
            draggable:false    
          });
          schoolCircle.addListener('click', function(event) { 
            schoolCircle.setMap(null);
          });
          schoolMarker.radiusCircle = schoolCircle;
          locationCircles.push(schoolCircle);    
        }

      }
    }

  });

    d3.csv("assets/data/privateschools.csv", function(data) {
      for(var i = 0; i < data.length; i++) {
        var longitude = parseFloat(data[i].longitude);
        var lat = parseFloat(data[i].latitude);
        var coord = [longitude, lat];
        if(coord[1] < 40.559 && coord[0] > -95.8
          && coord[1] > 35.7 && coord[0] < -88.9
          ) {
          var schoolMarker = new google.maps.Marker({
            position: {lat: coord[1], lng: coord[0]},
            icon: imageIcon,
            map: map
          });

          schoolMarker.addListener('click', function(event) {
          if(schoolMarker.radiusCircle != null) {
            schoolMarker.radiusCircle.setMap(null);
            schoolMarker.radiusCircle = null;
          }
          else {
            addCircle(event.latLng);
          }    
        });

        //credit to http://www.techstrikers.com/GoogleMap/Code/how-to-draw-circle-on-marker-click-in-google-map.php
        function addCircle(location) {

          var schoolCircle = new google.maps.Circle({      
            strokeColor: '#000000',      
            strokeOpacity: 0.8,      
            strokeWeight: 1,      
            fillColor: '#00FF0F',      
            fillOpacity: 0.8,      
            map: map,      
            center: location,      
            radius: currentCircleRadius,    
            draggable:false    
          });
          schoolCircle.addListener('click', function(event) { 
            schoolCircle.setMap(null);
          });
          schoolMarker.radiusCircle = schoolCircle;
          locationCircles.push(schoolCircle);    
        }
      }
    }

  });

    d3.csv("assets/data/childcarefacilities.csv", function(data) {
      for(var i = 0; i < data.length; i++) {
        var longitude = parseFloat(data[i].longitude);
        var lat = parseFloat(data[i].latitude);
        var coord = [longitude, lat];
        if(coord[1] < 40.559 && coord[0] > -95.8
          && coord[1] > 35.7 && coord[0] < -88.9
          ) {
          var schoolMarker = new google.maps.Marker({
            position: {lat: coord[1], lng: coord[0]},
            icon: imageIcon,
            map: map
          });

          schoolMarker.addListener('click', function(event) {
          if(schoolMarker.radiusCircle != null) {
            schoolMarker.radiusCircle.setMap(null);
            schoolMarker.radiusCircle = null;
          }
          else {
            addCircle(event.latLng);
          }    
        });

        function addCircle(location) {

          var schoolCircle = new google.maps.Circle({      
            strokeColor: '#000000',      
            strokeOpacity: 0.8,      
            strokeWeight: 1,      
            fillColor: '#00FF0F',      
            fillOpacity: 0.8,      
            map: map,      
            center: location,      
            radius: currentCircleRadius,    
            draggable:false    
          });
          schoolCircle.addListener('click', function(event) { 
            schoolCircle.setMap(null);
          });
          schoolMarker.radiusCircle = schoolCircle;
          locationCircles.push(schoolCircle);    
        }
      }
    }

  });


    this.onPan();
    document.body.appendChild(this.svg);
    this.map.addListener('center_changed', this.onPan);
  }
  SVGOverlay.prototype.changeRadius = function(newRadius) {
    currentCircleRadius = newRadius;
    for(var i = 0; i < locationCircles.length; i++) {
      locationCircles[i].setRadius(newRadius);
    }
  }
  
  SVGOverlay.prototype.onPan = function() {

  };

  SVGOverlay.prototype.onRemove = function () {
    this.map.removeListener('center_changed', this.onPan);
    this.svg.parentNode.removeChild(this.svg);
    this.svg = null;
  };



  SVGOverlay.prototype.draw = function () {
   var colorScale = d3.scaleLinear().domain([visMin,visMax]).range(["#ffc1c1","#a30000"]);
   for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];

  this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.svg.style.position = 'absolute';
  this.svg.style.top = 0;
  this.svg.style.left = 0;
  this.svg.style.width = $('#heatMapContainer').width();
  this.svg.style.height = $('#heatmap').height();
  this.svg.style.pointerEvents = 'none';
  layer = d3.select(this.getPanes().overlayLayer).append("div");

  var bounds = this.map.getBounds(),
  center = bounds.getCenter(),
  ne = bounds.getNorthEast(),
  sw = bounds.getSouthWest();
  var topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
  var bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
  var scale = Math.pow(2, this.map.getZoom());

  var proj = this.map.getProjection();



  g = layer.append("svg")
  .attr('width', width)
  .attr('height', height);

  d3.json("assets/data/mo.json", function(error, data) {
    if (error) throw error;


    var simplifyTolerace = 0.0008;
    var newdata = [];
    var i = 0;
    data.features.forEach(function(d) {
      var points = d.geometry.coordinates[0];
      newpoints = simplify(points,simplifyTolerace,false);
      i+=1; 

      d.geometry.coordinates[0] = newpoints;
    });
    mapdata = data;
    var colorScale = d3.scaleLinear().domain([visMin,visMax]).range(["#ffc1c1","#a30000"]);

    var googleProjection = d3.geoProjection(function(x,y) {
        //console.log(x,y);
        var latLngPt = new google.maps.LatLng((180.0/Math.PI)*y, (180.0/Math.PI)*x);
        var worldPoint = proj.fromLatLngToPoint(latLngPt);
        return [worldPoint.x, worldPoint.y];

      });
    var mercator = d3.geoProjection(function(x, y) {
      return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
    });

    var identityProjection = d3.geoProjection(function(x,y) {
      console.log(x,y);
      return [x,y];
    });

    var x = d3.scaleLinear()
    .range([0, width]);

    var y = d3.scaleLinear()
    .range([0, height]);


    for(i = 0; i < mapdata.features.length; i++) {
      var currentCoords = mapdata.features[i].geometry.coordinates[0];
      var polygonCoords = [];
      //console.log(colorScale(visualizedTraitList[i]));
      for(j = 0; j < currentCoords.length; j++) {
        polygonCoords.push({lat: currentCoords[j][1], lng: currentCoords[j][0]});
      }
      var tractPolygon = new google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: colorScale(visualizedTraitList[i]),
        fillOpacity: 0.45
      });
      markers.push(tractPolygon);
    }
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  });


    this.onPan();
    document.body.appendChild(this.svg);
    this.map.addListener('center_changed', this.onPan);
  };




  fetch('map-styles.json')
  .then((response) => response.json());
  overlay = new SVGOverlay(map);

  $("#offenderDensity").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readOffenderDensities();
      visMin = offenderRateMin;
      visMax = offenderRateMax;
      visualizedTraitList = offenderDensities;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

  $("#bdegree").on("click",function() {
    if ($(this).attr("data-tog") == "0"){
      readEducation();
      visMin = educationRateMin;
      visMax = educationRateMax;
      visualizedTraitList = educationRates;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

  $("#fstamps").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readPublic();
      visMin = publicRateMin;
      visMax = publicRateMax;
      visualizedTraitList = publicRates;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });


  $("#medIncome").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readIncome();
      visMin = incomeMin;
      visMax = incomeMax;
      visualizedTraitList = medianIncomes;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

  $("#healthRate").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readHealth();
      visMin = healthRateMin;
      visMax = healthRateMax;
      visualizedTraitList = healthRates;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

  $("#povertyRate").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readPoverty();
      visMin = povertyMin;
      visMax = povertyMax;
      visualizedTraitList = povertyRates;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

  $("#fhhRate").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readPoverty();
      visMin = fhhMin;
      visMax = fhhMax;
      visualizedTraitList = fhhs;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

  $("#hhSize").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readHHSizes();
      visMin = hhSizeMin;
      visMax = hhSizeMax;
      visualizedTraitList = hhSizes;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

  $("#under18Rate").on("click", function() {
    if ($(this).attr("data-tog") == "0"){
      readUnder18();
      visMin = u18Min;
      visMax = u18Max;
      visualizedTraitList = under18s;
      overlay.draw();
      $(this).attr("data-tog", "1")
      $(this).attr("style", 'background-color:#e0e2e5' );
      $(this).siblings().attr("style", 'background-color:#fff' );
      $(this).siblings().attr("data-tog", "0");
    }
  });

};

$('#radiusSlider').mousemove(function (){
          document.getElementById("circleRadius").innerHTML=this.value*(1000/40);
          circleRadiusValue = document.getElementById("circleRadius").innerHTML;
          var feetToMeters = parseFloat(circleRadiusValue) * 0.3048;
          if(overlay != null) {
            overlay.changeRadius(feetToMeters);
          }
});