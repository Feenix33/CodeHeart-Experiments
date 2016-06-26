// A PriorityQueue is a queue that can arranges elements by cost
// instead of arrival order

function PriorityQueue() {
    this.elementArray = [];
    this.costArray    = [];
}


/** Number of elements in the queue */
PriorityQueue.prototype.length = function() {
    return length(this.elementArray);
}


/** Assumes that element is not already in the queue */
PriorityQueue.prototype.insert = function(element, cost) {
    insertBack(this.elementArray, element);
    insertBack(this.costArray, cost);
}


/** Erases the queue */
PriorityQueue.prototype.clear = function() {
    this.elementArray = [];
    this.costArray    = [];
}


/** Updates the cost of element in the queue */
PriorityQueue.prototype.update = function(element, newCost) {
    var i = indexOf(this.elementArray, element);

    if (i == -1) {
        throw new Error("" + element + " is not in the PriorityQueue");
    }

    this.costArray[i] = newCost;
}


/** Removes the minimum cost element and returns it */
PriorityQueue.prototype.removeMin = function() {
    if (this.elementArray.length == 0) {
        throw new Error("PriorityQueue is empty");
    }

    var i, j = 0;
    var m = this.costArray[j];
    for (i = 1; i < this.elementArray.length; ++i) {
        if (this.costArray[i] < m) {
            m = this.costArray[i];
            j = i;
        }
    }

    removeAt(this.costArray, j);
    return removeAt(this.elementArray, j);
}
