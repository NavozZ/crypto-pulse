import { Request, Response } from "express";

const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

const COIN_CONFIG: Record<string, { subreddits: string[]; keywords: string[] }> = {
  bitcoin: { subreddits: ["bitcoin", "cryptocurrency"], keywords: ["bitcoin", "btc"] },
  ethereum: { subreddits: ["ethereum", "ethfinance"], keywords: ["ethereum", "eth"] },
  solana: { subreddits: ["solana", "cryptocurrency"], keywords: ["solana", "sol"] },
  binancecoin: { subreddits: ["binance", "cryptocurrency"], keywords: ["bnb", "binance"] },
  ripple: { subreddits: ["ripple", "cryptocurrency"], keywords: ["xrp", "ripple"] },
  cardano: { subreddits: ["cardano", "cryptocurrency"], keywords: ["ada", "cardano"] },
};

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

const buildTrendingTopics = (news: Array<{ title: string }>) => {
  const stopWords = new Set(["with", "from", "this", "that", "have", "will", "market", "price", "coin"]);
  const scores = new Map<string, number>();
  news.forEach((item) => {
    tokenize(item.title).forEach((word) => {
      if (stopWords.has(word)) return;
      scores.set(word, (scores.get(word) || 0) + 1);
    });
  });
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, mentions]) => ({ topic, mentions }));
};

const sentimentSummary = (label: string, compound: number, postCount: number) => {
  if (postCount === 0) {
    return "Market sentiment is neutral due to limited social signals.";
  }
  if (compound >= 0.25) {
    return `Sentiment is ${label.toLowerCase()} with sustained positive momentum across discussions.`;
  }
  if (compound <= -0.25) {
    return `Sentiment is ${label.toLowerCase()} with risk-off signals dominating conversations.`;
  }
  return "Sentiment is mixed with no strong directional edge at the moment.";
};

const computeFearGreed = (compound: number) => {
  const raw = Math.round((compound + 1) * 50);
  return Math.max(0, Math.min(100, raw));
};

export const getNewsAndSentiment = async (req: Request, res: Response) => {
  const { coinId } = req.params;
  const search = String(req.query.search || "").toLowerCase().trim();

  if (!ALLOWED_COINS.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  const config = COIN_CONFIG[coinId];

  try {
    const allNews = [];
    for (const subreddit of config.subreddits) {
      const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=35`;
      const response = await fetch(url, {
        headers: { "User-Agent": "CryptoPulse/1.0" },
      });
      if (!response.ok) continue;
      const payload = await response.json() as any;
      const posts = payload?.data?.children || [];
      for (const post of posts) {
        const data = post?.data;
        if (!data?.title) continue;
        const combined = `${data.title} ${data.selftext || ""}`.toLowerCase();
        const hasCoinKeyword = config.keywords.some((keyword) => combined.includes(keyword));
        if (!hasCoinKeyword) continue;

        allNews.push({
          id: data.id,
          title: data.title,
          excerpt: (data.selftext || "").slice(0, 220),
          source: `Reddit /r/${subreddit}`,
          publishedAt: new Date((data.created_utc || 0) * 1000).toISOString(),
          url: `https://www.reddit.com${data.permalink || ""}`,
          score: data.score || 0,
          comments: data.num_comments || 0,
        });
      }
    }

    const dedupedNews = [...new Map(allNews.map((item) => [item.id, item])).values()]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

    const filteredNews = search
      ? dedupedNews.filter((item) => item.title.toLowerCase().includes(search))
      : dedupedNews;

    const aiEngineUrl = process.env.AI_ENGINE_URL || "http://localhost:8000";
    const sentimentResponse = await fetch(`${aiEngineUrl}/sentiment/${coinId}`, {
      signal: AbortSignal.timeout(30000),
    });

    if (!sentimentResponse.ok) {
      return res.status(502).json({ message: "Sentiment engine unavailable" });
    }

    const sentiment = await sentimentResponse.json() as any;
    const fearGreed = computeFearGreed(sentiment.compound || 0);

    return res.json({
      coin: coinId,
      search,
      sentiment: {
        compound: sentiment.compound || 0,
        label: sentiment.label || "Neutral",
        positive: sentiment.positive || 0,
        negative: sentiment.negative || 0,
        neutral: sentiment.neutral || 1,
        postCount: sentiment.post_count || 0,
        summary: sentimentSummary(sentiment.label || "Neutral", sentiment.compound || 0, sentiment.post_count || 0),
      },
      fearGreed: {
        score: fearGreed,
        label: fearGreed >= 70 ? "Greed" : fearGreed <= 30 ? "Fear" : "Neutral",
      },
      trendingTopics: buildTrendingTopics(filteredNews),
      news: filteredNews.slice(0, 40),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch news and sentiment",
      error: (error as Error).message,
    });
  }
};

