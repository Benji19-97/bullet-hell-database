// Queue class
class Queue {
      constructor() {
            this.items = [];
      }

      // Add element to the end of the queue
      enqueue(element) {
            this.items.push(element);
      }

      // Remove element from the front of the queue and return it
      dequeue() {
            if (this.isEmpty()) {
                  return "Queue is empty";
            }
            return this.items.shift();
      }

      // Return the front element of the queue without removing it
      front() {
            if (this.isEmpty()) {
                  return "Queue is empty";
            }
            return this.items[0];
      }

      // Check if the queue is empty
      isEmpty() {
            return this.items.length === 0;
      }

      // Return the size of the queue
      size() {
            return this.items.length;
      }

      // Clear the queue (remove all elements)
      clear() {
            this.items = [];
      }

      any() {
            if (this.isEmpty()) {
                  return false;
            }
            return true;
      }

      sort() {
            this.items.sort((x) => x.patternName);
      }

      // Print the elements of the queue
      printQueue() {
            let queueString = "";
            for (let i = 0; i < this.items.length; i++) {
                  queueString += this.items[i] + " ";
            }
            console.log(queueString);
      }
}
