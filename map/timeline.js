// Creates a brush and linking d3 timeline given a csv file 'filename' and the x and y attribute names
// function create_timeline_legacy(filename, x_attr, y_attr) {

//     var svg = d3.select("#timeline"),
//     svg_graph = d3.select('#graph'),
//     margin = {top: 20, right: 20, bottom: 20, left: 40},
//     margin2 = {top: 20, right: 20, bottom: 20, left: 40},
//     width = +svg.attr("width") - margin.left - margin.right,
//     width_graph = +svg_graph.attr("width") - margin.left - margin.right,
//     height = +svg_graph.attr("height") - margin.top - margin.bottom,
//     height_timeline = +svg.attr("height") - margin2.top - margin2.bottom;

//     var x = d3.scaleLinear().range([0, width_graph]),
//         x2 = d3.scaleLinear().range([0, width]),
//         y = d3.scaleLinear().range([height, 0]),
//         y2 = d3.scaleLinear().range([height_timeline, 0]);

//     var xAxis = d3.axisBottom(x),
//         xAxis2 = d3.axisBottom(x2),
//         yAxis = d3.axisLeft(y);

//     var brush = d3.brushX()
//         .extent([[0, 0], [width, height_timeline]])
//         .on("brush end", brushed);

//     var zoom = d3.zoom()
//         .scaleExtent([1, Infinity])
//         .translateExtent([[0, 0], [width_graph, height]])
//         .extent([[0, 0], [width, height_timeline]])
//         .on("zoom", zoomed);

//     var line = d3.line()
//         .x(function (d) { return x(d[x_attr]); })
//         .y(function (d) { return y(d[y_attr]); });

//     var line2 = d3.line()
//         .x(function (d) { return x2(d[x_attr]); })
//         .y(function (d) { return y2(d[y_attr]); });

//     var clip = svg.append("defs").append("svg:clipPath")
//         .attr("id", "clip")
//         .append("svg:rect")
//         .attr("width", width)
//         .attr("height", height)
//         .attr("x", 0)
//         .attr("y", 0); 


//     var Line_chart = svg_graph.append("g")
//         .attr("class", "focus")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//         .attr("clip-path", "url(#clip)");


//     var focus = svg_graph.append("g")
//         .attr("class", "focus")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     var context = svg.append("g")
//         .attr("class", "context")
//         .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

//     d3.csv(filename, type, function (error, data) {
//         if (error) throw error;
      
//         x.domain(d3.extent(data, function(d) { return d[x_attr]; }));
//         y.domain([0, d3.max(data, function (d) { return d[y_attr]; })]);
//         x2.domain(x.domain());
//         y2.domain(y.domain());
      
      
//         focus.append("g")
//             .attr("class", "axis axis--x")
//             .attr("transform", "translate(0," + height + ")")
//             .call(xAxis);
    
//         focus.append("g")
//             .attr("class", "axis axis--y")
//             .call(yAxis);
    
//         Line_chart.append("path")
//             .datum(data)
//             .attr("class", "line")
//             .attr("d", line);
    
//         context.append("path")
//             .datum(data)
//             .attr("class", "line")
//             .attr("d", line2);
    
      
//         context.append("g")
//             .attr("class", "axis axis--x")
//             .attr("transform", "translate(0," + height_timeline + ")");
//             // .call(xAxis2);
      
//         context.append("g")
//             .attr("class", "brush")
//             .call(brush)
//             .call(brush.move, x.range());
      
//         // svg.append("rect")
//         //     .attr("class", "zoom")
//         //     .attr("width", width)
//         //     .attr("height", height)
//         //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//         //     .call(zoom);
      
//         console.log(data);
//       });

//     function brushed() {
//         if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
//         var s = d3.event.selection || x2.range();
//         // console.log(s.map(x2.invert, x2));
//         x.domain(s.map(x2.invert, x2));
//         Line_chart.select(".line").attr("d", line);
//         focus.select(".axis--x").call(xAxis);
//         svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
//             .scale(width / (s[1] - s[0]))
//             .translate(-s[0], 0));

//         // Create an event that states the updated selected timeline range 
//         var evt = new CustomEvent('timeline_update', { detail: [Math.floor(s.map(x2.invert, x2)[0]), Math.floor(s.map(x2.invert, x2)[1])] });
//         window.dispatchEvent(evt);
//     }
    
//     function zoomed() {
//         if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
//         var t = d3.event.transform;
//         x.domain(t.rescaleX(x2).domain());
//         Line_chart.select(".line").attr("d", line);
//         focus.select(".axis--x").call(xAxis);
//         context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

