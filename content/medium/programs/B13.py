import random

# Method 1: quick select
def find_kth_largest(nums: list[int], k: int) -> int:
    def partition(left, right, pivot_index):
        pivot = nums[pivot_index]
        nums[pivot_index], nums[right] = nums[right], nums[pivot_index]
        store_index = left
        
        for i in range(left, right):
            if nums[i] < pivot:
                nums[i], nums[store_index] = nums[store_index], nums[i]
                store_index += 1
        
        nums[store_index], nums[right] = nums[right], nums[store_index]
        return store_index
    
    def select(left, right, k_smallest):
        if left == right:
            return nums[left]
        
        pivot_index = random.randint(left, right)
        pivot_index = partition(left, right, pivot_index)

        if k_smallest == pivot_index:
            return nums[k_smallest]
        elif k_smallest < pivot_index:
            return select(left, pivot_index - 1, k_smallest)
        else:
            return select(pivot_index + 1, right, k_smallest)
    
    return select(0, len(nums) - 1, len(nums) - k)

# Method 2: min heap
import heapq

def find_kth_largest_heap(nums: list[int], k: int) -> int:
    heap = []

    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    
    return heap[0]