// Set up the dimensions and margins for the plot
const scatterplot_width = 600;
const scatterplot_height = 400;
const scatterplot_margin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 60
};

// Select the DOM element to append the SVG to
const scatterplot_svg = d3.select('#scatter')
    .append('svg')
    .attr('width', scatterplot_width + scatterplot_margin.left + scatterplot_margin.right)
    .attr('height', scatterplot_height + scatterplot_margin.top + scatterplot_margin.bottom);

d3.csv("https://raw.githubusercontent.com/Jaga-droid/Cost_of_living_crisis_UK_Storyboard/main/Resources/Analysis_Results/minimumwage.csv").then(function (data) {

    // Define the scales for the X and Y axis
    const scatterplot_xScale = d3.scaleLinear()
        .range([0, scatterplot_width])
        .domain([10, 64]);
    const scatterplot_yScale = d3.scaleLinear()
        .range([scatterplot_height, 0])
        .domain([3, 18]);

    // Define the colors to use for each cluster
    const scatterplot_colorScale = d3.scaleOrdinal()
        .domain([0, 1, 2])
        .range(['red', 'green', 'blue']);

    // Add the points to the plot
    scatterplot_svg.selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => scatterplot_xScale(d.Age))
        .attr('cy', d => scatterplot_yScale(d.salary))
        .attr('r', 5)
        .attr('fill', d => scatterplot_colorScale(d.cluster));

    // Add axes to the plot
    const scatterplot_xAxis = d3.axisBottom(scatterplot_xScale);
    const scatterplot_yAxis = d3.axisLeft(scatterplot_yScale);
    scatterplot_svg.append("g")
        .attr("transform", `translate(${scatterplot_margin.left}, ${scatterplot_height + scatterplot_margin.top})`)
        .call(scatterplot_xAxis);
    scatterplot_svg.append("g")
        .attr("transform", `translate(${scatterplot_margin.left}, ${scatterplot_margin.top})`)
        .call(scatterplot_yAxis);

    // Add labels to the plot
    scatterplot_svg.append("text")
        .attr("transform", `translate(${scatterplot_width/2 + scatterplot_margin.left}, ${scatterplot_height + scatterplot_margin.top + 40})`)
        .style("text-anchor", "middle")
        .text("Age");
    scatterplot_svg.append("text")
        .attr("transform", `translate(${scatterplot_margin.left - 40}, ${scatterplot_height/2 + scatterplot_margin.top}) rotate(-90)`)
        .style("text-anchor", "middle")
        .text("Salary");

    // Add legend to the plot
    const legend = scatterplot_svg.selectAll(".legend")
        .data(scatterplot_colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    // Add circles to the legend
    legend.append("circle")
        .attr("cx", scatterplot_width - 18)
        .attr("r", 5)
        .style("fill", scatterplot_colorScale);

    // Add text to the legend
    legend.append("text")
        .attr("x", scatterplot_width - 24)
        .attr("y", 3)
        .attr("dy", ".45em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d === 0 ? "Below Minimum Wage" : (d === 1 ? "Above Minimum Wage" : (d === 2 ? "Minimum Wage" : ""));
        });
});