//         // Create an event that states the updated selected timeline range 
//         var evt = new CustomEvent('timeline_update', { detail: [Math.floor(t.rescaleX(x2).domain()[0]), Math.floor(t.rescaleX(x2).domain()[1])] });
//         window.dispatchEvent(evt);
//     }

//     // Event listener
//     window.addEventListener('timeline_update', function (e) {
//         // console.log('Timeline range changed to:', e.detail);
//     });

//     function type(d) {
//         d[x_attr] = +d[x_attr];
//         d[y_attr] = +d[y_attr];
//         return d;
//     }
// }

// global data
var xAxisLine;
var lineChartsHeight;

function create_timeline(filename, x_attr, y_attr, line_charts_arr, line_chart_axes_arr, line_charts_arr_x) {
    // If window_dimensions haven't been initialized, initialize them now
    if (window_dimensions[0] == 0 && window_dimensions[1] == 0) {
        d3.csv(filename, type, function (error, data) {
            if (error) throw error;
            window_dimensions[0] = data[0][x_attr];
            window_dimensions[1] = data[data.length-1][x_attr]
        });
    }

    // handle variable for the timeline
    var handle;
        
    function redraw() {
        timeline_div = document.getElementById("timeline_div");    
        document.getElementById('timeline').setAttribute("width", ''+timeline_div.clientWidth);
        document.getElementById('timeline').setAttribute("height", ''+timeline_div.clientHeight);   
        
        var svg = d3.select("#timeline"),
        margin = {top: 20, right: 65, bottom: 50, left: 65},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

        // Clears the SVG graph to allow redrawing
        $("#timeline").empty();
    
        var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);
    
        var xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y);
    
        let focusses = d3.selectAll(".focus");
    
        var brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("start brush end", brushed)
    
        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [510, 210]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);
    
        var line = d3.line()
            .x(function (d) { return x(d[x_attr]); })
            .y(function (d) { return y(d[y_attr]); });
    
        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        d3.csv(filename, type, function (error, data) {
            if (error) throw error;
          
            x.domain(d3.extent(data, function(d) { return d[x_attr]; }));
            y.domain([d3.min(data, function (d) { return d[y_attr]; }), d3.max(data, function (d) { return d[y_attr]; })]);
        
            context.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line)
                .style("stroke", timeline_color);
        
            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
          
            var gBrush = context.append("g")
                .attr("class", "brush")
                .call(brush)
                // .call(brush.move, [window_dimensions[0], window_dimensions[1]].map(x));
                // .call(brush.move, x.range());

            // X - axis label for timeline
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("transform",
                    "translate(" + (width + margin.left) + " ," + 
                    (height + margin.top + 0.5*margin.bottom) + ")")
                .style("font-size", "16px")
                .text("Time (s)");

            handle = gBrush.selectAll(".handle--custom")
                .data([{type: "w"}, {type: "e"}])
                .enter().append("path")
                    .attr("class", "handle--custom")
                    .attr("fill", "#666")
                    .attr("fill-opacity", 0.9)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr("cursor", "ew-resize")
                    .attr("d", d3.arc()
                        .innerRadius(0)
                        .outerRadius(height / 2)
                        .startAngle(0)
                        .endAngle(function(d, i) { return i ? Math.PI : -Math.PI; }));

            gBrush.call(brush.move, [window_dimensions[0], window_dimensions[1]].map(x));

        });


        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            
            // Updated the handle appropriately as we brush
            var s_handle = d3.event.selection;
            if (s_handle == null) {
                handle.attr("display", "none");
            }
            else {
                handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s_handle[i] + "," + height / 2 + ")"; });
            }
            
            var s = d3.event.selection || x.range();

            for (var i=0; i<line_charts_arr.length ; i++) {
                line_charts_arr_x[i].domain(s.map(x.invert, x));
                focusses.select("#line" +i+ " .line").attr("d", line_charts_arr[i]);
                focusses.select(".axis--x").call(line_chart_axes_arr[i]);
            }
            svg.selectAll(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
    
            // Create an event that states the updated selected timeline range 
            var evt = new CustomEvent('timeline_update', { detail: [Math.floor(s.map(x.invert, x)[0]), Math.floor(s.map(x.invert, x)[1])] });
            window.dispatchEvent(evt);
        }
        
        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            // x.domain(t.rescaleX(x2).domain());
            for (var i=0; i<line_charts_arr.length; i++) {
                line_charts_arr_x[i].domain(t.rescaleX(x).domain());
                focusses.select(".line").attr("d", line_charts_arr[i]);
                focusses.select(".axis--x").call(line_chart_axes_arr[i]);
                context.select(".brush").call(brush.move, line_charts_arr_x[i].range().map(t.invertX, t));
            }
            // context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    
            // Create an event that states the updated selected timeline range 
            var evt = new CustomEvent('timeline_update', { detail: [Math.floor(t.rescaleX(x).domain()[0]), Math.floor(t.rescaleX(x).domain()[1])] });
            window.dispatchEvent(evt);
        }
    
        // Event listener
        window.addEventListener('timeline_update', function (e) {
            // Update the brush window dimensions in case of resizing (also make sure the window isn't of zero length)
            if (e.detail[0] != e.detail[1]) {
                window_dimensions = e.detail;
            }
        });
    }

    function type(d) {
        d[x_attr] = +d[x_attr];
        d[y_attr] = +d[y_attr];
        return d;
    }

    // Draw for the first time to initialize.
    redraw();

    // Redraw based on the new size whenever the browser window is resized.
    window.addEventListener("resize", redraw);
}

