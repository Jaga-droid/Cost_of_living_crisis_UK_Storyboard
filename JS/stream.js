// set the dimensions and margins of the graph
const area_margin = {top: 20, right: 30, bottom: 30, left: 60},
    area_width = window.innerWidth*0.8 - area_margin.left - area_margin.right,
    area_height = window.innerHeight*0.8 - area_margin.top - area_margin.bottom;

// append the svg object to the body of the page
const area_svg = d3.select("#streamid")
  .append("svg")
    .attr("width", area_width + area_margin.left + area_margin.right)
    .attr("height", area_height + area_margin.top + area_margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${area_margin.left}, ${area_margin.top})`);

d3.csv("https://raw.githubusercontent.com/Jaga-droid/Cost_of_living_crisis_UK_Storyboard/main/Resources/Analysis_Results/housepricetime.csv",
function (d) {
  return {
    Year: d3.timeParse("%Y")(d.Year),
    AveragePrice: d.AveragePrice
  }
}).then( function(data) {

   // Add X axis --> it is a date format
   const x = d3.scaleTime()
   .domain(d3.extent(data, d => d.Year))
   .range([ 0, area_width ]);
   area_svg.append("g")
     .attr("transform", `translate(0,${area_height})`)
     .call(d3.axisBottom(x));

 // Add Y axis
 const y = d3.scaleLinear()
   .domain([0, d3.max(data, d => +d.AveragePrice)])
   .range([ area_height, 0 ]);
   area_svg.append("g")
     .call(d3.axisLeft(y));

 // Add the area
 area_svg.append("path")
   .datum(data)
   .attr("fill", "#cce5df")
   .attr("stroke", "#69b3a2")
   .attr("stroke-width", 1.5)
   .attr("d", d3.area()
     .x(d => x(d.Year))
     .y0(y(0))
     .y1(d => y(d.AveragePrice)))
});
