//the map
var map = L.map("map-canvas", {
  center: [0, 0],
  zoom: 19,
  maxZoom: 25,
  minZoom: 1
});


//some data holders
var droneData = [];
var start = [];
var window2 = [];
// tabs and radio
var radioValue = 1;
var yAttr = 'noise_per_ms';

var div = d3.select(".tooltip")
  .style("opacity", 0);



//
function draw(data) {

  startlat = data[0].lat / 10000000;
  startlon = data[0].lon / 10000000;
  map.remove();
  map = L.map("map-canvas", {
    center: [startlat, startlon],
    zoom: 19,
    maxZoom: 25,
    minZoom: 1
  });
  var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    maxNativeZoom: 18
  });
  Esri_WorldTopoMap.addTo(map);


  droneData = data.map(function (d) {
    endlat = d.lat / 10000000;
    endlon = d.lon / 10000000;
    d.startlatLng = [+startlat, +startlon];
    d.endlatLng = [+endlat, +endlon];
    startlat = endlat;
    startlon = endlon;
    return d;
  });
  //console.log(droneData);
  window2 = [0, droneData.length];
  //console.log(window2);
  function selectColorScale(data, value, cmap) {

    max = d3.max(data, function (d) {
      return parseFloat(d[value]);
    });
    min = d3.min(data, function (d) {
      return parseFloat(d[value]);
    });

    if (value === 'cpu_load' || value === 'ram_usage' || value === 'remaining') {
      max = 1;
      min = 0;
    }

    //console.log(min,max)
    var colorScale = d3.scaleSequential(d3["interpolate" + cmap])
      .domain([min, max]);

    return colorScale;
  }

  function widthScale(data, value) {
    max = d3.max(data, function (d) {
      return parseFloat(d[value]);
    });
    min = d3.min(data, function (d) {
      return parseFloat(d[value]);
    });


    if (value === 'cpu_load' || value === 'ram_usage' || value === 'remaining') {
      max = 1;
      min = 0;
    }

    return widthScaler = d3.scaleLinear().domain([min, max]).range([1, 40]);
  }

  function drawMap(window) {

    var cmap = 'Reds';

    if (radioValue == 1) {
      cmap = 'Reds';
    } else if (radioValue == 2) {
      cmap = 'Blues';
    } else {
      cmap = 'Greens';
    }

    var pathOverlay = L.d3SvgOverlay(function (sel, proj) {
      
      
      var strokeWidth = map.getZoom()/3;

      d3.selectAll('.drone').remove();
      d3.selectAll('.fullPath').remove();
      d3.selectAll('circle').remove();

      selectedData = [];

      //color scale for battery
      //var max = d3.max(droneData,function(d){return parseInt(d['jamming_indicator'])});
      //var median = d3.median(droneData,function(d){return d.jamming_indicator});
      //console.log('max',max);
      //var colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, max]);

      //our line generator
      var line = d3.line()
        .x(function (d) {
          return proj.latLngToLayerPoint(d).x;
        })
        .y(function (d) {
          return proj.latLngToLayerPoint(d).y;
        });

      var smoothLine = d3.line()
        .x(function (d) {
          return proj.latLngToLayerPoint(d.startlatLng).x;
        })
        .y(function (d) {
          return proj.latLngToLayerPoint(d.startlatLng).y;
        })
        .curve(d3.curveCatmullRom.alpha(0));

      if (document.getElementById('ghostSwitch').checked === true) {
        var fullPath = sel.selectAll('path')
          .data([droneData])
          .enter().append('path')
          .attr('class', 'fullPath')
          .attr('stroke', 'white')
          .attr('fill', 'none')
          .style('stroke-width', 3)
          .style('opacity', 0.5)
          .style("stroke-dasharray", "10,20")
          .attr('d', smoothLine);
      }

      //timeWindow = window;
      window2 = window;

      //for(i = timeWindow[0]; i < timeWindow[1]; i++){
      //  selectedData.push(droneData[i])
      //}

      selectedData = droneData.slice(window[0], window[1] + 1);

      if (document.getElementById('colorSwitch').checked === true) {
        colorScale = selectColorScale(selectedData, yAttr, cmap);
      } else {
        colorScale = selectColorScale(droneData, yAttr, cmap);
      }



      var path = sel.selectAll('path')
        .data(selectedData)
        .enter().append('path')
        .attr('id', function (d) {
          return 'time:' + d.time;
        })
        .attr('stroke', function (d) {
          return colorScale(parseFloat(d[yAttr]));
        })
        .attr('class', 'drone')
        .attr('d', function (d) {
          return line([d.startlatLng, d.endlatLng]);
        })
        .style('stroke-width', strokeWidth)

        .on('mouseover', function (d) {
          d3.select(this).style("cursor", "pointer");
          d3.select(this).style('stroke-width', d3.select(this).style('stroke-width') * 2);
          set_hover_line(d.time);
          div.transition()
            .duration(200)
            .style("opacity", 0.9);
          div.html("Time: " + d.time + "s<br/> Value: " + d[yAttr])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
          if (document.getElementById('widthSwitch').checked === true) {

            if (document.getElementById('colorSwitch').checked === true) {
          var widthScaler = widthScale(selectedData, yAttr);
        } else {
          var widthScaler = widthScale(droneData, yAttr);
        }
        path.style('stroke-width', function (d) {
          return widthScaler(d[yAttr]);
        });
          } else {
            d3.select(this).style('stroke-width', strokeWidth);
          }
          set_hover_line_out();
        });

      if (document.getElementById('widthSwitch').checked === true) {
        //console.log('width switch')
        if (document.getElementById('colorSwitch').checked === true) {
          var widthScaler = widthScale(selectedData, yAttr);
        } else {
          var widthScaler = widthScale(droneData, yAttr);
        }
        path.style('stroke-width', function (d) {
          return widthScaler(d[yAttr]);
        });
        //path.attr('stroke-width',  function(d){return d[yAttr];});
      }



      var circle = sel.append("circle")
        .attr("cx", function (d) {
          return proj.latLngToLayerPoint(selectedData[selectedData.length - 1].endlatLng).x;
        })
        .attr("cy", function (d) {
          return proj.latLngToLayerPoint(selectedData[selectedData.length - 1].endlatLng).y;
        })
        .attr("r", map.getZoom() / 2)
        .attr('fill', function (d) {
          return colorScale(selectedData[selectedData.length - 1][yAttr]);
        });





      //console.log('zoom', map.getZoom());
      //console.log('scale', proj.scale);



    }, options = {
      zoomDraw: false
    });

    pathOverlay.addTo(map);
  }


  //draw the path for the first time
  drawMap([0, droneData.length]);


  map.on('zoomend', function () {
    drawMap(window2);
  });

  window.addEventListener('timeline_update', function (e) {
    //if(colorSwitch === true){
    //  colorSwitch = false;
    //  document.getElementById("colorSwitch").checked = false;
    //}
    drawMap(e.detail);
  });

  document.getElementById("widthSwitch").addEventListener("change", function () {
    drawMap(window2);
  });
  document.getElementById("colorSwitch").addEventListener("change", function () {
    drawMap(window2);
  });
  document.getElementById("ghostSwitch").addEventListener("change", function () {
    drawMap(window2);
  });

  // Initializing Materialize objects
  $(document).ready(function () {
    $('.tabs').tabs();
  });
  $(document).ready(function () {
    $('select').formSelect();
  });

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function () {
    $('.fixed-action-btn').floatingActionButton();
  });

  $(".tab").click(function () {
    id = this.id;
    console.log("tab clicked");

    $("#radio1_input").prop("checked", true);
    radioValue = 1;
    yAttr = timeline_get_attribute(id, radioValue);
    if (id === 'tab1') {
      //console.log("Clicked", id);
      tab_clicked(id);
    } else if (id === 'tab2') {
      //console.log("Clicked", id);
      tab_clicked(id);
    } else if (id === 'tab3') {
      //console.log("Clicked", id);
      tab_clicked(id);
    } else if (id === 'tab4') {
      //console.log("Clicked", id);
      tab_clicked(id);
    }
    drawMap(window2);
  });

  // Need to listeners for radio change (one when user clicks and one when the tab is changed)!!
  $("input[name='group1']").change(function () {
    var tab = $(".active").parent().attr('id');
    radioValue = $(this).val();
    yAttr = timeline_get_attribute(tab, radioValue);
    //console.log(new_attr, radio_value);
    drawMap(window2);
  });
}


