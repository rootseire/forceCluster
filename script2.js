// Code goes here



//getWidth();
var width = 1500, 
    height = 800,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 50, // separation between different-color nodes
    maxRadius = 18;



    
        



// get the json data from the file
d3.json("r.json", function(error, data) {
var cs = [];
var color = d3.scale.ordinal()
     //.domain([data])
     .range(["#96afc8", "#edebeb", "#DDC9DE"]);
    
    
    
    
    var n = data.length, // total number of nodes
    m = cs.length; // number of distinct clusters

//create clusters and nodes
var clusters = new Array(m);
var nodes = [];
	for (var i = 0; i < data.length; i++) {
		var obj = data[i];
        data.size = +data.size;
		for (var key in obj){
			var rating = obj['rating'];	// rating
			var r = rating * 100;		// radius
			var n = obj['name'];
            var e = obj['namelink'];		// namelink
            var g = obj['group'];
			var div = obj['division'];
            cs.push(obj['group']);// division
			d = {cluster: div, radius: r, name: n, namelink: e, division: div, rating: rating, group: g};
			// d = {cluster: div, radius: r};
			// console.log(key+"="+obj[key]);
		} 
		//if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
		//nodes.push(data, i);
		
		// console.log(d);
	}



//unique cluster/group id's


var n = data.length, // total number of nodes
    m = cs.length; // number of distinct clusters

//create clusters and nodes
var clusters = new Array(m);
//var nodes = [];
for (var i = 0; i<n; i++){
   nodes.push(create_nodes(data,i));
}    

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();

    
var svg = d3.select(".layoutContainer").append("svg")
    //.attr("width", width)
    //.attr("height", height)
.attr("viewBox", '0 0 1500 800');
    
var theWidth = parseInt(d3.select('.layoutContainer').style('width'), 10);

    

var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("g")
    .style("fill", function(d) { return color(d.cluster); })
.attr("r", function(d){return d.radius})
    .call(force.drag);
 


node.append("circle")
    .style("fill", function (d) {
    return color(d.cluster);
    })
    .attr("r", function(d){return d.radius})
    

    
    
var nodeText = svg.selectAll(".nodeText")
    .data(nodes)
    .enter() 
.append("a")
//.attr("style","mystyleOrig")
.style("fill", "black")
 .attr("xlink:href", function (d) {return d.links;})

 .on("click", function (d) {
     var linkText = d.links;
     //console.log(linkText);
     check_visited_links(linkText);
     
 })
 
     
     
.append("text")
.attr("y", 0)
.attr("dy", 0)
.attr("transform", "translate(0,0)")

.text(function (d) {return d.texts;})
 .style("font-size", function(d) {
            if ((d.texts == "Students and Supervisors") || (d.texts == "PhD Students") || (d.texts == "Institutions")) {return "20"}
            else 	{ return "12" }
        ;})


//.text(function(d) { return d.name.substring(0, d.rating / 3); })
.call(wrap, 80)
.attr("text-anchor", "middle")
.attr("opacity", "0")

    function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
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

    nodeText.transition()
    .delay(function(d,i) { return i * 10; })
    .duration(4700)
    .attr('opacity', 1);
    
    
    checkStorage();
function checkStorage(){
          
     var visited_links = JSON.parse(localStorage.getItem('visited_links')) || [];
//var links = document.getElementsByTagName('a');
    
var links = document.querySelectorAll('a');
for (var i = 0; i < links.length; i++) {
    var that = links[i];
   //console.log(visited_links);
    //console.log("ya");
    var hrefs = that.href.baseVal;
    var theElement = that;
    //console.log(hrefs);
   // console.log(theElement);
     
    
    if (visited_links.indexOf(hrefs)!== -1) { 
      // console.log("yes");
        
      
      theElement.classList.add("mystyle");
        d3.selectAll('circle').on('click', datum => {
  console.log(datum.links); // the datum for the clicked circle
});
        d3.selectAll('circle').on("mouseover", function(d) {
  //d3.select(this).attr("r", 10).style("fill", "red");
})                  
d3.selectAll('circle').on("mouseout", function(d) {
 // d3.select(this).attr("r", 5.5).style("fill", "red");
});
        
      //theElement.parentNode.classList.add("mystyle");
      //d3.selectAll(theElement).style("text-decoration", "underline");
        d3.selectAll(theElement).style("fill", "pink");
        //d3.selectAll(theElement).parentNode.style("fill", "pink");
          
        
       
    }
     
    }  
}
    
function create_nodes(data,node_counter) {
  var i = cs.indexOf(data[node_counter].group),
      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
      d = {
        cluster: i,
        radius: data[node_counter].size*1.5,
        //text: data[node_counter].text,
        texts: data[node_counter].name,
        links: data[node_counter].namelink,  
        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
      };
  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  return d;
};
    
    
node.transition()
    .duration(3200)
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



// Move nodes toward cluster focus.
function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}
    
    
    
// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
   
    var cluster = clusters[d.cluster];
   
    //if (cluster === d) return;
      
      
    // For cluster nodes, apply custom gravity.
    if (cluster === d) {
      cluster = {x: width / 2, y: height / 2, radius: -d.radius};
      k = .1 * Math.sqrt(d.radius);
    }
      
      
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
// d3.selectAll("text").attr("opacity", "1").duration(3300);
function resize() {}



});