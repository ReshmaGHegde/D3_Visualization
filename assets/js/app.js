var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv")
  .then(function(data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.abbr = +data.abbr;
    });


    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty)*0.8, d3.max(data, d => d.poverty)])
      .range([0, width]);

      //console.log(d.poverty);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.healthcare)*0.8, d3.max(data, d => d.healthcare)])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);


var circlesGroup = chartGroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "10")
.attr("fill", "lightgreen")
//.append("text")
//.append(function(data) { return data.abbr; })
.attr("opacity", "1");

var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
  });

 chartGroup.call(toolTip);

  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("transform", "rotate(-90)")
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Healthcare(%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty(%)");
});
