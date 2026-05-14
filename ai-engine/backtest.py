"""
backtest.py
────────────────────────────────────────────────────────────────────────────
CryptoPulse AI Engine — Prophet Model Backtesting & Evaluation
PUSL3190 | Plymouth Index: 10953298

Implements the evaluation strategy committed to in PID Section 5.4:
  "The Prophet model will be evaluated using MAE and RMSE. A Backtesting
   strategy will be used, where the model predicts the last 30 days of
   known historical data to compare predicted vs actual prices."

Usage:
    python backtest.py bitcoin
    python backtest.py ethereum 60
"""

import sys, json, os, time, logging
import numpy as np
import pandas as pd
import requests
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from prophet import Prophet

logging.getLogger("prophet").setLevel(logging.ERROR)
logging.getLogger("cmdstanpy").setLevel(logging.ERROR)

HISTORY_DAYS = 180
HOLDOUT_DAYS = 30
OUTPUT_DIR   = os.path.dirname(os.path.abspath(__file__))


# ── Fetch historical OHLC data from backend API ──────────────────────────
def fetch_daily_prices(coin_id: str, days: int) -> list:
    """
    Fetch historical OHLC data from CryptoPulse backend API.
    Converts OHLC candles to close-price-only format for Prophet.
    Falls back to synthetic data generation if API fails.
    """
    from data_fetcher import fetch_ohlc
    
    try:
        ohlc_data = fetch_ohlc(coin_id, days)
        if not ohlc_data:
            return []
        
        # Convert OHLC to close-price-only format
        result = []
        seen = set()
        for candle in ohlc_data:
            ts = candle.get("time")
            if ts and ts not in seen:
                seen.add(ts)
                result.append({
                    "time": ts,
                    "close": float(candle.get("close", 0))
                })
        
        return sorted(result, key=lambda x: x["time"])
    
    except Exception as e:
        print(f"⚠️  Failed to fetch historical data: {str(e)}", file=sys.stderr)
        return []


# ── Metrics ────────────────────────────────────────────────────────────────
def mae(a, p):  return float(np.mean(np.abs(a - p)))
def rmse(a, p): return float(np.sqrt(np.mean((a - p) ** 2)))
def mape(a, p):
    mask = a != 0
    return float(np.mean(np.abs((a[mask] - p[mask]) / a[mask])) * 100)


# ── Plot ───────────────────────────────────────────────────────────────────
def save_plot(train_df, actual_df, forecast_df, coin_id, metrics):
    fig, ax = plt.subplots(figsize=(14, 6))
    fig.patch.set_facecolor("#0a001a")
    ax.set_facecolor("#0a001a")

    ax.plot(train_df["ds"], train_df["y"],
            color="#4a4a6a", linewidth=1.2, label="Training Data", alpha=0.7)
    ax.plot(actual_df["ds"], actual_df["y"],
            color="#4ade80", linewidth=2, label="Actual Price (Holdout)", zorder=5)

    future_fc = forecast_df[forecast_df["ds"].isin(actual_df["ds"])]
    ax.plot(future_fc["ds"], future_fc["yhat"],
            color="#a855f7", linewidth=2, linestyle="--", label="Prophet Forecast", zorder=4)
    ax.fill_between(future_fc["ds"], future_fc["yhat_lower"], future_fc["yhat_upper"],
                    alpha=0.15, color="#a855f7", label="80% Confidence Interval")
    ax.axvline(actual_df["ds"].min(), color="#facc15", linewidth=1.5,
               linestyle=":", alpha=0.8, label="Train/Test Split")

    ax.set_title(
        f"CryptoPulse Prophet Backtest — {coin_id.upper()}\n"
        f"MAE: ${metrics['mae_usd']:,.0f}  |  RMSE: ${metrics['rmse_usd']:,.0f}  |  MAPE: {metrics['mape_pct']:.2f}%",
        color="white", fontsize=13, pad=15)
    ax.set_xlabel("Date", color="#888888")
    ax.set_ylabel("Price (USD)", color="#888888")
    ax.tick_params(colors="#888888")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    ax.xaxis.set_major_locator(mdates.MonthLocator())
    plt.setp(ax.xaxis.get_majorticklabels(), rotation=30, ha="right")
    for spine in ax.spines.values():
        spine.set_edgecolor("#222222")
    ax.legend(facecolor="#0d0020", edgecolor="#333333", labelcolor="white", fontsize=9)
    fig.tight_layout()

    path = os.path.join(OUTPUT_DIR, f"backtest_{coin_id}.png")
    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close()
    return path


