from collections import defaultdict, deque

def find_ladders(begin_word: str, end_word: str, word_list: list[str]) -> list[list[str]]:
    word_set = set(word_list)
    if end_word not in word_set:
        return []
    
    neighbors = defaultdict(list)
    distance = {begin_word: 0}
    
    def bfs():
        queue = deque([begin_word])
        found = False
        
        while queue and not found:
            level_size = len(queue)
            visited_this_level = set()
            
            for _ in range(level_size):
                word = queue.popleft()
                current_dist = distance[word]
                
                for i in range(len(word)):
                    for c in 'abcdefghijklmnopqrstuvwxyz':
                        if c == word[i]:
                            continue
                        
                        next_word = word[:i] + c + word[i+1:]
                        
                        if next_word == end_word:
                            found = True
                        
                        if next_word not in word_set:
                            continue
                        
                        if next_word not in distance:
                            distance[next_word] = current_dist + 1
                            visited_this_level.add(next_word)
                            neighbors[word].append(next_word)
                        elif distance[next_word] == current_dist + 1:
                            neighbors[word].append(next_word)
            
            for word in visited_this_level:
                queue.append(word)
    
    bfs()
    
    if end_word not in distance:
        return []
    
    result = []
    path = [begin_word]
    
    def dfs(word):
        if word == end_word:
            result.append(path[:])
            return
        
        for next_word in neighbors[word]:
            path.append(next_word)
            dfs(next_word)
            path.pop()
    
    dfs(begin_word)
    return result