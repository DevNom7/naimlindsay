// Doubly Linked List Node
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

// Custom LRU Cache implementation using a Hash Map + Doubly Linked List
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // Hash Map for O(1) lookups
        this.head = new Node(null, null); // Dummy head
        this.tail = new Node(null, null); // Dummy tail
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _addNodeToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        const node = this.cache.get(key);
        this._removeNode(node);
        this._addNodeToHead(node); // Move to front (most recently used)
        return node.value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            node.value = value;
            this._removeNode(node);
            this._addNodeToHead(node);
        } else {
            const newNode = new Node(key, value);
            this.cache.set(key, newNode);
            this._addNodeToHead(newNode);

            // Evict least recently used (tail) if over capacity
            if (this.cache.size > this.capacity) {
                const tailNode = this.tail.prev;
                this._removeNode(tailNode);
                this.cache.delete(tailNode.key);
            }
        }
    }

    clear() {
        this.cache.clear();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
}

module.exports = LRUCache;