// Code goes here



//getWidth();
var width = 1500, 
    height = 800,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 8, // separation between different-color nodes
    maxRadius = 18;

var n = 100, // total number of nodes
    m = 20; // number of distinct clusters

var color = d3.scale.category10()
    .domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);
var nodes = [];

// get the json data from the file
d3.json("r.json", function(error, data) {

	for (var i = 0; i < data.length; i++) {
		var obj = data[i];
		for (var key in obj){
			var rating = obj['rating'];	// rating
			var r = rating * 100;		// radius
			var n = obj['name'];
            var e = obj['namelink'];		// namelink
			var div = obj['division'];	// division
			d = {cluster: div, radius: r, name: n, namelink: e, division: div, rating: rating};
			// d = {cluster: div, radius: r};
			// console.log(key+"="+obj[key]);
		} 
		if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
		nodes.push(d);
		
		// console.log(d);
	}


    
    
// Use the pack layout to initialize node positions.
d3.layout.pack()
    .sort(null)
    .size([width, height])
    .children(function(d) { return d.values; })
    .value(function(d) { return d.radius * d.radius; })
    .nodes({values: d3.nest()
    .key(function(d) { return d.cluster; })
    .entries(nodes)});

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(.03)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select(".layoutContainer").append("svg")
    .attr("width", width)
    .attr("height", height);
    
var theWidth = parseInt(d3.select('.layoutContainer').style('width'), 10);
console.log(theWidth);
    

var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .style("fill", function(d) { return color(d.cluster); })
.attr("r", function(d){return 24})
    .call(force.drag);
    
var nodeText = svg.selectAll(".nodeText")
    .data(nodes)
    .enter() 
.append("a")
 .attr("xlink:href", function (d) {return d.namelink;})
.append("text")
.attr("y", 0)
	.attr("dy", 0)
    .attr("transform", "translate(0,0)")
.text(function (d) {return d.name;})
.call(wrap, 80)
.attr("text-anchor", "middle")

    function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = -1,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
    

node.transition()
    .duration(750)
    .delay(function(d, i) { return i * 5; })
    .attrTween("r", function(d) {
     var i = d3.interpolate(0, d.radius);
         return function(t) { return d.radius = i(t); };
     });


function tick(e) {
    node.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("transform", function (d) {
            var k = "translate(" + d.x + "," + d.y + ")";
        return k;
    });
    
    nodeText.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("transform", function (d) {
            var k = "translate(" + d.x + "," + d.y + ")";
        return k;
    });
}


// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
   
    var cluster = clusters[d.index];
   
    if (cluster === d) return;
    var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
    if (l != r) {
      l = (l - r) / l * alpha;
      d.x -= x *= l;
      d.y -= y *= l;
      cluster.x += x;
      cluster.y += y;
    }
  };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}
    
window.addEventListener('resize', resize); 

function resize() {
    var width = window.innerWidth, height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
}
    

});