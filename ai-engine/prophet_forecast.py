"""
prophet_forecast.py
────────────────────────────────────────────────────────────
CryptoPulse AI Engine — Facebook Prophet Time-Series Forecast
PUSL3190 | Plymouth Index: 10953298

Usage (called by forecastController.ts via Node child_process):
    python prophet_forecast.py <coin_id> <days>

Reads:  historical OHLC JSON from CoinGecko (via data_fetcher)
Output: JSON to stdout → { forecast: [{ds, yhat, yhat_lower, yhat_upper}] }

Prophet additive model: y(t) = g(t) + s(t) + h(t) + ε(t)
  g(t) = trend component
  s(t) = seasonality (weekly + yearly)
  h(t) = holiday/event effects
  ε(t) = error term
"""

import sys
import json
import logging
import pandas as pd
from prophet import Prophet
from data_fetcher import fetch_ohlc

# Suppress Prophet/Stan output — only our JSON goes to stdout
logging.getLogger("prophet").setLevel(logging.ERROR)
logging.getLogger("cmdstanpy").setLevel(logging.ERROR)

# ── Constants ──────────────────────────────────────────────────────────────
FORECAST_DAYS   = 14    # 14-day forward projection
HISTORY_DAYS    = 90    # 90 days of history fed to Prophet


def run_forecast(coin_id: str, days: int = HISTORY_DAYS) -> dict:
    """
    Fetch historical close prices and run Facebook Prophet forecast.
    Returns dict with 'forecast' array ready for TradingView overlay.
    """

    # ── 1. Fetch historical OHLC data ─────────────────────────────────────
    ohlc = fetch_ohlc(coin_id, days)

    if not ohlc or len(ohlc) < 10:
        raise ValueError(f"Insufficient data for {coin_id}: got {len(ohlc)} points, need 10+")

    # ── 2. Prepare DataFrame in Prophet format ─────────────────────────────
    # Prophet requires columns: ds (datetime) and y (value)
    df = pd.DataFrame(ohlc)
    df["ds"] = pd.to_datetime(df["time"], unit="s")   # Unix timestamp → datetime
    df["y"]  = df["close"].astype(float)
    df = df[["ds", "y"]].dropna().sort_values("ds").reset_index(drop=True)

    # ── 3. Configure Prophet model ─────────────────────────────────────────
    model = Prophet(
        changepoint_prior_scale   = 0.15,   # flexibility of trend — higher = more reactive
        seasonality_prior_scale   = 10.0,   # strength of seasonality components
        seasonality_mode          = "multiplicative",  # better for crypto price scales
        daily_seasonality         = False,
        weekly_seasonality        = True,   # s(t) weekly component
        yearly_seasonality        = False,  # not enough data for yearly
        interval_width            = 0.80,   # 80% confidence interval (yhat_lower/upper)
    )

    # Add custom crypto-specific seasonality (3-day cycle often seen in crypto)
    model.add_seasonality(
        name   = "crypto_cycle",
        period = 3.5,
        fourier_order = 3,
    )

    # ── 4. Fit model to historical data ───────────────────────────────────
    model.fit(df)

    # ── 5. Create future dataframe for FORECAST_DAYS ahead ────────────────
    future = model.make_future_dataframe(periods=FORECAST_DAYS, freq="D")

    # ── 6. Generate forecast ───────────────────────────────────────────────
    forecast_df = model.predict(future)

    # ── 7. Extract only the future forecast (not historical fitted values) ─
    last_historical_date = df["ds"].max()
    future_only = forecast_df[forecast_df["ds"] > last_historical_date].copy()

    # ── 8. Format output for TradingView Lightweight Charts ───────────────
    # Convert back to Unix timestamps (seconds) matching OHLC format
    result = []
    for _, row in future_only.iterrows():
        result.append({
            "time":        int(row["ds"].timestamp()),
            "yhat":        round(float(row["yhat"]),       2),
            "yhat_lower":  round(float(row["yhat_lower"]), 2),
            "yhat_upper":  round(float(row["yhat_upper"]), 2),
        })

    return {
        "coin_id":       coin_id,
        "forecast_days": FORECAST_DAYS,
        "model":         "facebook_prophet",
        "forecast":      result,
    }


# ── Entry Point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python prophet_forecast.py <coin_id> [days]"}))
        sys.exit(1)

    coin_id = sys.argv[1]
    days    = int(sys.argv[2]) if len(sys.argv) > 2 else HISTORY_DAYS

    try:
        output = run_forecast(coin_id, days)
        # Only print JSON to stdout — Node.js reads this
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
