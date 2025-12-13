# Method 1: Binary Search on Partition
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    
    while left <= right:
        partition1 = (left + right) // 2
        partition2 = (m + n + 1) // 2 - partition1
        
        max_left1 = float('-inf') if partition1 == 0 else nums1[partition1 - 1]
        min_right1 = float('inf') if partition1 == m else nums1[partition1]
        
        max_left2 = float('-inf') if partition2 == 0 else nums2[partition2 - 1]
        min_right2 = float('inf') if partition2 == n else nums2[partition2]
        
        if max_left1 <= min_right2 and max_left2 <= min_right1:
            if (m + n) % 2 == 0:
                return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2
            else:
                return max(max_left1, max_left2)
        elif max_left1 > min_right2:
            right = partition1 - 1
        else:
            left = partition1 + 1
    
    return 0.0

# Method 2: Find k-th Element
def find_median_sorted_arrays_kth(nums1: list[int], nums2: list[int]) -> float:
    def find_kth(k):
        i1, i2 = 0, 0
        
        while True:
            if i1 == len(nums1):
                return nums2[i2 + k - 1]
            if i2 == len(nums2):
                return nums1[i1 + k - 1]
            if k == 1:
                return min(nums1[i1], nums2[i2])
            
            mid1 = min(i1 + k // 2 - 1, len(nums1) - 1)
            mid2 = min(i2 + k // 2 - 1, len(nums2) - 1)
            
            if nums1[mid1] <= nums2[mid2]:
                k -= mid1 - i1 + 1
                i1 = mid1 + 1
            else:
                k -= mid2 - i2 + 1
                i2 = mid2 + 1
    
    total = len(nums1) + len(nums2)
    if total % 2 == 1:
        return find_kth(total // 2 + 1)
    else:
        return (find_kth(total // 2) + find_kth(total // 2 + 1)) / 2