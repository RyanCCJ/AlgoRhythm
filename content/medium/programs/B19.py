def permute(nums: list[int]) -> list[list[int]]:
    result = []
    n = len(nums)
    used = [False] * n

    def backtrack(path):
        if len(path) == n:
            result.append(path[:])
            return

        for i in range(n):
            if used[i]:
                continue
            
            used[i] = True
            path.append(nums[i])
            backtrack(path)
            path.pop()
            used[i] = False

    backtrack([])
    return result