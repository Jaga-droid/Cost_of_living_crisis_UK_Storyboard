const treeData = [
  {
    name: 'Top Level',
    parent: 'null',
    children: [
      {
        name: 'Level 2: A',
        parent: 'Top Level',
        children: [
          { name: 'Son of A', parent: 'Level 2: A' },
          { name: 'Daughter of A', parent: 'Level 2: A' },
        ],
      },
      {
        name: 'Level 2: B',
        parent: 'Top Level',
        children: [
          { name: 'Son of B', parent: 'Level 2: B' },
          { name: 'Daughter of B', parent: 'Level 2: B' },
          { name: 'Daughter of B', parent: 'Level 2: B' },
        ],
      },
    ],
  },
];

const margin = { top: 20, right: 120, bottom: 20, left: 120 };
const width = 960 - margin.right - margin.left;
const height = 500 - margin.top - margin.bottom;
let i = 0;
const duration = 750;
let root;

const tree = d3.tree().size([height, width]);

const diagonal = d3
  .linkVertical()
  .x(d => d.y)
  .y(d => d.x);


const svg = d3
  .select('svg#tree')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

root = d3.hierarchy(treeData[0]);
root.x0 = height / 2;
root.y0 = 0;

update(root);

function update(source) {
  const nodes = tree(root).descendants();
  const links = tree(root).links();

  nodes.forEach(d => (d.y = d.depth * 180));

  const node = svg.selectAll('g.node').data(nodes, d => d.id || (d.id = ++i));

  const nodeEnter = node
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${source.y0},${source.x0})`)
    .on('click', click);

  nodeEnter.append('circle')
    .attr('r', 1e-6)
    .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'));

  nodeEnter.append('text')
    .attr('x', d => (d.children || d._children ? -13 : 13))
    .attr('dy', '.35em')
    .attr('text-anchor', d => (d.children || d._children ? 'end' : 'start'))
    .text(d => d.data.name)
    .style('fill-opacity', 1e-6);

  const nodeUpdate = node
    .merge(nodeEnter)
    .transition()
    .duration(duration)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  nodeUpdate.select('circle')
    .attr('r', 10)
    .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'));

  nodeUpdate.select('text').style('fill-opacity', 1);

  const nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr('transform', d => `translate(${source.y},${source.x})`)
    .remove();

  nodeExit.select('circle').attr('r', 1e-6);

  nodeExit.select('text').style('fill-opacity', 1e-6);

  const link = svg.selectAll('path.link').data(links, d => d.target.id);

  link.enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d => {
      const o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    });

  link.transition().duration(duration).attr('d', diagonal);

  link.exit()
    .transition()
    .duration(duration)
    .attr('d', d => {
      const o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  nodes.forEach(d => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
