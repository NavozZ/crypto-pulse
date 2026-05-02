# CryptoPulse 🔮

> **AI-Powered Cryptocurrency Market Prediction and Analysis Platform**
>
> Final Year Project — PUSL3190 | BSc(Hons) Software Engineering | Plymouth University
>
> **Student:** Herath M Theshan | **Index:** 10953298 | **Supervisor:** Ms. Sanuli Weerasinghe

---

![CryptoPulse Dashboard](client/src/assets/hero.png)

---

## 📋 Overview

CryptoPulse is a full-stack AI-powered web platform designed to support retail cryptocurrency investors in making informed, data-driven decisions. The platform consolidates three streams of market intelligence — **predictive forecasting**, **social media sentiment**, and **macroeconomic indicators** — into a single unified dashboard, eliminating the fragmented multi-platform workflow that drives emotional trading.

### Key Features

| Feature | Description |
|---|---|
| 📈 **Live Candlestick Charts** | TradingView Lightweight Charts v5 with real-time CoinGecko OHLC data |
| 🤖 **AI Forecast Overlay** | Facebook Prophet 14-day price forecast with 80% confidence intervals |
| 💬 **Sentiment Analysis** | VADER NLP scoring over Reddit social media data (94+ posts per coin) |
| 🌍 **Macro Dashboard** | FRED API — CPI, Fed Funds Rate, DXY, Unemployment indicators |
| 📊 **Technical Indicators** | RSI-14, MACD, Stochastic %K, MA50/MA200, Support & Resistance |
| 📚 **Learning Hub** | 8 structured crypto courses — Beginner (free), Intermediate/Advanced (Pro) |
| 💳 **Stripe Payments** | One-time $9.99 Pro subscription via Stripe PaymentIntents |
| 🔐 **Role-Based Access** | User / Pro / Admin roles with JWT authentication |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│         TailwindCSS · Framer Motion · Lightweight Charts     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / Axios
┌──────────────────────────▼──────────────────────────────────┐
│                  Node.js + Express API                       │
│              TypeScript · JWT · Mongoose · Stripe            │
└──────┬───────────────────┬───────────────────┬──────────────┘
       │ child_process     │ fetch             │ fetch
┌──────▼──────┐   ┌────────▼────────┐  ┌──────▼──────────────┐
│  Python AI  │   │   CoinGecko     │  │    FRED API         │
│   Engine    │   │   Public API    │  │  (Macro Indicators) │
│─────────────│   └─────────────────┘  └─────────────────────┘
│ Prophet     │
│ VADER       │   ┌─────────────────┐  ┌─────────────────────┐
│ backtest.py │   │  MongoDB Atlas  │  │   Stripe API        │
└─────────────┘   │  (User + Cache) │  │  (Payments)         │
                  └─────────────────┘  └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Component-based UI framework
- **Vite** — Build tool and dev server
- **TailwindCSS v4** — Utility-first styling
- **Framer Motion** — Animations and transitions
- **Lightweight Charts v5** — TradingView candlestick charting
- **Stripe.js + React Stripe** — Embedded payment elements
- **React Router DOM** — Client-side routing
- **Lucide React** — Icon library
- **Axios** — HTTP client

### Backend
- **Node.js v20 LTS** — Runtime environment
- **Express 5** — Web framework
- **TypeScript** — Type safety
- **Mongoose** — MongoDB ODM
- **JWT (jsonwebtoken)** — Stateless authentication
- **BCrypt** — Password hashing
- **Stripe** — Payment processing

### AI Engine (Python 3.11)
- **Facebook Prophet 1.3.0** — Time-series forecasting
- **VADER Sentiment 3.3.2** — Social media NLP
- **CmdStan 2.38.0** — Stan compiler for Prophet
- **Pandas / NumPy** — Data processing
- **Requests** — HTTP client for data fetching
- **Matplotlib** — Backtest chart generation

### Database & APIs
- **MongoDB Atlas** — Cloud database (M0 free tier)
- **CoinGecko API** — Live OHLC and price data (public, no key)
- **FRED API** — Federal Reserve macroeconomic data
- **Reddit Public JSON** — Sentiment data source (no key required)
- **Stripe** — Payment infrastructure