# ── Main ───────────────────────────────────────────────────────────────────
def run_backtest(coin_id: str, holdout_days: int = HOLDOUT_DAYS) -> dict:
    print(f"\n📊 Running Prophet backtest for {coin_id.upper()}...")
    print(f"   Fetching {HISTORY_DAYS} days of daily price data from CryptoPulse backend...")

    ohlc = fetch_daily_prices(coin_id, HISTORY_DAYS)

    if not ohlc:
        raise ValueError("Failed to fetch data from backend API — check internet connection")
    if len(ohlc) < holdout_days + 30:
        raise ValueError(f"Not enough data: got {len(ohlc)} points, need {holdout_days + 30}+")

    print(f"   Got {len(ohlc)} daily data points ✅")

    df = pd.DataFrame(ohlc)
    df["ds"] = pd.to_datetime(df["time"], unit="s")
    df["y"]  = df["close"].astype(float)
    df = df[["ds", "y"]].sort_values("ds").reset_index(drop=True)

    # Train / test split
    split_idx = len(df) - holdout_days
    train_df  = df.iloc[:split_idx].copy()
    actual_df = df.iloc[split_idx:].copy()

    print(f"   Train: {train_df['ds'].min().date()} → {train_df['ds'].max().date()} ({len(train_df)} pts)")
    print(f"   Test:  {actual_df['ds'].min().date()} → {actual_df['ds'].max().date()} ({len(actual_df)} pts)")
    print(f"\n   Fitting Prophet model...")

    model = Prophet(
        changepoint_prior_scale = 0.15,
        seasonality_prior_scale = 10.0,
        seasonality_mode        = "multiplicative",
        weekly_seasonality      = True,
        daily_seasonality       = False,
        yearly_seasonality      = False,
        interval_width          = 0.80,
    )
    model.add_seasonality(name="crypto_cycle", period=3.5, fourier_order=3)
    model.fit(train_df)

    future      = model.make_future_dataframe(periods=holdout_days, freq="D")
    forecast_df = model.predict(future)

    predicted = forecast_df[forecast_df["ds"].isin(actual_df["ds"])]["yhat"].values[:len(actual_df)]
    actual    = actual_df["y"].values[:len(predicted)]

    mae_val  = mae(actual, predicted)
    rmse_val = rmse(actual, predicted)
    mape_val = mape(actual, predicted)
    mean_p   = float(np.mean(actual))

    metrics = {
        "coin_id":          coin_id,
        "holdout_days":     holdout_days,
        "train_points":     len(train_df),
        "test_points":      len(actual_df),
        "train_start":      str(train_df["ds"].min().date()),
        "train_end":        str(train_df["ds"].max().date()),
        "test_start":       str(actual_df["ds"].min().date()),
        "test_end":         str(actual_df["ds"].max().date()),
        "mean_actual_usd":  round(mean_p,   2),
        "mae_usd":          round(mae_val,  2),
        "rmse_usd":         round(rmse_val, 2),
        "mape_pct":         round(mape_val, 4),
        "relative_mae_pct": round((mae_val / mean_p) * 100, 2),
    }

    if   mape_val < 5:  grade = "Excellent  (< 5% error)"
    elif mape_val < 10: grade = "Good       (< 10% error)"
    elif mape_val < 20: grade = "Acceptable (< 20% error — typical for crypto)"
    else:               grade = "High error (crypto volatility exceeded model range)"
    metrics["grade"] = grade

    print(f"\n{'='*55}")
    print(f"  BACKTEST RESULTS — {coin_id.upper()}")
    print(f"{'='*55}")
    print(f"  Mean Actual Price : ${mean_p:>12,.2f}")
    print(f"  MAE               : ${mae_val:>12,.2f}  (avg error per day)")
    print(f"  RMSE              : ${rmse_val:>12,.2f}  (penalises large errors)")
    print(f"  MAPE              : {mape_val:>11.2f}%  (% error vs actual)")
    print(f"  Relative MAE      : {metrics['relative_mae_pct']:>11.2f}%  (MAE / mean price)")
    print(f"{'='*55}")
    print(f"\n  Grade: {grade}\n")

    # Save JSON
    json_path = os.path.join(OUTPUT_DIR, f"backtest_{coin_id}.json")
    with open(json_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"  📄 Results saved → {json_path}")

    # Save chart
    plot_path = save_plot(train_df, actual_df, forecast_df, coin_id, metrics)
    print(f"  📈 Chart saved   → {plot_path}\n")

    return metrics


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python backtest.py <coin_id> [holdout_days]")
        sys.exit(1)

    coin_id      = sys.argv[1]
    holdout_days = int(sys.argv[2]) if len(sys.argv) > 2 else HOLDOUT_DAYS

    try:
        results = run_backtest(coin_id, holdout_days)
        print(json.dumps({
            "mae_usd":          results["mae_usd"],
            "rmse_usd":         results["rmse_usd"],
            "mape_pct":         results["mape_pct"],
            "relative_mae_pct": results["relative_mae_pct"],
            "grade":            results["grade"],
        }))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
