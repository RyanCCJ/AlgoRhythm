# Method 1: DFS cycle detection
def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    state = [0] * num_courses

    def has_cycle(course):
        if state[course] == 1:
            return True
        if state[course] == 2:
            return False
        
        state[course] = 1

        for next_course in graph[course]:
            if has_cycle(next_course):
                return True
        
        state[course] = 2
        return False
    
    for i in range(num_courses):
        if has_cycle(i):
            return False
    
    return True

# Method 2: BFS topological sorting
def can_finish_bfs(num_courses: int, prerequisites: list[list[int]]) -> bool:
    graph = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        indegree[course] += 1
    
    queue = [i for i in range(num_courses) if indegree[i] == 0]
    count = 0
    
    while queue:
        course = queue.pop(0)
        count += 1
        
        for next_course in graph[course]:
            indegree[next_course] -= 1
            if indegree[next_course] == 0:
                queue.append(next_course)
    
    return count == num_courses