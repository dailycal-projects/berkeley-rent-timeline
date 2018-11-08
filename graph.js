var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var margin = {top: 20, right: 20, bottom: 25, left: 40};

var body = d3.select('body').node()
var container = d3.select('#container')
var content = d3.select('#content')
    
var SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;

svg = d3.select("#sticky").append("svg")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand().rangeRound([0, WIDTH - margin.right]).paddingInner(0.1);
var yScale = d3.scaleLinear().rangeRound([HEIGHT - margin.bottom, -margin.bottom]);

d3.csv("data.csv", function(d) {
  return d;
}, function(error, data) {
  if (error) throw error;

  var line = d3.line()
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.rent2); })

  // var line2 = d3.line()
  //   .x(function(d) { return x(d.year); })
  //   .y(function(d) { return y(d.rent); })

  xScale.domain(data.map(function(d) { return d.year; })).range([0, WIDTH - 2 * margin.right]);
  yScale.domain([0, 1800]).range([HEIGHT - 2 * margin.bottom, 0]);

  // x axis is 2 * margin.bottom above the bottom of window
  var xAxis = g.append("g")
    .attr("transform", "translate(" + (0) + "," + (HEIGHT - 2 * margin.bottom) + ")")
    .attr("class", "axis")
    .call(d3.axisBottom(xScale).tickValues([1978, 1980, 1981, 1982, 1991, 1994, 1995, 2008, 2009, 2010, 2017]))
    .call(g => g.select(".domain").remove());

  var yAxis = g.append("g")
    .attr("transform", "translate(" + (0) + "," + (1.5 * margin.bottom) + ")")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale))
    .call(g => g.select(".domain").remove());

  var path = g.append("path")
    .attr("d",line(data))
    .attr("class","line")
    .style("fill", "none")
    .style("stroke-opacity", .8)
    .style("stroke", "#e2aa61")
    .style("stroke-width", 4)
    .style("stroke-dasharray", function(d) {
      var l = d3.select(this).node().getTotalLength();
      return l + "px, " + l + "px";
      })
    .style("stroke-dashoffset", function(d) {
      return d3.select(this).node().getTotalLength() + "px";
      });

  // var path2 = g.append("path")
  //   .attr("d",line2(data))
  //   .attr("class","line")
  //   .style("fill", "none")
  //   .style("stroke-opacity", .8)
  //   .style("stroke", "#6199e2")
  //   .style("stroke-width", 4)
  //   .style("stroke-dasharray", function(d) {
  //     var l = d3.select(this).node().getTotalLength();
  //     return l + "px, " + l + "px";
  //     })
  //   .style("stroke-dashoffset", function(d) {
  //     return d3.select(this).node().getTotalLength() + "px";
  //     });

  var pathScale = d3.scaleLinear()
    .domain([6 * HEIGHT, SCROLL_LENGTH])
    .range([0, path.node().getTotalLength()])
    .clamp(true);

  // var pathScale2 = d3.scaleLinear()
  //   .domain([6 * HEIGHT, SCROLL_LENGTH])
  //   .range([0, path2.node().getTotalLength()])
  //   .clamp(true);    

  var scrollTop = 0
  var newScrollTop = 0

  container
    .on("scroll.scroller", function() {
      newScrollTop = container.node().scrollTop
    });

  var setDimensions = function() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;

    svg
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
    
    xScale.range([0, WIDTH - 2 * margin.right]);
    yScale.range([HEIGHT - 2 * margin.bottom, 0]);

    xAxis
      .attr("transform", "translate(" + (0) + "," + (HEIGHT - 2 * margin.bottom) + ")")
      .attr("class", "axis")
      // .call(d3.axisBottom(x).tickValues([1971, 1972, 1973, 1976, 1978, 1980, 1981, 1982, 1991, 1994, 1995, 2017]))
      .call(d3.axisBottom(xScale).tickValues([1978, 1980, 1981, 1982, 1991, 1994, 1995, 2008, 2009, 2010, 2017]))
      .call(g => g.select(".domain").remove());

    yAxis
      .attr("transform", "translate(" + (0) + "," + (1.5 * margin.bottom) + ")")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .call(g => g.select(".domain").remove());

    path
      .attr("d", line(data));

    // path2
    //   .attr("d", line2(data));

    pathScale
      .domain([6 * HEIGHT, SCROLL_LENGTH])
      .range([0, path.node().getTotalLength()]);

    // pathScale2
    //   .domain([0, SCROLL_LENGTH])
    //   .range([0, path2.node().getTotalLength()]);

    path
      .attr("d", line(data))
      .style("stroke-dasharray", function(d) {
        var l = d3.select(this).node().getTotalLength();
        return l + "px, " + l + "px";
      })
      .style("stroke-dashoffset", function(d) {
        return d3.select(this).node().getTotalLength() - pathScale(scrollTop) + "px";
      });

    // path2
    //   .attr("d", line2(data))
    //   .style("stroke-dasharray", function(d) {
    //     var l = d3.select(this).node().getTotalLength();
    //     return l + "px, " + l + "px";
    //   })
    //   .style("stroke-dashoffset", function(d) {
    //     return d3.select(this).node().getTotalLength() - pathScale2(scrollTop) + "px";
    //   });
}

var render = function() {
  if (scrollTop !== newScrollTop) {
    scrollTop = newScrollTop
    
    path
      .style("stroke-dashoffset", function(d) {
        return (path.node().getTotalLength() - pathScale(scrollTop) + "px");
      });

    // path2
    //   .style("stroke-dashoffset", function(d) {
    //     return path2.node().getTotalLength() - pathScale2(scrollTop) + "px";
    //   });
  }

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)

window.onresize = setDimensions
});