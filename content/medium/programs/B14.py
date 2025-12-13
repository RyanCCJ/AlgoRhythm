from collections import Counter
import heapq

# Method 1: min heap
def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)

# Method 2: bucket sort
def top_k_frequent_bucket(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    n = len(nums)
    
    bucket = [[] for _ in range(n + 1)]
    for num, freq in count.items():
        bucket[freq].append(num)
    
    result = []
    for freq in range(n, 0, -1):
        if bucket[freq]:
            result.extend(bucket[freq])
            if len(result) >= k:
                return result[:k]
    
    return result