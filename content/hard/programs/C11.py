class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.freq = 1
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
        self.size = 0
    
    def add_node(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        self.size += 1
    
    def remove_node(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
        self.size -= 1
    
    def remove_tail(self):
        if self.size == 0:
            return None
        node = self.tail.prev
        self.remove_node(node)
        return node

class LFUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.key_map = {}
        self.freq_map = {}
        self.min_freq = 0
    
    def get(self, key: int) -> int:
        if key not in self.key_map:
            return -1
        
        node = self.key_map[key]
        self._update_freq(node)
        return node.val
    
    def put(self, key: int, value: int) -> None:
        if self.capacity == 0:
            return
        
        if key in self.key_map:
            node = self.key_map[key]
            node.val = value
            self._update_freq(node)
        else:
            if len(self.key_map) >= self.capacity:
                min_freq_list = self.freq_map[self.min_freq]
                removed_node = min_freq_list.remove_tail()
                del self.key_map[removed_node.key]
            
            new_node = Node(key, value)
            self.key_map[key] = new_node
            
            if 1 not in self.freq_map:
                self.freq_map[1] = DoublyLinkedList()
            self.freq_map[1].add_node(new_node)
            self.min_freq = 1
    
    def _update_freq(self, node):
        old_freq = node.freq
        old_list = self.freq_map[old_freq]
        old_list.remove_node(node)
        
        if old_list.size == 0 and old_freq == self.min_freq:
            self.min_freq += 1
        
        node.freq += 1
        new_freq = node.freq
        
        if new_freq not in self.freq_map:
            self.freq_map[new_freq] = DoublyLinkedList()
        self.freq_map[new_freq].add_node(node)