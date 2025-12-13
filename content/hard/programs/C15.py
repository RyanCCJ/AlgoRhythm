from collections import defaultdict
import heapq

class AutocompleteSystem:
    def __init__(self, sentences: list[str], times: list[int]):
        self.sentence_count = defaultdict(int)
        for sentence, count in zip(sentences, times):
            self.sentence_count[sentence] = count
        
        self.current_input = ""
    
    def input(self, c: str) -> list[str]:
        if c == '#':
            self.sentence_count[self.current_input] += 1
            self.current_input = ""
            return []
        
        self.current_input += c
        
        candidates = []
        for sentence, count in self.sentence_count.items():
            if sentence.startswith(self.current_input):
                candidates.append((-count, sentence))
        
        heapq.heapify(candidates)
        result = []
        
        for _ in range(min(3, len(candidates))):
            count, sentence = heapq.heappop(candidates)
            result.append(sentence)
        
        return result