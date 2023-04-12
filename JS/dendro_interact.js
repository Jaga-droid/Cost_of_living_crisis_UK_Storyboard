// Set up the tree layout
const width = window.innerWidth;
const height = window.innerHeight;
const margin = {top: 20, right: 50, bottom: 20, left: 70};
const treeLayout = d3.tree().size([height, width]);

// Select the SVG element and set its dimensions
const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.json("data.json").then(data => {

  // Assign the data to the root node and collapse it initially
  const root = d3.hierarchy(data);
  root.descendants().forEach(d => {
    d.id = d.data.name; // Assign an ID to each node
    d._children = d.children;
    d.children = null;
  });

  // Call updateNodes to draw the nodes and links
  updateNodes(root);
});

function updateNodes(source) {

  // Update the tree layout with the new data
  treeLayout(root);

  // Calculate the links between the nodes
  const links = root.links();

  // Draw the links
  const link = svg.selectAll(".link")
    .data(links, d => d.target.id);

  link.enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 2)
    .attr("d", d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y));

  link.transition()
    .duration(500)
    .attr("d", d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y));

  link.exit()
    .transition()
    .duration(500)
    .attr("d", d3.linkVertical()
      .x(d => source.x)
      .y(d => source.y))
    .remove();

  // Draw the nodes
  const node = svg.selectAll(".node")
    .data(root.descendants(), d => d.id);

  const newNode = node.enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", `translate(${source.x},${source.y})`)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0);

  newNode.append("circle")
    .attr("r", 4)
    .attr("fill", d => d._children ? "#555" : "#999")
    .attr("stroke-width", 2)
    .attr("stroke", "#fff")
    .on("click", (event, d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      updateNodes(d);
    })
    .on("mouseover", (event, d) => {
      // Highlight the node on mouseover
      d3.select(event.currentTarget).attr("fill", "red");
    })
    .on("mouseout", (event, d) => {
      // Unhighlight the node on mouseout
      d3.select(event.currentTarget).attr("fill", d => d._children ? "#555" : "#999");
    });

  newNode.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d._children ? -6 : 6)
    .attr("text-anchor", d => d._children ? "end" : "start")
    .attr("font-size", "10px")
    .text(d => d.data.name);

  newNode.transition()
    .duration(500)
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);

  node.transition()
    .duration(500)
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("fill-opacity", 1)
    .attr("stroke-opacity", 1);

  node.exit()
    .transition()
    .duration(500)
    .attr("transform", `translate(${source.x},${source.y})`)
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .remove();
}
