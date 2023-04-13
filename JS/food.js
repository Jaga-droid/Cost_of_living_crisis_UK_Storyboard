// set the dimensions and bar_margins of the graph
const w = 500;
const h = 300;
const bar_margin = { top: 20, right: 30, bottom: 40, left: 50 };

// select the SVG element created in your HTML file
const bar_svg = d3.select('#barid')
    .attr('width', w + bar_margin.left + bar_margin.right)
    .attr('height', h + bar_margin.top + bar_margin.bottom);

// create a group element to hold the chart elements
const g = bar_svg.append('g')
    .attr('transform', `translate(${bar_margin.left}, ${bar_margin.top})`);

// load the data from your dataset
d3.csv('your_dataset_file.csv', d => ({
    date: d.date,
    value: +d.value
})).then(data => {
    // create a scale for the x-axis categories
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, w])
        .paddingInner(0.2);

    // create a scale for the y-axis values
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.value))
        .range([h, 0]);

    // create and position the x-axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
        .attr('transform', `translate(0, ${h})`)
        .call(xAxis);

    // create and position the y-axis
    const yAxis = d3.axisLeft(yScale);
    g.append('g')
        .call(yAxis);

    // create the bars using the data
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(Math.max(0, d.value)))
        .attr('width', xScale.bandwidth())
        .attr('height', d => Math.abs(yScale(d.value) - yScale(0)));
});
