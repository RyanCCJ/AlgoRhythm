def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    result = []

    def backtrack(start, path, remain):
        if remain == 0:
            result.append(path[:])
            return
        if remain < 0:
            return

        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, path, remain - candidates[i])
            path.pop()

    backtrack(0, [], target)
    return result