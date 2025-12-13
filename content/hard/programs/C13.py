# Method 1: Expand Around Center
def longest_palindrome_expand(s: str) -> str:
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1
    
    if not s:
        return ""
    
    start, end = 0, 0
    
    for i in range(len(s)):
        len1 = expand(i, i)
        len2 = expand(i, i + 1)
        max_len = max(len1, len2)
        
        if max_len > end - start:
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
    
    return s[start:end + 1]

# Method 2: Dynamic Programming
def longest_palindrome_dp(s: str) -> str:
    n = len(s)
    if n < 2:
        return s
    
    dp = [[False] * n for _ in range(n)]
    start, max_len = 0, 1
    
    for i in range(n):
        dp[i][i] = True
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                if length == 2:
                    dp[i][j] = True
                else:
                    dp[i][j] = dp[i + 1][j - 1]
                
                if dp[i][j] and length > max_len:
                    start = i
                    max_len = length
    
    return s[start:start + max_len]

# Method 3: Manacher's Algorithm
def longest_palindrome_manacher(s: str) -> str:
    if not s:
        return ""
    
    t = '#'.join('^{}$'.format(s))
    n = len(t)
    p = [0] * n
    center = right = 0
    
    for i in range(1, n - 1):
        if i < right:
            p[i] = min(right - i, p[2 * center - i])
        
        while t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        
        if i + p[i] > right:
            center, right = i, i + p[i]
    
    max_len, center_index = max((length, i) for i, length in enumerate(p))
    start = (center_index - max_len) // 2
    return s[start:start + max_len]