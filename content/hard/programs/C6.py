class Solution:
    def max_path_sum(self, root: TreeNode) -> int:
        self.max_sum = float('-inf')

        def max_gain(node):
            if not node:
                return 0
            
            left_gain = max(max_gain(node.left), 0)
            right_gain = max(max_gain(node.right), 0)

            current_path_sum = node.val + left_gain + right_gain
            self.max_sum = max(self.max_sum, current_path_sum)

            return node.val + max(left_gain, right_gain)
        
        max_gain(root)
        return self.max_sum