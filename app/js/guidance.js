var guidance = (function (undefined) {

	var extractKeys = function (obj) {
		var keys = [];

		for (var key in obj) {
		    Object.prototype.hasOwnProperty.call(obj,key) && keys.push(key);
		}

		return keys;
	}

	var sorter = function (a, b) {
		return parseFloat (a) - parseFloat (b);
	}

	function adjustCostForOptions(mapCost, system) {
		var system = systemAnalysis.analyse(30000000 + 1 * system);
		if(!system) { return mapCost; }
		if(options.chain.routeIgnore.enabled && options.chain.routeIgnore.systems.indexOf(system.name) >= 0) {
			mapCost += 100;	// Penalty for an avoided system
		}
		switch(options.chain.routeSecurity) {
			case 'highsec': return mapCost + (system.security < 0.45 ? 100 : 0);
			case 'avoid-high': return mapCost + (system.security >= 0.45 ? 100 : 0);
			case 'avoid-null': return mapCost + (system.security <= 0.0 ? 100 : 0);
			default: return mapCost;	// in case of some invalid option, default to shortest
		}
	}

	var findPaths = function (map, start, end, infinity) {
		if(!(map[start] && map[end])) { return null; }	// both ends of path must be in network somewhere
		
		infinity = infinity || Infinity;

		var costs = {},
		    open = {'0': [start]},
		    predecessors = {},
		    keys;

		var addToOpen = function (cost, vertex) {
			var key = "" + cost;
			if (!open[key]) open[key] = [];
			open[key].push(vertex);
		}

		costs[start] = 0;

		while (open && !costs[end]) {
			if(!(keys = extractKeys(open)).length) break;

			keys.sort(sorter);

			var key = keys[0],
			    bucket = open[key],
			    node = bucket.shift(),
			    currentCost = parseFloat(key),
			    adjacentNodes = map[node] || {};

			if (!bucket.length) delete open[key];

			for (var vertex in adjacentNodes) {
			    if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
					var cost = adjustCostForOptions(adjacentNodes[vertex], vertex),
					    totalCost = cost + currentCost,
					    vertexCost = costs[vertex];

					if ((vertexCost === undefined) || (vertexCost > totalCost)) {
						costs[vertex] = totalCost;
						addToOpen(totalCost, vertex);
						predecessors[vertex] = node;
					}
				}
			}
		}

		if (costs[end] === undefined) {
			return null;
		} else {
			return predecessors;
		}

	}

	var extractShortest = function (predecessors, end) {
		var nodes = [],
		    u = end;

		while (u) {
			nodes.push(u);
			predecessor = predecessors[u];
			u = predecessors[u];
		}

		nodes.reverse();
		return nodes;
	}

	var findShortestPath = function (map, nodes) {
		var start = nodes.shift(),
		    end,
		    predecessors,
		    path = [],
		    shortest;

		while (nodes.length) {
			end = nodes.shift();
			predecessors = findPaths(map, start, end);

			if (predecessors) {
				shortest = extractShortest(predecessors, end);
				if (nodes.length) {
					path.push.apply(path, shortest.slice(0, -1));
				} else {
					return path.concat(shortest);
				}
			} else {
				return null;
			}

			start = end;
		}
	}
	
	var Guidance = { kSpaceCache: {} };
	Guidance.clearCache = function() { Guidance.kSpaceCache = {}; }
	
	Guidance.findShortestPath = function (map, start, end) {
		const nodes = [start, end];

		const cacheKey = nodes.join(',');
		const cachedPath = Guidance.kSpaceCache[cacheKey];
		if(cachedPath === undefined) {
			return Guidance.kSpaceCache[cacheKey] = findShortestPath(map, nodes);
		} else {
			return cachedPath;
		}
	}

	return Guidance;
})();
