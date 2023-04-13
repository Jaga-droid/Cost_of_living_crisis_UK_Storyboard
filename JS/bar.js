// Set up barchart_margin, width, height values for the barchart_svg element.
const barchart_margin = { top: 20, right: 20, bottom: 50, left: 70 };
const barchart_width = 800 - barchart_margin.left - barchart_margin.right;
const barchart_height = 400 - barchart_margin.top - barchart_margin.bottom;

// Create the SVG element with given dimensions and barchart_margins.
const barchart_svg = d3.select("#mybar")
  .append("svg")
  .attr("width", barchart_width + barchart_margin.left + barchart_margin.right)
  .attr("height", barchart_height + barchart_margin.top + barchart_margin.bottom)
  .append("g")
  .attr("transform", "translate(" + barchart_margin.left + "," + barchart_margin.top + ")");

// Load the data from the CSV file using d3.csv() function.
d3.csv("https://raw.githubusercontent.com/Jaga-droid/Cost_of_living_crisis_UK_Storyboard/main/Resources/Analysis_Results/dispose.csv").then(function(data) {
   

    // Map the data to arrays for the x-axis category names and the y-axis data values.
 
    const categories = data.map(d => d.Country);
    const values = data.map(d => +d.disposable_income);

    // Define scale functions for the x- and y-axes.
    const xScale = d3.scaleBand()
        .domain(categories)
        .range([0, barchart_width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([barchart_height, 0]);

    // Add the x- and y-axes to the chart.
    barchart_svg.append("g")
      .attr("transform", "translate(0," + barchart_height + ")")
      .call(d3.axisBottom(xScale));

    barchart_svg.append("g")
      .call(d3.axisLeft(yScale));

    // Add the bars to the chart using the data values and unique colors for each bar.
    barchart_svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Country))
        .attr("y", d => yScale(+d.disposable_income))
        .attr("width", xScale.bandwidth())
        .attr("height", d => barchart_height - yScale(+d.disposable_income))
        .style("fill", (d, i) => d3.schemeSet2[i % 8]); // Use unique colors for each bar.
});
