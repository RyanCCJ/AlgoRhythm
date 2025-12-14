def invert_tree(root: TreeNode) -> TreeNode:
    if not root:
        return None
    
    root.left, root.right = root.right, root.left
    
    invert_tree(root.left)
    invert_tree(root.right)
    
    return root