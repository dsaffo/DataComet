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



function create_timeline(filename, x_attr, y_attr, line_charts_arr, line_chart_axes_arr, line_charts_arr_x) {
    var svg = d3.select("#timeline"),
    margin = {top: 20, right: 20, bottom: 20, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    let focusses = d3.selectAll(".focus");

    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("brush end", brushed);

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
        y.domain([0, d3.max(data, function (d) { return d[y_attr]; })]);
    
        context.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    
        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
      
        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());
    });


    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x.range();
        // console.log(s.map(x2.invert, x2));
        // x.domain(s.map(x2.invert, x2));
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
        // console.log('Timeline range changed to:', e.detail);
    });

    function type(d) {
        d[x_attr] = +d[x_attr];
        d[y_attr] = +d[y_attr];
        return d;
    }
}

// Returns x, xAxis and line
function create_line_chart(divId, filename, x_attr, y_attr) {
    var svg = d3.select(divId),
    margin = {top: 20, right: 20, bottom: 40, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

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
      
        x.domain(d3.extent(data, function(d) { return d[x_attr]; }));
        y.domain([d3.min(data, function (d) { return d[y_attr]; }), d3.max(data, function (d) { return d[y_attr]; })]);
      
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
            .attr("d", line);

        svg.append("text")
            .attr("x", width - 25)
            .attr("y", height + margin.bottom + 10)
            .style("font-size", "12px")
            .text(x_attr);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.left/3)
            .attr("dx", -2*margin.left)
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .text(y_attr);
    });

    function type(d) {
        d[x_attr] = +d[x_attr];
        d[y_attr] = +d[y_attr];
        return d;
    }

    return [line, xAxis, x];
}


// // Create a timeline visualization
// create_timeline_legacy("milestone3.csv","time","noise");
// console.log("timeline ran");
var line_array = [],
xAxis_array = [],
x_array = [],arr;
arr = create_line_chart("#line0","milestone3.csv","time","noise");
line_array.push(arr[0]);
xAxis_array.push(arr[1]);
x_array.push(arr[2]);
arr = create_line_chart("#line1","milestone3.csv","time","jamming_indicator");
line_array.push(arr[0]);
xAxis_array.push(arr[1]);
x_array.push(arr[2]);
arr = create_line_chart("#line2","milestone3.csv","time","remaining");
line_array.push(arr[0]);
xAxis_array.push(arr[1]);
x_array.push(arr[2]);


create_timeline("milestone3.csv","time","noise",line_array, xAxis_array, x_array);


// create_timeline("milestone3.csv","time","noise");
