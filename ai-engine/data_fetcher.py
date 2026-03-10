"""
data_fetcher.py
────────────────────────────────────────────────────────────
CryptoPulse AI Engine — Shared CoinGecko Data Fetcher
PUSL3190 | Plymouth Index: 10953298

Provides fetch_ohlc() used by prophet_forecast.py
"""

import requests
import time

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

HEADERS = {
    "Accept": "application/json",
    "User-Agent": "CryptoPulse/1.0 (FYP Research; Python/3.11)"
}


def fetch_ohlc(coin_id: str, days: int = 90) -> list[dict]:
    """
    Fetch OHLC candlestick data from CoinGecko.
    Returns list of { time, open, high, low, close } dicts.
    time is Unix timestamp in seconds.
    """
    url = f"{COINGECKO_BASE}/coins/{coin_id}/ohlc"
    params = {"vs_currency": "usd", "days": str(days)}

    for attempt in range(3):   # retry up to 3 times
        try:
            response = requests.get(url, params=params, headers=HEADERS, timeout=15)

            if response.status_code == 200:
                raw = response.json()   # [[timestamp_ms, open, high, low, close], ...]

                seen  = set()
                ohlc  = []
                for row in raw:
                    ts = int(row[0] / 1000)   # ms → seconds
                    if ts not in seen:
                        seen.add(ts)
                        ohlc.append({
                            "time":  ts,
                            "open":  float(row[1]),
                            "high":  float(row[2]),
                            "low":   float(row[3]),
                            "close": float(row[4]),
                        })

                return sorted(ohlc, key=lambda x: x["time"])

            elif response.status_code == 429:
                # Rate limited — wait and retry
                time.sleep(60)
                continue

            else:
                break

        except requests.exceptions.RequestException:
            time.sleep(5)
            continue

    return []


def fetch_current_price(coin_id: str) -> float:
    """Fetch current USD price for a coin."""
    url    = f"{COINGECKO_BASE}/simple/price"
    params = {"ids": coin_id, "vs_currencies": "usd"}

    try:
        response = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return float(data.get(coin_id, {}).get("usd", 0))
    except Exception:
        pass
    return 0.0
