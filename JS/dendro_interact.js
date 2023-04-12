// set the dimensions and margins of the diagram
const tree_margin = {
    top: 20,
    right: 150,
    bottom: 20,
    left: 170
  },
  tree_width = window.innerWidth * 0.9 - tree_margin.left - tree_margin.right,
  tree_height = window.innerHeight - tree_margin.top - tree_margin.bottom;

// declares a tree layout and assigns the size
const treemap = d3.tree().size([tree_height, tree_width]);


d3.json('https://raw.githubusercontent.com/Jaga-droid/Covid_Data_StoryBoard/main/Resources/DataSet/treedata.json').then(function (treeData) {

      // Set the x and y scales for the chart

      //  assigns the data to a hierarchy using parent-child relationships
      let nodes = d3.hierarchy(treeData, d => d.children);

      // maps the node data to the tree layout
      nodes = treemap(nodes);

      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      const tree_svg = d3.select("#treeid").append("svg")
        .attr("width", tree_width + tree_margin.left + tree_margin.right)
        .attr("height", tree_height + tree_margin.top + tree_margin.bottom),
        g = tree_svg.append("g")
        .attr("transform",
          "translate(" + tree_margin.left + "," + tree_margin.top + ")");

      // adds the links between the nodes
      const link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", d => d.data.level)
        .attr("d", d => {
          return "M" + d.y + "," + d.x +
            "C" + (d.y + d.parent.y) / 2 + "," + d.x +
            " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
            " " + d.parent.y + "," + d.parent.x;
        });

      // adds each node as a group
      const node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

      // adds the circle to the node
      node.append("circle")
        .attr("r", d => d.data.value)
        .style("stroke", d => d.data.type)
        .style("fill", d => d.data.level);

      // adds the text to the node
      node.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
        .attr("y", d => d.children && d.depth !== 0 ? -(d.data.value + 5) : d)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name + "  (" + d.data.date + ")");

      // adds the click functionality to the nodes
      node.on("click", function (d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
       
        update(d);
      });

      const diagonal = d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x);
      function update(source) {
        // assigns the size of the tree again
        tree_height = window.innerHeight - tree_margin.top - tree_margin.bottom;
      
        // updates the x and y scales for the chart
        treemap.size([tree_height, tree_width]);
      
        // updates the location of each node
        tree = treemap(root);
      
        // transitions the nodes and links
        const nodeUpdate = node.transition()
          .duration(750)
          .attr("transform", d => "translate(" + d.y + "," + d.x + ")");
      
        nodeUpdate.select("circle")
          .attr("r", d => d.data.value)
          .style("stroke", d => d.data.type)
          .style("fill", d => d.data.level);
      
        nodeUpdate.select("text")
            .style("fill-opacity", 1);
      
        const linkUpdate = link.transition()
            .duration(750)
            .attr("d", diagonal);
      
        linkUpdate.style("stroke", d => d.data.level);
      
        // sets the opacity of any nodes that have been collapsed
        nodeUpdate.select("text")
          .style("fill-opacity", d => d._children ? 0.5 : 1);
        
        // exits any nodes that are no longer needed
        const nodeExit = node.exit().transition()
            .duration(750)
            .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
            .remove();
      
        nodeExit.select("circle")
          .attr("r", 0);
      
        nodeExit.select("text")
            .style("fill-opacity", 0);
      
        // exits any links that are no longer needed
        const linkExit = link.exit().transition()
            .duration(750)
            .attr("d", d => {
              const o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();
      
        // stores the old positions for transition
        tree.each(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }
});
