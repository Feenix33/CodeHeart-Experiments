
/** Used by findPath */
function Step(last, startCost, goalCost) {
    this.last          = last;
    this.previous      = null;
    this.costFromStart = startCost;
    this.costToGoal    = goalCost;
    this.inQueue       = true;
}


Step.prototype.cost = function() {
    return this.costFromStart + this.costToGoal;
}


var _findPathBestPathTo = new Object();

/**
    Call after findPath to obtain an array of [from, to] pairs for
    explored paths.
 */
function getExploredSteps() {
    var id, step;
    steps = [];

    // Enumerate all keys in the object
    for (id in _findPathBestPathTo) {
        if (_findPathBestPathTo.hasOwnProperty(id)) {
            step = _findPathBestPathTo[id];
            if (step.previous != null) {
                // The starter step has no previous
                insertBack(steps, step);
            }
        }
    }

    return steps;
}

/**
   Finds a good path from start to goal using the A* algorithm, and
   returns it as a list of nodes to visit.  Returns null if there is
   no path.

   map: Map

   start: Node

   goal: Node

   costEstimator: function(Map, Node, Node) that guesses what the cost
   is to go between the nodes.

   edgeCost: function(Map, Node, Node) that returns the exact cost to
   move between nodes that are known to be neighbors.

   getNeighbors: function(Map, Node) that returns an array of all
   neighbors.

   getNodeID: function(Map, Node) that returns a unique integer or
   string for the node.  IDs must be unique and deterministic--
   getNodeID(a) === getNodeID(b) must be true if and only if a and b describe
   the same location.

   This function is designed to work with any kind of Map and Node--they
   aren't specific classes and need not have any particular methods.

   It takes functions costEstimator, edgeCost, and getNeighbors (i.e.,
   instead of requiring methods on Map/Node) so that the map
   implementation is unconstrained, and so that the same map and nodes
   can be used with different cost estimates.  For example, a bird, a
   fish, and a cat have different movement modes and thus would have
   different costs for moving across different types of terrain in the
   same map.


   For visualization purposes, findPathBestPathTo contains information
   about the other explored paths when the function returns.
 */
function findPath(map, start, goal, costEstimator, edgeCost, getNeighbors, getNodeID) {
    var neighbors, i, P, N, newCostromStart, oldBestToN;

    // Paths encoded by their last Step paired with expected shortest
    // distance
    var queue = new PriorityQueue();

    // Maps each Node to the Step on the best known path to that Node.
    var bestPathTo = new Object();

    // Store all explored paths for later visualization
    _findPathBestPathTo = bestPathTo;

    var shortest = new Step(start, 0, costEstimator(map, start, goal));
    bestPathTo[getNodeID(map, start)] = shortest;
    queue.insert(shortest, shortest.cost());

    var goalID = getNodeID(map, goal);

    while (queue.length() > 0) {
        shortest = queue.removeMin();
        shortest.inQueue = false;

        // Last node on the shortest path
        P = shortest.last;

        if (getNodeID(map, P) === goalID) {
            // We're done.  Generate the path to the goal by retracing steps
            path = [goal];

            while (shortest.previous != null) {
                shortest = bestPathTo[getNodeID(map, shortest.previous)];
                insertFront(path, shortest.last);
            }

            return path;
        }

        // Consider all neighbors of P (that are still in the queue
        // for consideration)
        neighbors = getNeighbors(map, P);
        for (i = 0; i < neighbors.length; ++i) {
            N = neighbors[i];
            newCostFromStart = shortest.costFromStart + edgeCost(map, P, N);

            // Find the current-best known way to N (or create it, if there isn't one)
            oldBestToN = bestPathTo[getNodeID(map, N)];
            if (oldBestToN === undefined) {
                // Create an expensive dummy path that will immediately be overwritten
                oldBestToN = new Step(N, Infinity, costEstimator(map, N, goal));
                bestPathTo[getNodeID(map, N)] = oldBestToN;
                queue.insert(oldBestToN, oldBestToN.cost());
            }

            // Have we discovered a new best way to N?
            if (oldBestToN.inQueue && (oldBestToN.costFromStart > newCostFromStart)) {
                // Update the step at this node
                oldBestToN.costFromStart = newCostFromStart;
                oldBestToN.previous = P;
                queue.update(oldBestToN, oldBestToN.cost());
            }

        } // for each neighbor

    } // while queue not empty

    // There was no path from start to goal
    return null;
}
