// set the dimensions and margins of the graph
const line_margin = {top: 10, right: 30, bottom: 30, left: 60},
    line_width = window.innerWidth*0.9 - line_margin.left - line_margin.right,
    line_height = window.innerHeight*0.4 - line_margin.top - line_margin.bottom;

// append the line_svg object to the body of the page
const line_svg = d3.select("#lineswitch")
  .append("svg")
    .attr("width", line_width + line_margin.left + line_margin.right)
    .attr("height", line_height + line_margin.top + line_margin.bottom)
  .append("g")
    .attr("transform", `translate(${line_margin.left},${line_margin.top})`);

// Add X axis
const line_x = d3.scaleTime()
  .range([0, line_width]);

line_svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${line_height})`)

// Add Y axis
const line_y = d3.scaleLinear()
  .range([line_height, 0]);

line_svg.append("g")
  .attr("class", "y-axis");

function updateChart(file_name) {
  //Read the data
  d3.csv(file_name,

    // When reading the csv, I must format variables:
    function(d){
      return { date : d3.timeParse("%Y-%m-%d")(d.date), World : d.World }
    }).then(

    // Now I can use this dataset:
    function(data) {

      // Update X axis domain
      line_x.domain(d3.extent(data, function(d) { return d.date; }));

      // Update Y axis domain
      line_y.domain([0, d3.max(data, function(d) { return +d.World; })]);

      //Select the x-axis group and update axis using updated scale
      line_svg.select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(line_x));

      //Select the y-axis group and update axis using updated scale
      line_svg.select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(line_y));

      // Add the line
      const line = line_svg.selectAll(".line")
        .data([data]);

      line.enter()
        .append("path")
        .attr("class", "line")
        .merge(line)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return line_x(d.date) })
          .y(function(d) { return line_y(d.World) })
        );

      line.exit().remove();
    });
}

// initial chart drawn with filename new_cases.csv
updateChart("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/cases_deaths/new_cases.csv");