---

## 📁 Project Structure

```
crypto-pulse/
├── client/                          # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/                  # Images, logo
│       ├── components/
│       │   ├── dashboard/           # PriceChart, SentimentGauge, TechnicalIndicators
│       │   ├── layouts/             # RootLayout
│       │   └── ui/                  # Navigation, Hero, LivePrices, HowItWorks
│       ├── pages/
│       │   ├── learning/            # 8 JSX course guides
│       │   ├── Dashboard.jsx
│       │   ├── MacroPage.jsx
│       │   ├── LearningPage.jsx
│       │   ├── CourseViewer.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── api.js                   # Centralised API_BASE config
│       ├── RouteGuards.jsx          # PrivateRoute, AdminRoute, AlreadyAuth
│       ├── HomePage.jsx
│       └── main.jsx
│
├── server/                          # Node.js + Express API
│   └── src/
│       ├── config/db.ts             # MongoDB Atlas connection
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── marketController.ts  # CoinGecko — 5-min cache
│       │   ├── forecastController.ts # Node-Python bridge
│       │   ├── sentimentController.ts
│       │   ├── macroController.ts   # FRED API — 1-hr cache
│       │   ├── stripeController.ts
│       │   └── adminController.ts
│       ├── middleware/authMiddleware.ts
│       ├── models/User.ts           # role, subscription, stripeCustomerId
│       ├── routes/
│       └── index.ts
│
├── ai-engine/                       # Python AI engine
│   ├── prophet_forecast.py          # 14-day Prophet forecast
│   ├── vader_sentiment.py           # VADER + Reddit/Twitter
│   ├── data_fetcher.py              # CoinGecko daily price fetch
│   ├── backtest.py                  # MAE/RMSE/MAPE evaluation
│   └── requirements.txt
│
└── docs/
    └── CryptoPulse_Test_Plan.docx   # Test plan and results
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | v20 LTS | https://nodejs.org |
| Python | 3.11 | https://python.org |
| Git | Latest | https://git-scm.com |
| MongoDB Atlas | Free tier | https://cloud.mongodb.com |

### 1 — Clone the Repository

```bash
git clone https://github.com/NavozZ/crypto-pulse.git
cd crypto-pulse
```

### 2 — Server Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cryptopulse
JWT_SECRET=your_super_secret_jwt_key_here
FRED_API_KEY=your_fred_api_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
TWITTER_BEARER_TOKEN=
```

> **Get FRED API key (free):** https://fred.stlouisfed.org/docs/api/api_key.html
>
> **Get Stripe keys (test mode):** https://dashboard.stripe.com

### 3 — Client Setup

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4 — Python AI Engine Setup

```bash
cd ai-engine
pip install -r requirements.txt
```

Install CmdStan (required for Prophet — Windows only):

**Windows — run in PowerShell as Administrator:**
```powershell
# Install make and MinGW via Chocolatey
choco install make mingw -y

# Copy make alias
Copy-Item "C:\ProgramData\chocolatey\lib\make\tools\install\bin\make.exe" `
          "C:\ProgramData\mingw64\mingw64\bin\mingw32-make.exe"

# Install CmdStan with RTools
python -c "import cmdstanpy; cmdstanpy.install_cmdstan(compiler=True)"
```

**macOS / Linux:**
```bash
python -c "import cmdstanpy; cmdstanpy.install_cmdstan()"
```

Create `ai-engine/.env`:
```env
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_optional
```

### 5 — Run the Application

Open three terminals:

**Terminal 1 — Server:**
```bash
cd server && npm run dev
```

**Terminal 2 — Client:**
```bash
cd client && npm run dev
```

**Terminal 3 — Stripe Webhook (for payment testing):**
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Visit: **http://localhost:5173**

---

## 🧪 Testing the AI Engine

```bash
cd ai-engine

# Test Prophet forecast (14-day BTC forecast)
python prophet_forecast.py bitcoin

# Test VADER sentiment (Reddit posts)
python vader_sentiment.py bitcoin

# Run Prophet backtest (MAE/RMSE/MAPE evaluation)
python backtest.py bitcoin

