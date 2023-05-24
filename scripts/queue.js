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
            this.items.sort((a, b) => {
                  var nameA = a.pattern.name.toLowerCase();
                  var nameB = b.pattern.name.toLowerCase();

                  // Extract name parts and numeric values from names
                  var namePartA = nameA.replace(/\d+$/, "").trim();
                  var namePartB = nameB.replace(/\d+$/, "").trim();
                  var numberA = parseInt((nameA.match(/\d+$/g) || []).pop());
                  var numberB = parseInt((nameB.match(/\d+$/g) || []).pop());

                  // Compare alphabetically first
                  if (namePartA < namePartB) return -1;
                  if (namePartA > namePartB) return 1;

                  // If names are equal alphabetically, compare numerically if numbers exist
                  if (!isNaN(numberA) && !isNaN(numberB)) {
                        return numberA - numberB;
                  } else if (!isNaN(numberA)) {
                        // 'a' has a number, but 'b' does not, 'a' should come after 'b'
                        return 1;
                  } else if (!isNaN(numberB)) {
                        // 'b' has a number, but 'a' does not, 'b' should come after 'a'
                        return -1;
                  }

                  // if both are NaN, they are equal
                  return 0;
            });
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
