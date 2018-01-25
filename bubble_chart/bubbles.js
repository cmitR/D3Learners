
function add_bubbles() {
	var error = arguments[0],
		data = arguments[1],
		node_data = data.children;
	
	var scaleFont = d3.scaleLinear()
			.domain([3, 30])
			.range([15, 80]);

	var strength = 10;
	var strengthForce = d3.forceManyBody().strength(strength);
	var simulation = d3.forceSimulation()
		.force("center", d3.forceCenter(plotwidth / 2, plotheight / 2))
		.force("charge", strengthForce)
		.force('collision', d3.forceCollide().radius(function(d) {
			return d.freq * 10;
		}))
		.alpha(3)
		.on("tick", ticked);
	
	var bubbles = plotarea
			.selectAll('.bubble')
			.data(node_data)
			.enter()
			.append("g")
			.attr("class", "bubble");
	
	var counter = 0,
		data_name = "prob_" + views[counter],
		header_name = view_names[counter],
		prev_button = d3.select("#prev_button button"),
		adv_button = d3.select("#adv_button button");
	
	setup_bubbles(node_data, data_name);

	// Use buttons
	d3.selectAll('#adv_button').on('click', function() {
		counter = counter + 1;
		data_name = "prob_" + views[counter];
		header_name = view_names[counter];
		
		update_bubbles(node_data, data_name, header_name);
		buttonLogic(counter, prev_button, adv_button);	

	});

	d3.selectAll('#prev_button').on('click', function() {
		counter = counter - 1;
		data_name = "prob_" + views[counter];
		header_name = view_names[counter];
		
		update_bubbles(node_data, data_name, header_name);
		buttonLogic(counter, prev_button, adv_button);

	});

	// functions:

	function setup_bubbles(data, data_name) {
		simulation.nodes(data);
		bubbles.append("circle")
			.attr('r', function(d) { return d.freq*10; })
			.merge(bubbles)
			.style("fill", function(d) {
				return switchColor(d[data_name]);
			});
			// .call(d3.drag()
			// 		.on("start", dragstarted)
			// 		.on("drag", dragged)
			// 		.on("end", dragended));

		bubbles.append("text")
			.text(function(d) { return d.word; })
			.attr("font-size", function(d) { return scaleFont(d.freq)+"px"; })
			.attr("text-anchor", "middle")
			.attr("fill", "#fff");
			// .call(d3.drag()
			// 		.on("start", dragstarted)
			// 		.on("drag", dragged)
			// 		.on("end", dragended));
		
		bubbles.exit().remove();
	}

	function update_bubbles(data, data_name, header_name) {
		
		simulation.alpha(3).restart();

		d3.selectAll(".bubble circle")
			.transition().duration(1000)
			.style("fill", function(d) {
				return switchColor(d[data_name]);
			});
		
		d3.select("#chart_heading")
			.text(header_name);

	}

	var count = 0;
	function ticked() {
		count++;

		// switch strength between +/- for bounce effect
		if(count%50 == 0) { strength = strength * -1; }
		strengthForce.strength(strength);

		bubbles.selectAll("circle")
			.attr('cx', function(d) { return d.x })
			.attr('cy', function(d) { return d.y });
		bubbles.selectAll("text")
			.attr('x', function(d) { return d.x })
			.attr('y', function(d) { return d.y });
		bubbles.exit().remove();
	}

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart()
		d.fx = d.x;
		d.fy = d.y;
	  }
	  
	  function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	  }
	  
	  function dragended(d) {
		  if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	  }
}

function switchColor(p) {
	if (p < 0) { 
		// unlikely
		return "#c99553";
	} else if (p > 1) { 
		// likely
		return "#68a0b0";
	} else {
		// equal
		return "#bfbfbf";
	}
}

function buttonLogic(counter, prev_button, adv_button) {
	
	// previous button
	if (counter <= 0) {
		// off
		prev_button
			.attr("disabled", true)
			.classed("on", false)
			.classed("off", true);
	} else {
		// on
		prev_button
			.attr("disabled", null)
			.classed("on", true)
			.classed("off", false);
	}

	// advance button
	if (counter < (views.length-1)) {
		// on
		adv_button
			.attr("disabled", null)
			.classed("on", true)
			.classed("off", false);
	} else {
		// off
		adv_button
			.attr("disabled", true)
			.classed("on", false)
			.classed("off", true);
	}

}
