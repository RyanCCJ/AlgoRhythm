# Method 1: Preorder DFS
class Codec:
    def serialize(self, root):
        def dfs(node):
            if not node:
                return 'null'
            return str(node.val) + ',' + dfs(node.left) + ',' + dfs(node.right)
        
        return dfs(root)
    
    def deserialize(self, data):
        def dfs(nodes):
            val = next(nodes)
            if val == 'null':
                return None
            
            node = TreeNode(int(val))
            node.left = dfs(nodes)
            node.right = dfs(nodes)
            return node
        
        return dfs(iter(data.split(',')))

# Method 2: Level-order BFS
class CodecBFS:
    def serialize(self, root):
        if not root:
            return ''
        
        result = []
        queue = [root]

        while queue:
            node = queue.pop(0)
            if node:
                result.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append('null')
        
        return ','.join(result)
    
    def deserialize(self, data):
        if not data:
            return None
        
        nodes = data.split(',')
        root = TreeNode(int(nodes[0]))
        queue = [root]
        i = 1

        while queue:
            node = queue.pop(0)

            if nodes[i] != 'null':
                node.left = TreeNode(int(nodes[i]))
                queue.append(node.left)
            i += 1

            if nodes[i] != 'null':
                node.right = TreeNode(int(nodes[i]))
                queue.append(node.right)
            i += 1
        
        return root