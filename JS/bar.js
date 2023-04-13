// Set up margin, width, height values for the barchart_svg element.
const margin = { top: 20, right: 20, bottom: 50, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG element with given dimensions and margins.
const barchart_svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the data from the CSV file using d3.csv() function.
d3.csv("data.csv").then(function(data) {
    // Use console.log() to verify that data has been loaded successfully.
    console.log(data);

    // Map the data to arrays for the x-axis category names and the y-axis data values.
 
    const categories = data.map(d => d.Country);
    const values = data.map(d => +d.disposable_income);

    // Define scale functions for the x- and y-axes.
    const xScale = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([height, 0]);

    // Add the x- and y-axes to the chart.
    barchart_svg.append("g")
      .attr("transform", "translate(0," + height + ")")
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
        .attr("height", d => height - yScale(+d.disposable_income))
        .style("fill", (d, i) => d3.schemeSet2[i % 8]); // Use unique colors for each bar.
});