function loadData(file) {
  // $('.tabs a[href="#1"]').trigger('click');
  // var instance = M.Tabs.getInstance(document.getElementsByClassName('.tabs'));
  // instance.updateTabIndicator();
  // $('ul.tabs').tabs();
  // $('ul.tabs').tabs('select', '1');
  $('ul.tabs').tabs();
  var el = document.getElementById("tabs_id");
  var instance = M.Tabs.getInstance(el);
  instance.select('1');


  d3.csv(file, function (data) {
    draw(data);
  });
}

document.getElementById('logSelect').addEventListener('change', function () {
  loadData(document.getElementById('logSelect').value);
  update_file_timeline(document.getElementById('logSelect').value);
  document.getElementById("colorSwitch").checked = false;
  document.getElementById("widthSwitch").checked = false;
  setMetaDataInfo(document.getElementById('logSelect').value);
});



function linkHoverOn(xAttr) {
  d3.select('[id="time:' + xAttr + '"]')
    .style('stroke-width', d3.select('[id="time:' + xAttr + '"]')
      .style('stroke-width') * 2);
}

function linkHoverOut(xAttr) {
  // Make sure the xAttr value is valid
  if (xAttr >= 0) {
    d3.select('[id="time:' + xAttr + '"]')
      .style('stroke-width', d3.select('[id="time:' + xAttr + '"]')
        .style('stroke-width') / 2);
  }
}

function setMetaDataInfo(file) {
  d3.csv('data/metadata.csv', function (data) {
    function filterCriteria(d) {
      fileName = d.dataset === file;
      return "data/" + fileName;
    }
    var newData = data.filter(filterCriteria);
    var airframe = newData[0].Airframe;
    var time = newData[0].LoggingDuration;
    var date = newData[0].Date;
    var dist = newData[0].Distance;

    document.getElementById("metaData").innerHTML = "Airframe: " + airframe + " Date: " + date + " Duration: " + time + " Distance: " + dist;
  });
}
loadData(document.getElementById('logSelect').value);
update_file_timeline(document.getElementById('logSelect').value);
setMetaDataInfo(document.getElementById('logSelect').value);
