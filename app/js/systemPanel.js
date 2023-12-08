const systemPanel = new function() {
	this.update = function() {
		// Update dependent controls: Path to chain/home

		const exits = chain.data.exits;
	
		// var html = [
		// 	renderRoute((exits || []).map(function(x) { return x  - 30000000; }), true, 'chain', 'To Target'), 
		// 	renderRoute(guidance_profiles.blueLootSystems, false, 'blue-loot', 'Blue loot buyer')
		// ].filter(function(x) { return x; });
		const route = renderRoute((exits || []).map(function(x) { return x  - 30000000; }), true, 'chain', 'To Target')
		const loot = renderRoute(guidance_profiles.blueLootSystems, false, 'blue-loot', 'Blue loot buyer')
		$("#infoExtra").empty();
		$("#infoExtra").append(renderJourneyPlanner());
		$("#infoExtra").append(route);
		$("#infoExtra").append(loot);
		//$("#infoExtra").html(html);
		Tooltips.attach($("#infoExtra [data-tooltip]"));
	};

	function renderJourneyPlanner()
	{
		var systemName = tripwire.systems[viewingSystemID].name;
		return $("<div/>")
			.append("Journey Planner: ")
			.append(a("?journey&from="+systemName, "From", true))
			.append(" - ")
			.append(a("?journey&to="+systemName, "To", true))
			.append(renderRouteIcon());	
	}
	
	function renderRoute(targets, addPathHome, cssClass, categoryText) {
		const path = targets ? guidance.findShortestPath(tripwire.map.shortest, viewingSystemID - 30000000, targets) : null;
		if(path) {
			const inChain = path.length <= 1;
			const exitSystem = path[path.length - 1] + 30000000;
			const prefixText = inChain ? '' : (path.length - 1) + 'j from ' ;
			const pathHomeText = addPathHome ? chain.data.systemsInChainMap[exitSystem].pathHome.slice()
				.map(buildPath) : [{link: ".?system="+tripwire.systems[exitSystem].name, text: tripwire.systems[exitSystem].name}];
			
			var div = $("<div/>").addClass(cssClass)
				.append(categoryText)
				.append(": ")
				.append(prefixText)

			renderPath(pathHomeText).forEach(function(p){
				$(div).append(p);
			})
			if(addPathHome){
				$(div).append(renderCopyIcon(pathHomeText));
			}

			return div;
		} else { 
			var chainSystem = chain.data.systemsInChainMap[viewingSystemID];
			if(!chainSystem || !addPathHome) return null;

			const pathHomeText = addPathHome ? chain.data.systemsInChainMap[viewingSystemID].pathHome.slice()
				.map(buildPath) : [];
			
			var div = $("<div/>").addClass(cssClass)
				.append(categoryText)
				.append(": ");
				// .append(prefixText)
				renderPath(pathHomeText).forEach(function(p){
					$(div).append(p);
				});
			$(div).append(renderCopyIcon(pathHomeText));
			return div;
		 }	
	}

	function renderPath(pathList)
	{
		var path = [];
		pathList.forEach(function(p, i) {
			path.push(a(p.link, p.text));
			if(i < pathList.length-1){
				path.push($("<span/>").text(" > "))
			}
		})
		return path;
	}
	

	function buildPath(n){

		var tagName = n.name;
		if(tagName == null) tagName = n.signatureID
		if(tagName == null) tagName = "???";
		if(tagName == n.signatureID) tagName = tagName.toUpperCase().substring(0,3);
		
		return {
			link: ".?system="+tripwire.systems[n.systemID].name,
			text: tagName
		};
	}

	function a(link, text, newWindow = false)
	{
		var a = $("<a/>").attr('href', link).text(text);
		if(newWindow == true){
			$(a).attr('target', '_blank');
		}
		return a;
	}

	function renderCopyIcon(pathHome)
	{
		const toCopy = pathHome.map(function(n) { 
			return n.text;
		}).join(" > ");
		const paths = [
			"M220.741,46.137h-30.188v-5.785c0-7.444-6.056-13.5-13.5-13.5h-1.667 C172.294,11.554,158.748,0,142.552,0c-16.196,0-29.743,11.554-32.835,26.852h-1.669c-7.444,0-13.5,6.056-13.5,13.5v5.785H64.36 c-12.407,0-22.5,10.094-22.5,22.5v193.965c0,12.406,10.093,22.5,22.5,22.5h156.381c12.406,0,22.5-10.094,22.5-22.5V68.637 C243.241,56.23,233.148,46.137,220.741,46.137z M109.548,41.852h66.006v24.571h-66.006V41.852z M142.552,15 c7.856,0,14.566,4.931,17.245,11.852h-34.489C127.986,19.931,134.696,15,142.552,15z M228.241,262.602c0,4.136-3.364,7.5-7.5,7.5 H64.36c-4.136,0-7.5-3.364-7.5-7.5V68.637c0-4.136,3.364-7.5,7.5-7.5h30.188v6.786c0,7.444,6.056,13.5,13.5,13.5h69.006 c7.444,0,13.5-6.056,13.5-13.5v-6.786h30.188c4.136,0,7.5,3.364,7.5,7.5V262.602z",
			"M193.212,107.931H91.89c-4.142,0-7.5,3.357-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h101.322 c4.143,0,7.5-3.358,7.5-7.5C200.712,111.288,197.355,107.931,193.212,107.931z",
			"M193.212,145.26H91.89c-4.142,0-7.5,3.357-7.5,7.5c0,4.143,3.358,7.5,7.5,7.5h101.322 c4.143,0,7.5-3.357,7.5-7.5C200.712,148.617,197.355,145.26,193.212,145.26z",
			"M193.212,182.591H91.89c-4.142,0-7.5,3.357-7.5,7.5c0,4.143,3.358,7.5,7.5,7.5h101.322 c4.143,0,7.5-3.357,7.5-7.5C200.712,185.948,197.355,182.591,193.212,182.591z",
			"M193.212,231.263h-31.28c-4.143,0-7.5,3.357-7.5,7.5c0,4.143,3.357,7.5,7.5,7.5h31.28 c4.143,0,7.5-3.357,7.5-7.5C200.712,234.62,197.355,231.263,193.212,231.263z"
		];
		const ns = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(ns, "svg");
		const g = document.createElementNS(ns, "g");
		$(g).append(
			paths.map(function(p) {
				const path = document.createElementNS(ns, "path")
				$(path).attr("d", p).css("fill", "#efefef")
				return path;
			})
		)
		$(svg)
			.attr("viewBox", "0 0 285.102 285.102")
			.attr("version", "1.1")
			.css("height", "10px")
			.css("width", "10px")
			.css("display", "inline-block")
			.css("cursor", "copy")
			.css("margin", "0 5px 0 5px")
			.append(g).click(function(){
				navigator.clipboard.writeText("Chain: " + toCopy);
			});
		
	
		return $(svg);
	}

	function renderRouteIcon()
	{
		const paths = [
			"M416 320h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96s96-107 96-160-43-96-96-96-96 43-96 96c0 25.5 22.2 63.4 45.3 96H320c-52.9 0-96 43.1-96 96s43.1 96 96 96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32H185.5c-16 24.8-33.8 47.7-47.3 64H416c52.9 0 96-43.1 96-96s-43.1-96-96-96zm0-256c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM96 256c-53 0-96 43-96 96s96 160 96 160 96-107 96-160-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z",			
		]
		const ns = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(ns, "svg");
		const g = document.createElementNS(ns, "g");
		$(g).append(
			paths.map(function(p) {
				const path = document.createElementNS(ns, "path")
				$(path).attr("d", p).css("fill", "#efefef")
				return path;
			})
		)
		$(svg)
			.attr("viewBox", "0 0 490 490")
			.attr("version", "1.1")
			.css("height", "10px")
			.css("width", "10px")
			.css("display", "inline-block")
			.css("margin", "0 5px 0 5px")
			.append(g);
		return svg;
	}

}();