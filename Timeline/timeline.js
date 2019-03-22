// Creates a brush and linking d3 timeline given a csv file 'filename' and the x and y attribute names
function create_timeline(filename, x_attr, y_attr) {

    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 210, left: 40},
    margin2 = {top: 630, right: 20, bottom: 20, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var x = d3.scaleLinear().range([0, width]),
        x2 = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var line = d3.line()
        .x(function (d) { return x(d[x_attr]); })
        .y(function (d) { return y(d[y_attr]); });

    var line2 = d3.line()
        .x(function (d) { return x2(d[x_attr]); })
        .y(function (d) { return y2(d[y_attr]); });

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

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.csv(filename, type, function (error, data) {
        if (error) throw error;
      
        x.domain(d3.extent(data, function(d) { return d[x_attr]; }));
        y.domain([0, d3.max(data, function (d) { return d[y_attr]; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());
      
      
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);
    
        Line_chart.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    
        context.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line2);
    
      
        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);
      
        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());
      
        // svg.append("rect")
        //     .attr("class", "zoom")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //     .call(zoom);
      
        console.log(data);
      });

    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        // console.log(s.map(x2.invert, x2));
        x.domain(s.map(x2.invert, x2));
        Line_chart.select(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));

        // Create an event that states the updated selected timeline range 
        var evt = new CustomEvent('timeline_update', { detail: [Math.floor(s.map(x2.invert, x2)[0]), Math.floor(s.map(x2.invert, x2)[1])] });
        window.dispatchEvent(evt);
    }
    
    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        Line_chart.select(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

        // Create an event that states the updated selected timeline range 
        var evt = new CustomEvent('timeline_update', { detail: [Math.floor(t.rescaleX(x2).domain()[0]), Math.floor(t.rescaleX(x2).domain()[1])] });
        window.dispatchEvent(evt);
    }

    // Event listener
    window.addEventListener('timeline_update', function (e) {
        console.log('Timeline range changed to:', e.detail);
    });

    function type(d) {
        d[x_attr] = +d[x_attr];
        d[y_attr] = +d[y_attr];
        return d;
    }

    // const focus_line = svg.append('g')
    //     .attr('class', 'focus_line')
    //     .style('display', 'none');
  
    // focus_line.append('circle')
    //     .attr('r', 4.5);

    // focus_line.append('line')
    //     .classed('x', true);

    // d3.selectAll('.focus_line')
    //   .style('opacity', 0.7);

    // d3.selectAll('.focus_line circle')
    //   .styles({
    //     fill: 'none',
    //     stroke: 'black'
    //   });

    // d3.selectAll('.focus_line line')
    //   .styles({
    //     fill: 'none',
    //     'stroke': 'black',
    //     'stroke-width': '1.5px',
    //     'stroke-dasharray': '3 3'
    // });

    // svg.append('rect')
    //   .attr('class', 'overlay')
    //   .attr('width', width)
    //   .attr('height', height)
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //   .on('mouseover', () => focus_line.style('display', null))
    //   .on('mouseout', () => focus_line.style('display', 'none'))
    //   .on('mousemove', mousemove);

    // d3.select('.overlay')
    //     .styles({
    //     fill: 'none',
    //     'pointer-events': 'all'
    // });

    // function mousemove() {
    //     console.log("I am called");
    //     console.log(x.invert(d3.mouse(this)[0]))
        // const x0 = x.invert(d3.mouse(this)[0]);
        // const i = bisectDate(data, x0, 1);
        // const d0 = data[i - 1];
        // const d1 = data[i];
        // const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        // focus_line.attr('transform', `translate(${x(d.date)}, ${y(d.close)})`);
        // focus_line.select('line.x')
        //   .attr('x1', 0)
        //   .attr('x2', -x(d.date))
        //   .attr('y1', 0)
        //   .attr('y2', 0);
  
        // focus_line.select('line.y')
        //   .attr('x1', 0)
        //   .attr('x2', 0)
        //   .attr('y1', 0)
        //   .attr('y2', height - y(d.close));
  
        // focus_line.select('text').text(formatCurrency(d.close));
//       }
}

// Create a timeline visualization
create_timeline("milestone3_timeline.csv","time","noise");

