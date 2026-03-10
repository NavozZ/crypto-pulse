"""
vader_sentiment.py
────────────────────────────────────────────────────────────
CryptoPulse AI Engine — VADER Social Media Sentiment Analyser
PUSL3190 | Plymouth Index: 10953298

Usage (called by sentimentController.ts via Node child_process):
    python vader_sentiment.py <coin_id>

Sources:
  - Reddit: public .json feeds (no API key required)
  - X/Twitter: Bearer Token (optional — falls back gracefully if not set)

Output: JSON to stdout → {
    compound, positive, negative, neutral,
    label, sources, post_count
}

VADER compound score:
  +1.0 = maximally positive (Very Bullish)
  +0.05 to +1.0 = Bullish
  -0.05 to +0.05 = Neutral
  -1.0 to -0.05 = Bearish
  -1.0 = maximally negative (Very Bearish)
"""

import sys
import json
import os
import time
import requests
import logging
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logging.disable(logging.CRITICAL)

# ── Coin → search keywords mapping ────────────────────────────────────────
COIN_KEYWORDS = {
    "bitcoin":     {"subreddits": ["bitcoin", "cryptocurrency", "CryptoCurrency"], "keywords": ["bitcoin", "btc"]},
    "ethereum":    {"subreddits": ["ethereum", "ethfinance", "CryptoCurrency"],    "keywords": ["ethereum", "eth"]},
    "solana":      {"subreddits": ["solana", "CryptoCurrency"],                    "keywords": ["solana", "sol"]},
    "binancecoin": {"subreddits": ["binance", "CryptoCurrency"],                   "keywords": ["bnb", "binance coin"]},
    "ripple":      {"subreddits": ["Ripple", "CryptoCurrency"],                    "keywords": ["xrp", "ripple"]},
    "cardano":     {"subreddits": ["cardano", "CryptoCurrency"],                   "keywords": ["cardano", "ada"]},
}

# ── X/Twitter search queries per coin ────────────────────────────────────
TWITTER_QUERIES = {
    "bitcoin":     "bitcoin OR BTC lang:en -is:retweet",
    "ethereum":    "ethereum OR ETH lang:en -is:retweet",
    "solana":      "solana OR SOL lang:en -is:retweet",
    "binancecoin": "BNB OR binancecoin lang:en -is:retweet",
    "ripple":      "XRP OR ripple lang:en -is:retweet",
    "cardano":     "cardano OR ADA lang:en -is:retweet",
}


# ── Reddit Fetcher (public JSON — no API key needed) ──────────────────────
def fetch_reddit_posts(coin_id: str, limit: int = 50) -> list[str]:
    """
    Fetch post titles + selftext from Reddit public JSON endpoints.
    No authentication required — uses public feed.
    """
    config   = COIN_KEYWORDS.get(coin_id, COIN_KEYWORDS["bitcoin"])
    texts    = []
    keywords = config["keywords"]

    headers = {
        "User-Agent": "CryptoPulse/1.0 (FYP Research Project; Python/3.11)"
    }

    for subreddit in config["subreddits"][:2]:   # max 2 subreddits to stay fast
        try:
            url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit={limit}"
            response = requests.get(url, headers=headers, timeout=10)

            if response.status_code != 200:
                continue

            data = response.json()
            posts = data.get("data", {}).get("children", [])

            for post in posts:
                post_data = post.get("data", {})
                title    = post_data.get("title", "")
                selftext = post_data.get("selftext", "")

                # Filter: only include posts mentioning the coin keyword
                combined = (title + " " + selftext).lower()
                if any(kw in combined for kw in keywords):
                    texts.append(title)
                    if selftext and len(selftext) > 20:
                        texts.append(selftext[:500])   # cap length for speed

            time.sleep(0.5)   # polite delay between requests

        except Exception:
            continue

    return texts


