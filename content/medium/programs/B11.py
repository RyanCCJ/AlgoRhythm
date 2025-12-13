class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors else []

# DFS
def clone_graph(node: Node) -> Node:
    if not node:
        return None
    
    visited = {}

    def dfs(node):
        if node in visited:
            return visited[node]
        
        clone = Node(node.val)
        visited[node] = clone

        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)

# BFS
def clone_graph_bfs(node: Node) -> Node:
    if not node:
        return None
    
    visited = {node: Node(node.val)}
    queue = [node]

    while queue:
        current = queue.pop(0)
        
        for neighbor in current.neighbors:
            if neighbor not in visited:
                visited[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            
            visited[current].neighbors.append(visited[neighbor])
    
    return visited[node]