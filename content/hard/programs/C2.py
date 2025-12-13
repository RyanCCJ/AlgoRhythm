# Method 1: Dynamic Programming
def longest_valid_parentheses_dp(s: str) -> int:
    n = len(s)
    if n < 2:
        return 0
    
    dp = [0] * n
    max_len = 0

    for i in range(1, n):
        if s[i] == ')':
            if s[i - 1] == '(':
                dp[i] = (dp[i - 2] if i >= 2 else 0) + 2
            elif i - dp[i - 1] > 0 and s[i - dp[i - 1] - 1] == '(':
                dp[i] = dp[i - 1] + 2 + (dp[i - dp[i - 1] - 2] if i - dp[i - 1] >= 2 else 0)

            max_len = max(max_len, dp[i])
    
    return max_len

# Method 2: Stack
def longest_valid_parentheses_stack(s: str) -> int:
    stack = [-1]
    max_len = 0

    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                max_len = max(max_len, i - stack[-1])
    
    return max_len

# Method 3: Two-way Scan
def longest_valid_parentheses_scan(s: str) -> int:
    left = right = max_len = 0

    for char in s:
        if char == '(':
            left += 1
        else:
            right += 1
        
        if left == right:
            max_len = max(max_len, 2 * right)
        elif right > left:
            left = right = 0
    
    left = right = 0

    for char in reversed(s):
        if char == '(':
            left += 1
        else:
            right += 1
        
        if left == right:
            max_len = max(max_len, 2 * left)
        elif left > right:
            left = right = 0
    
    return max_len