# ── X/Twitter Fetcher (Bearer Token) ─────────────────────────────────────
def fetch_twitter_posts(coin_id: str, max_results: int = 30) -> list[str]:
    """
    Fetch recent tweets using X API v2 Recent Search.
    Requires TWITTER_BEARER_TOKEN in environment / .env
    Falls back gracefully if token not set.
    """
    bearer_token = os.getenv("TWITTER_BEARER_TOKEN", "")

    if not bearer_token:
        return []   # graceful fallback — no crash

    query = TWITTER_QUERIES.get(coin_id, f"{coin_id} lang:en -is:retweet")

    headers = {"Authorization": f"Bearer {bearer_token}"}
    params  = {
        "query":       query,
        "max_results": max_results,
        "tweet.fields": "text",
    }

    try:
        response = requests.get(
            "https://api.twitter.com/2/tweets/search/recent",
            headers=headers,
            params=params,
            timeout=10,
        )

        if response.status_code == 200:
            tweets = response.json().get("data", [])
            return [t["text"] for t in tweets]

        # 429 = rate limited — silently skip
        return []

    except Exception:
        return []


# ── VADER Scorer ──────────────────────────────────────────────────────────
def score_texts(texts: list[str]) -> dict:
    """
    Run VADER SentimentIntensityAnalyzer over a list of text strings.
    Returns averaged compound, pos, neg, neu scores.
    """
    if not texts:
        return {"compound": 0.0, "pos": 0.0, "neg": 0.0, "neu": 1.0, "count": 0}

    analyser = SentimentIntensityAnalyzer()
    scores   = [analyser.polarity_scores(text) for text in texts]

    avg = {
        "compound": round(sum(s["compound"] for s in scores) / len(scores), 4),
        "pos":      round(sum(s["pos"]      for s in scores) / len(scores), 4),
        "neg":      round(sum(s["neg"]      for s in scores) / len(scores), 4),
        "neu":      round(sum(s["neu"]      for s in scores) / len(scores), 4),
        "count":    len(scores),
    }
    return avg


# ── Sentiment Label ───────────────────────────────────────────────────────
def get_label(compound: float) -> str:
    if   compound >=  0.5:  return "Very Bullish"
    elif compound >=  0.1:  return "Bullish"
    elif compound >  -0.1:  return "Neutral"
    elif compound >= -0.5:  return "Bearish"
    else:                   return "Very Bearish"


# ── Main ──────────────────────────────────────────────────────────────────
def run_sentiment(coin_id: str) -> dict:
    sources_used = []

    # ── Reddit ─────────────────────────────────────────────────────────
    reddit_texts = fetch_reddit_posts(coin_id)
    if reddit_texts:
        sources_used.append("Reddit")

    # ── X/Twitter ──────────────────────────────────────────────────────
    twitter_texts = fetch_twitter_posts(coin_id)
    if twitter_texts:
        sources_used.append("X (Twitter)")

    # ── Combine all texts ──────────────────────────────────────────────
    all_texts = reddit_texts + twitter_texts

    if not all_texts:
        return {
            "coin_id":    coin_id,
            "compound":   0.0,
            "positive":   0.0,
            "negative":   0.0,
            "neutral":    1.0,
            "label":      "Neutral",
            "post_count": 0,
            "sources":    [],
            "note":       "No posts retrieved",
        }

    # ── Score with VADER ───────────────────────────────────────────────
    scores = score_texts(all_texts)

    return {
        "coin_id":    coin_id,
        "compound":   scores["compound"],
        "positive":   scores["pos"],
        "negative":   scores["neg"],
        "neutral":    scores["neu"],
        "label":      get_label(scores["compound"]),
        "post_count": scores["count"],
        "sources":    sources_used,
    }


# ── Entry Point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python vader_sentiment.py <coin_id>"}))
        sys.exit(1)

    coin_id = sys.argv[1]

    # Load .env manually (dotenv not required)
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

    try:
        result = run_sentiment(coin_id)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
