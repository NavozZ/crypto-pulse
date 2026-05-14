export const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", icon: "₿", color: "#F7931A" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627EEA" },
  { id: "solana", symbol: "SOL", name: "Solana", icon: "◎", color: "#9945FF" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", icon: "⬡", color: "#F3BA2F" },
  { id: "ripple", symbol: "XRP", name: "XRP", icon: "✕", color: "#346AA9" },
  { id: "cardano", symbol: "ADA", name: "Cardano", icon: "₳", color: "#0033AD" },
];

export const COIN_MAP = COINS.reduce((acc, coin) => {
  acc[coin.id] = coin;
  return acc;
}, {});