# Test other coins
python prophet_forecast.py ethereum
python vader_sentiment.py ethereum
```

Expected Prophet output:
```json
{
  "coin_id": "bitcoin",
  "forecast_days": 14,
  "model": "facebook_prophet",
  "forecast": [
    { "time": 1773014400, "yhat": 68436.96, "yhat_lower": 67094.56, "yhat_upper": 69707.74 }
  ]
}
```

Expected VADER output:
```json
{
  "coin_id": "bitcoin",
  "compound": 0.2022,
  "label": "Bullish",
  "post_count": 94,
  "sources": ["Reddit"]
}
```

---

## 📊 Prophet Model Evaluation

Backtesting results for Bitcoin (BTC/USD) — 30-day holdout:

| Metric | Value | Classification |
|---|---|---|
| Mean Absolute Error (MAE) | $12,284.72 | Acceptable |
| Root Mean Squared Error (RMSE) | $14,648.27 | Acceptable |
| Mean Absolute Percentage Error (MAPE) | 17.88% | Acceptable (< 20%) |
| Training Points | 151 daily | Sep 2025 – Feb 2026 |
| Test Points | 30 daily | Feb – Mar 2026 |

> MAPE < 20% is considered acceptable for cryptocurrency forecasting given inherent market volatility (Taylor & Letham, 2018).

---

## 🔐 Environment Variables Reference

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `FRED_API_KEY` | Yes | FRED API key for macro data |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `TWITTER_BEARER_TOKEN` | No | X/Twitter Bearer Token (optional) |

### Client (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (pk_test_...) |

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/market/ohlc/:coinId` | JWT | Live OHLC data from CoinGecko |
| GET | `/api/forecast/:coinId` | JWT | Prophet 14-day forecast |
| GET | `/api/sentiment/:coinId` | JWT | VADER sentiment score |
| GET | `/api/macro/indicators` | JWT | All FRED indicators |
| GET | `/api/macro/:indicator` | JWT | Single FRED indicator |
| POST | `/api/stripe/create-payment-intent` | JWT | Create Stripe PaymentIntent |
| POST | `/api/stripe/webhook` | Stripe | Stripe webhook handler |
| GET | `/api/stripe/status` | JWT | Subscription status |
| GET | `/api/admin/stats` | JWT+Admin | System statistics |
| GET | `/api/admin/users` | JWT+Admin | All registered users |

---

## 💳 Stripe Test Payment

Use these test card details to test the Pro subscription:

```
Card Number:  4242 4242 4242 4242
Expiry:       12/28
CVC:          123
ZIP:          Any
```

---

## 📚 Learning Hub

| Course | Level | Access |
|---|---|---|
| Price Action & Support/Resistance | Beginner | Free |
| Fibonacci Retracement & Extension | Beginner | Free |
| RSI + MACD Combo | Beginner | Free |
| Wyckoff Method | Intermediate | Pro ($9.99) |
| Ichimoku Cloud | Intermediate | Pro ($9.99) |
| On-Chain Analysis | Intermediate | Pro ($9.99) |
| Smart Money Concepts (SMC) | Advanced | Pro ($9.99) |
| Elliott Wave Theory | Advanced | Pro ($9.99) |

---

## 👤 User Roles

| Role | Access |
|---|---|
| `user` | Dashboard, charts, free learning courses |
| `pro` | All user access + all 8 learning courses |
| `admin` | All access + admin dashboard |

**To set admin role** (MongoDB Atlas console):
```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

**To set pro subscription** (MongoDB Atlas console):
```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { subscription: "pro" } }
)
```

---

## 📄 License

This project was developed as an academic final year project at Plymouth University (PUSL3190). All rights reserved.

---

## 🙏 Acknowledgements

- **Supervisor:** Ms. Sanuli Weerasinghe — Plymouth University
- **Facebook Prophet** — Taylor & Letham (2018), Meta Platforms Inc.
- **VADER Sentiment** — Hutto & Gilbert (2014)
- **CoinGecko** — Free public cryptocurrency API
- **FRED** — Federal Reserve Bank of St. Louis
- **TradingView** — Lightweight Charts library

---

*CryptoPulse — PUSL3190 Final Year Project | Plymouth University 2026*
