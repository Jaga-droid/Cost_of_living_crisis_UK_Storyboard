    // The svg
    const winwidth = window.innerWidth;
    const winheight = window.innerHeight;
    const map_svg = d3.select("#Mapid").append('svg');
    map_svg.attr("width", winwidth - 100);
    map_svg.attr("height", winheight - 100);
    const width = +map_svg.attr("width")
    const height = +map_svg.attr("height");

    // Map and projection
    const path = d3.geoPath();
    const projection = d3.geoMercator()
      .scale(170)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    // Data and color scale
    const data = new Map();
    const colorScale = d3.scaleThreshold()
      .domain([1000, 10000, 30000, 100000, 1000000])

      .range(d3.schemeBlues[9]);
    // .range(d3.schemeSpectral[8]);

    // Load external data and boot
    Promise.all([
      d3.json("https://raw.githubusercontent.com/Jaga-droid/Cost_of_living_crisis_UK_Storyboard/main/Resources/DataSet/uk_regions.geojson"),
      d3.csv("https://raw.githubusercontent.com/Jaga-droid/Covid_Data_StoryBoard/main/Resources/DataSet/total.csv", function (d) {
        data.set(d.RegionName, +d.MedianPrice)
        
      })
    ]).then(function (loadData) {
      let topo = loadData[0]

   

      let mouseOver = function (d) {
        d3.selectAll(".Region")
          .transition()
          .duration(200)
          .style("opacity", .3)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
        
        

      }

      let mouseLeave = function (d) {
        d3.selectAll(".Region")
          .transition()
          .duration(200)
          .style("opacity", 1)
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "")
      
      }

    

      // Draw the map
      map_svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )

        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.properties.rgn19nm) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function (d) {
          return "Country"
        })
        .style("opacity", 1)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .append('title').text(d => d.properties.rgn19nm)


     






    })