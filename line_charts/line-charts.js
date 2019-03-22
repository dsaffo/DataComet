// Global Variables
// Set the dimensions of the canvas / graph
var color = ['#ca0020','#1f78b4','#a6611a','#33a02c'];

// Functions
function makeAllLineCharts(csvFile) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    makeOneLineChart(csvFile, margin, 'timestamp', 'jamming_indicator', '#line1', color[0]);
    makeOneLineChart(csvFile, margin, 'timestamp', 'alt', '#line2', color[1]);
    makeOneLineChart(csvFile, margin, 'timestamp', 'noise', '#line3', color[2]);
    makeOneLineChart(csvFile, margin, 'timestamp', 'rssi', '#line4', color[3]);
}

function makeOneLineChart(csvFile, margin, xField, yField, divId, colr) {

    var width = 500 - margin.left - margin.right;
    var height = 280 - margin.top - margin.bottom;
    var title = "Title: " + xField + " vs " + yField;
    // Parse the timestamp
    var parseTime = d3.timeFormat("%M%S");

    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    var xAxis = d3.axisBottom(x);
        // .orient("bottom");

    var yAxis = d3.axisLeft(y)
        .ticks(10);

    // Define the line
    var valueline = d3.line()
            .x(function(d) { return x(d[xField]); })
            .y(function(d) { return y(d[yField]); });

    // Adds the svg canvas
    var svg = d3.select(divId)
        .append("text")
            .attr("class", "title")
            .style('color', colr)
            .style('margin', width/2 - margin.right)
            .text(title)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    // Get the data
    d3.csv(csvFile, function(error, data) {
        data.forEach(function(d) {
            var seconds = Math.floor(d[xField] / 1000000);
            var date = new Date();
            d[xField] = parseTime(new Date(0,0,0,0,0,seconds));
            d[yField] = +d[yField];
        });
        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d[xField]; }));
        y.domain([0, d3.max(data, function (d) { return d[yField]; })]);

       // Add the line
        svg.append("path")
            .attr("class", "line")
            .style("stroke", colr)
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
              .attr("x", width-45)
              .attr("dy", "-0.5em")
              .style("text-anchor", "start")
              .text(xField);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text(yField);
    }); // csv close
}

makeAllLineCharts("milestone3.csv");

