
// d3.csv('assets/data/data.csv', function (data) {
//   // Variables
//   var body = d3.select('body')
// 	var margin = { top: 50, right: 50, bottom: 80, left: 50 }
// 	var h = 500 - margin.top - margin.bottom
// 	var w = 500 - margin.left - margin.right
// 	var formatPercent = d3.format('.2%')
// 	// Scales
//   var colorScale = d3.scale.category20()
//   var xScale = d3.scale.linear()
//     .domain([
//       d3.min([0,d3.min(data,function (d) { return d.smokes })]),
//       d3.max([0,d3.max(data,function (d) { return d.smokes })])
//     	])
//     .range([0,w])
//   var yScale = d3.scale.linear()
//     .domain([
//     	d3.min([0,d3.min(data,function (d) { return d.age })]),
//     	d3.max([0,d3.max(data,function (d) { return d.age })])
//     	])
//     .range([h,0]);
// 	// SVG
// 	var svg = body.append('svg')
// 	    .attr('height',h + margin.top + margin.bottom)
// 	    .attr('width',w + margin.left + margin.right)
// 	  .append('g')
// 	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
// 	// X-axis
// 	var xAxis = d3.svg.axis()
// 	  .scale(xScale)
// 	  .tickFormat(formatPercent)
// 	  .ticks(5)
// 	  .orient('bottom')
//   // Y-axis
// 	var yAxis = d3.svg.axis()
// 	  .scale(yScale)
// 	  .tickFormat(formatPercent)
// 	  .ticks(5)
// 	  .orient('left')
//   // Circles
//   var circles = svg.selectAll('circle')
//       .data(data)
//       .enter()
//     .append('circle')
//       .attr('cx',function (d) { return xScale(d.smokes) })
//       .attr('cy',function (d) { return yScale(d.age) })
//       .attr('r','10')
//       .attr('stroke','black')
//       .attr('stroke-width',1)
//       .attr('fill',function (d,i) { return colorScale(i) })
//       .on('mouseover', function () {
//         d3.select(this)
//           .transition()
//           .duration(500)
//           .attr('r',20)
//           .attr('stroke-width',3)
//       })
//       .on('mouseout', function () {
//         d3.select(this)
//           .transition()
//           .duration(500)
//           .attr('r',10)
//           .attr('stroke-width',1)
//       })
//     .append('title') // Tooltip
//       .text(function (d) { return d.variable +
//                            '\nReturn: ' + formatPercent(d.aror) +
//                            '\nStd. Dev.: ' + formatPercent(d.asd) })
//   // X-axis
//   svg.append('g')
//       .attr('class','axis')
//       .attr('transform', 'translate(0,' + h + ')')
//       .call(xAxis)
//     .append('text') // X-axis Label
//       .attr('class','label')
//       .attr('y',-10)
//       .attr('x',w)
//       .attr('dy','.71em')
//       .style('text-anchor','end')
//       .text('Annualized Standard Deviation')
//   // Y-axis
//   svg.append('g')
//       .attr('class', 'axis')
//       .call(yAxis)
//     .append('text') // y-axis Label
//       .attr('class','label')
//       .attr('transform','rotate(-90)')
//       .attr('x',0)
//       .attr('y',5)
//       .attr('dy','.71em')
//       .style('text-anchor','end')
//       .text('Annualized Return')
// })
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append('g');

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([5, d3.max(data, d => d.smokes)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([15, d3.max(data, d => d.age)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".75");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Smokes: ${d.smokes}<br>Age: ${d.age}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("smoke");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Smokers vs Age by State");
  });
