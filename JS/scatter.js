// set the dimensions and margins of the graph
var scatter_margin = {top: 10, right: 30, bottom: 30, left: 60},
    scatter_width = 460 - scatter_margin.left - scatter_margin.right,
    scatter_height = 400 - scatter_margin.top - scatter_margin.bottom;

// append the svg object to the body of the page
var scatter_svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
    .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

  // Add X axis
  var x2 = d3.scaleLinear()
    .domain([4, 8])
    .range([ 0, scatter_width ]);
  scatter_svg.append("g")
    .attr("transform", "translate(0," + scatter_height + ")")
    .call(d3.axisBottom(x2));

  // Add Y axis
  var y2 = d3.scaleLinear()
    .domain([0, 9])
    .range([ scatter_height, 0]);
  scatter_svg.append("g")
    .call(d3.axisLeft(y2));

  // Color scale: give me a specie name, I return a color
  var color2 = d3.scaleOrdinal()
    .domain([0,1,2])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

  // Add dots
  scatter_svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x2(d.Age); } )
      .attr("cy", function (d) { return y2(d.salary); } )
      .attr("r", 5)
      .style("fill", function (d) { return color2(d.cluster) } )

})
