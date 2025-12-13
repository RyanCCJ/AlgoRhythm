from collections import defaultdict
import heapq

class Twitter:
    def __init__(self):
        self.timestamp = 0
        self.user_tweets = defaultdict(list)
        self.user_follows = defaultdict(set)
    
    def post_tweet(self, user_id: int, tweet_id: int) -> None:
        self.user_tweets[user_id].append((self.timestamp, tweet_id))
        self.timestamp += 1
    
    def get_news_feed(self, user_id: int) -> list[int]:
        heap = []
        
        self.user_follows[user_id].add(user_id)
        
        for followee_id in self.user_follows[user_id]:
            if followee_id in self.user_tweets:
                tweets= self.user_tweets[followee_id]
                if tweets:
                    index = len(tweets) - 1
                    timestamp, tweet_id = tweets[index]
                    heapq.heappush(heap, (-timestamp, tweet_id, followee_id, index))
        
        result = []
        
        while heap and len(result) < 10:
            timestamp, tweet_id, followee_id, index = heapq.heappop(heap)
            result.append(tweet_id)
            
            if index > 0:
                next_timestamp, next_tweet_id = self.user_tweets[followee_id][index - 1]
                heapq.heappush(heap, (-next_timestamp, next_tweet_id, followee_id, index - 1))
        
        self.user_follows[user_id].discard(user_id)
        
        return result
    
    def follow(self, follower_id: int, followee_id: int) -> None:
        if follower_id != followee_id:
            self.user_follows[follower_id].add(followee_id)
    
    def unfollow(self, follower_id: int, followee_id: int) -> None:
        self.user_follows[follower_id].discard(followee_id)