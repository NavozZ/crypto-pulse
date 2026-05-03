"""
app.py
────────────────────────────────────────────────────────────
CryptoPulse AI Engine — Flask HTTP API
PUSL3190 | Plymouth Index: 10953298

Exposes Prophet forecast and VADER sentiment as HTTP endpoints
so the Node.js server can call them via fetch instead of child_process.

Routes:
  GET  /health                    — health check
  GET  /forecast/<coin_id>        — Prophet 14-day forecast
  GET  /sentiment/<coin_id>       — VADER sentiment score
"""

import os
import logging
from flask import Flask, jsonify, request
from prophet_forecast import run_forecast
from vader_sentiment import run_sentiment

logging.disable(logging.CRITICAL)

app = Flask(__name__)

ALLOWED_COINS = {"bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"}

# ── Health check ───────────────────────────────────────────────────────────
@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "CryptoPulse AI Engine"})

# ── Prophet Forecast ───────────────────────────────────────────────────────
@app.route("/forecast/<coin_id>")
def forecast(coin_id):
    if coin_id not in ALLOWED_COINS:
        return jsonify({"error": "Invalid coin ID"}), 400

    days = request.args.get("days", 90, type=int)

    try:
        result = run_forecast(coin_id, days)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── VADER Sentiment ────────────────────────────────────────────────────────
@app.route("/sentiment/<coin_id>")
def sentiment(coin_id):
    if coin_id not in ALLOWED_COINS:
        return jsonify({"error": "Invalid coin ID"}), 400

    try:
        result = run_sentiment(coin_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Entry point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
