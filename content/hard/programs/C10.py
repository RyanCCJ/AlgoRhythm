from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    if not nums or k == 0:
        return []
    
    dq = deque()
    result = []
    
    for i, num in enumerate(nums):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        while dq and nums[dq[-1]] < num:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result