// Returns x, xAxis and line
function create_line_chart(divId, filename, x_attr, y_attr, line_color) {

    function redraw() {
        line_div = $(divId).parent()[0];
        $(divId).attr("width", line_div.clientWidth);
        $(divId).attr("height", line_div.clientHeight); 
        var svg = d3.select(divId),
        margin = {top: 20, right: 20, bottom: 40, left: 60},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
        lineChartsHeight = height;
        $(divId).empty();

        var x = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]);

        var xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y);

        var line = d3.line()
            .x(function (d) { return x(d[x_attr]); })
            .y(function (d) { return y(d[y_attr]); });

        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0); 

        var Line_chart = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(filename, type, function (error, data) {
            if (error) throw error;
            console.log(filename);
            x.domain(d3.extent(data, function(d) { return d[x_attr]; }));
            y.domain([d3.min(data, function (d) { return d[y_attr]; }), d3.max(data, function (d) { return d[y_attr]; })]);
            xAxisLine = x;
            focus.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis)
        
            Line_chart.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line)
                .style("stroke", line_color)
                .style("stroke-width", "3px");

            // X-axis label is commented out
            // svg.append("text")
            //     .attr("x", width - 25)
            //     .attr("y", height + margin.bottom + 10)
            //     .style("font-size", "12px")
            //     .text(x_attr);

            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0-0.01*margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "15px")
                .text(y_label_to_y_attr[y_attr]); 

            var mouseG = focus.append("g")
                .attr("class", "mouse-over-effects");

            // Create vertical line for hover
            mouseG.append("path") // this is the black vertical line to follow mouse
                .attr("class", "mouse-line")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("opacity", "0");

            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(data)
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");

            mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                .attr('width', width) // can't catch mouse events on a g element
                .attr('height', height)
                // .attr("transform", "translate(0," + height + ")")
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseout', function() { // on mouse out hide line, circles and text
                  for (var i = 0; i < 3; i++) {
                    d3.select("#line"+i+" .mouse-line")
                    .style("opacity", "0");
                  }
                })
                .on('mouseover', function() { // on mouse in show line, circles and text
                  for (var i = 0; i < 3; i++) {
                    d3.select("#line"+i+" .mouse-line")
                    .style("opacity", "1");
                  }
                })
                .on('mousemove', function() { // mouse moving over canvas
                  var mouse = d3.mouse(this);
                  for (var i = 0; i < 3; i++) {
                    d3.select("#line"+i+" .mouse-line")
                      .attr("d", function() {
                        var d = "M" + mouse[0] + "," + (height);
                        d += " " + mouse[0] + "," + (0);
                        return d;
                      });
                  }
                });
        set_hover_line(0);
        for (var i = 0; i < 3; i++) {
            d3.select("#line"+i+" .mouse-line")
            .style("opacity", "1");
          }
        });

        arr = [line, xAxis, x];
        if (divId == "#line0") {
            set_line_graph_globals(arr, 0);
        }
        else if (divId == "#line1") {
            set_line_graph_globals(arr, 1);
        }
        else if (divId == "#line2") {
            set_line_graph_globals(arr, 2);
        }

        return [line, xAxis, x];
    }

    function type(d) {
        d[x_attr] = +d[x_attr];
        d[y_attr] = +d[y_attr];
        return d;
    }

    // Draw for the first time to initialize.
    var output = redraw();


    // Redraw based on the new size whenever the browser window is resized.
    // window.addEventListener("resize", redraw);

    // Using different method because event listener may updated to many times and lead
    // to artifacts in the resulting line graphs
    var rtime;
    var timeout = false;
    var delta = 200;
    $(window).resize(function() {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });
    
    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            redraw();
        }               
    }

    return output;
}

