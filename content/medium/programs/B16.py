# Method 1: O(n²) DP
def length_of_lis(nums: list[int]) -> int:
    n = len(nums)
    dp = [1] * n

    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

# Method 2: O(n log n) DP + Binary Search
def length_of_lis(nums: list[int]) -> int:
    tails = []
    
    for num in nums:
        left, right = 0, len(tails)
        while left < right:
            mid = left + (right - left) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    
    return len(tails)