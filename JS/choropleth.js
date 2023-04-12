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
      d3.json("https://raw.githubusercontent.com/Jaga-droid/Covid_Data_StoryBoard/main/Resources/DataSet/uk_regions.geojson"),
      d3.csv("https://raw.githubusercontent.com/Jaga-droid/Covid_Data_StoryBoard/main/Resources/DataSet/total.csv", function (d) {
        data.set(d.location, +d.total_cases)
      })
    ]).then(function (loadData) {
      let topo = loadData[0]

      // map_svg.append("rect")
      // .attr("id","mytooltip")
      // .attr("x",width-(width-100))
      // .attr("y",width/3)
      // .attr('width',width/10)
      // .attr('height',height/2)
      // .style('fill','white')
      // .style('top',0)
      // .transition()
      // .duration(100)
      // .style('opacity',0)

      let mouseOver = function (d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .3)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
        // d3.select("#mytooltip").transition()
        // .duration(200)
        // .style("opacity",1).style("stroke","black")
        

        // d3.select("#mytooltip")
        // .text("Hello, world!")
        // .style("text-align", "center")
        // .style("line-height", "320px")
        // .style("font-size", "100px")
        // .style("color",'red')
        

      }

      let mouseLeave = function (d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 1)
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "")
          d3.select("#mytooltip").transition()
          .duration(200)
          .style("opacity",0).style("stroke","black")
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
          d.total = data.get(d.properties.name) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function (d) {
          return "Country"
        })
        .style("opacity", 1)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .append('title').text(d => d.properties.name)


      const markers = [{
          long: 100.6197,
          lat: 34.0479,
          group: "Asia",
          size: 60
        }, // Asia
        {
          long: -105.2551,
          lat: 54.5260,
          group: "North America",
          size: 90
        }, // north america
        {
          long: -55.4915,
          lat: -8.7832,
          group: "South America",
          size: 70
        }, // south america
        {
          long: 34.5085,
          lat: -8.7832,
          group: "Africa",
          size: 20
        }, // africa
        {
          long: 15.2551,
          lat: 54.5260,
          group: "Europe",
          size: 60
        }, // europe
        {
          long: 140.0188,
          lat: -22.7359,
          group: "Oceania",
          size: 20
        } // Oceania

      ];


      const color = d3.scaleOrdinal()
        .domain(["Asia", "North America", "South America", "Africa", "Europe", "Oceania"])
        .range(["#402D54", "#D18975", "#8FD175", "#3d10d3", "#7B68EE", "#D8BFD8"])

      // Add a scale for bubble size
      const size = d3.scaleLinear()
        .domain([1, 100]) // What's in the data
        .range([4, 50]) // Size in pixel




      let clickContinent = function (d) {
        var mylocation = d.srcElement.__data__.group;
        console.log(mylocation);
        if(mylocation=='North America'){drawpops('northamerica');}
        if(mylocation=='South America'){drawpops('southamerica');}
        if(mylocation=='Africa'){drawpops('africa');}
        if(mylocation=='Asia'){drawpops('asia');}
        if(mylocation=='Oceania'){drawpops('oceania');}
        if(mylocation=='Europe'){drawpops('europe');}

      }


   

      // Add circles:
      map_svg
        .selectAll("myCircles")
        .data(markers)
        .join("circle")
        .attr("class", d => d.group)
        .attr("cx", d => projection([d.long, d.lat])[0])
        .attr("cy", d => projection([d.long, d.lat])[1])
        .attr("r", d => size(d.size))
        .style("fill", d => color(d.group))
        .attr("stroke", d => color(d.group))
        .attr("stroke-width", 3)
        .attr("fill-opacity", 0.5)
        .on("click", clickContinent)
        .append('title').text(d => d.group)








    })