function set_line_graph_globals(arr, idx) {
    line_array[idx] = arr[0];
    xAxis_array[idx] = arr[1];
    x_array[idx] = arr[2];
}

function clear_all_svg() {
    console.log("All SVGs cleared");
    $('#line0').empty();
    $('#line1').empty();
    $('#line2').empty();
    $('#timeline').empty();
}

// function to set the vertical-line on line charts upon hover on map
function set_hover_line(x_time) {
    console.log("set hover ran", x_time);
  for (var i = 0; i < 3; i++) {
    d3.select("#line"+i+" .mouse-line")
      .attr("d", function() {
        var d = "M" + xAxisLine(x_time) + "," + (lineChartsHeight);
        d += " " + xAxisLine(x_time) + "," + (0);
        return d;
      });
  }
}

// Creates line-charts when a tab is get clicked
function tab_clicked(id) {
    console.log(filename);
    clear_all_svg();
    timeline_color = 'red';
    if (id == 'tab1') {
        create_graphs(filename, "time", "noise_per_ms", "jamming_indicator", "rssi");
    }
    else if (id == 'tab2') {
        create_graphs(filename, "time", "alt", "vel_m_s", "satellites_used");    
    }
    else if (id == 'tab3') {
        create_graphs(filename, "time", "load", "ram_usage", "voltage_filtered_v");
    }
    else if (id == 'tab4') {
        create_graphs(filename, "time", "baro_temp_celcius", "baro_pressure_pa", "remaining");
    }
}

// Creates the timeline as well as 3 line graphs which are all brush-zoom linked
function create_graphs(filename, x_attr, y_attr1, y_attr2, y_attr3) {
    create_line_chart("#line0",filename, x_attr, y_attr1, "red");
    create_line_chart("#line1",filename, x_attr, y_attr2, "blue");
    create_line_chart("#line2",filename, x_attr, y_attr3, "green");
    create_timeline(filename, x_attr, y_attr1, line_array, xAxis_array, x_array);
}

// Removes timeline SVG and redraws timeline using a new y-attr and appropriate color
function update_timeline(y_attr, value) {
    $('#timeline').empty();
    colors = ['red', 'blue', 'green'];
    timeline_color = colors[value-1];
    create_timeline(filename, "time", y_attr, line_array, xAxis_array, x_array);
}

// Return attribute name, update timeline to match selected radio button
function timeline_get_attribute(tab, value) {
    console.log(tab);
    console.log(value);
    var attr = "";
    var security_attrs = ["noise_per_ms", "jamming_indicator", "rssi"];
    var physical_attrs = ["alt", "vel_m_s", "satellites_used"];
    var system_attrs = ["load", "ram_usage", "voltage_filtered_v"];
    var env_attrs = ["baro_temp_celcius", "baro_pressure_pa", "remaining"];
    if (tab == "tab1") {
        attr = security_attrs[value-1];
    }
    else if (tab == "tab2") {
        attr = physical_attrs[value-1];
    }
    else if (tab == "tab3") {
        attr = system_attrs[value-1];
    }
    else if (tab == "tab4") {
        attr = env_attrs[value-1];
    }

    update_timeline(attr, value);

    return attr;
}

// Updates the dataset
function update_file_timeline(fileNew) {
    filename = fileNew;
    window_dimensions = [0, 0];
    create_graphs(filename, "time", "noise_per_ms", "jamming_indicator", "rssi");
}

// Global variables that hold the line, xAxis and x-arrays of the line graphs
var filename = "milestone3.csv";
var line_array = [0,0,0];
var xAxis_array = [0,0,0];
var x_array = [0,0,0];

// Global variable that remembers the window_dimensions of the brush
var window_dimensions = [0, 0];

// Global color of the timeline (initially red but changes depending on radio value)
var timeline_color = 'red'

// Dictionarry to nicely label y-axes given an y attribute
var y_label_to_y_attr = {
    "noise_per_ms": "Noise (m/s)",
    "jamming_indicator": "Jamming",
    "rssi": "Signal Strength (RSSI)",
    "alt": "Altitude (mm)",
    "vel_m_s": "Velocity (m/s)",
    "satellites_used": "Satellites Used",
    "load": "CPU Load",
    "ram_usage": "Ram Usage",
    "voltage_filtered_v": "Voltage (V)",
    "baro_temp_celcius": "Temperature (Celcius)",
    "baro_pressure_pa": "Pressure (Pa)",
    "remaining": "Battery remaining (%)"
  };
//update_file_timeline(filename)