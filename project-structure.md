# CryptoPulse — Project Structure & GitHub Branch Management
## PUSL3190 Computing Project | Plymouth Index: 10953298

---

## 1. Full Project Structure

```
crypto-pulse/
│
├── client/                          # React 19 + TypeScript Frontend
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── Logo.png
│   │   │   ├── hero.png
│   │   │   └── bgvideo.mp4           # 35MB — excluded from repo, add manually
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # Shared UI components
│   │   │   │   ├── Navigation.jsx    ✅ DONE
│   │   │   │   ├── Hero.jsx          ✅ DONE
│   │   │   │   ├── features.jsx      ✅ DONE
│   │   │   │   ├── liveprices.jsx    ✅ DONE (mock → CoinGecko next)
│   │   │   │   └── button.jsx        ✅ DONE
│   │   │   │
│   │   │   └── dashboard/            # Dashboard-specific components
│   │   │       ├── PriceChart.jsx    ✅ DONE (TradingView + Prophet overlay)
│   │   │       ├── AssetSidebar.jsx  ✅ DONE
│   │   │       ├── StatsPanel.jsx    ✅ DONE
│   │   │       ├── SentimentGauge.jsx ✅ DONE (SVG gauge, VADER-ready)
│   │   │       ├── MacroDashboard.jsx ⬜ TODO (FRED API integration)
│   │   │       └── ForecastPanel.jsx  ⬜ TODO (Prophet results display)
│   │   │
│   │   ├── layouts/
│   │   │   └── root-layout.page.jsx  ✅ DONE
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          ✅ DONE
│   │   │   ├── Login.jsx             ✅ DONE
│   │   │   ├── Register.jsx          ✅ DONE
│   │   │   ├── Dashboard.jsx         ✅ DONE
│   │   │   └── MacroPage.jsx         ⬜ TODO (dedicated macro screen)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useMarketData.js      ⬜ TODO (abstract CoinGecko calls)
│   │   │   └── useSentiment.js       ⬜ TODO (abstract VADER calls)
│   │   │
│   │   ├── lib/
│   │   │   └── utils.js              ✅ DONE
│   │   │
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx                  ✅ DONE (with PrivateRoute guard)
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── jsconfig.json
│   ├── components.json
│   └── package.json
│
├── server/                           # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 ✅ DONE (MongoDB Atlas)
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts     ✅ DONE (BCrypt + JWT)
│   │   │   ├── marketController.ts   ✅ DONE (CoinGecko OHLC + stats)
│   │   │   ├── forecastController.ts ⬜ TODO (trigger Python Prophet)
│   │   │   ├── sentimentController.ts ⬜ TODO (trigger Python VADER)
│   │   │   └── macroController.ts    ⬜ TODO (FRED API integration)
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts     ✅ DONE (JWT protect)
│   │   │
│   │   ├── models/
│   │   │   └── User.ts               ✅ DONE (username, email, watchlist)
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         ✅ DONE
│   │   │   ├── marketRoutes.ts       ✅ DONE
│   │   │   ├── forecastRoutes.ts     ⬜ TODO
│   │   │   ├── sentimentRoutes.ts    ⬜ TODO
│   │   │   └── macroRoutes.ts        ⬜ TODO
│   │   │
│   │   └── utils/
│   │       └── generateToken.ts      ✅ DONE
│   │
│   ├── src/index.ts                  ✅ DONE (registers all routes)
│   ├── tsconfig.json
│   └── package.json
│
├── ai-engine/                        # Python ML Engine ⬜ ENTIRE FOLDER TODO
│   ├── prophet_forecast.py           # Facebook Prophet time-series model
│   ├── vader_sentiment.py            # VADER social media analyser
│   ├── data_fetcher.py               # Shared CoinGecko + social data fetch
│   ├── requirements.txt              # prophet, vaderSentiment, pandas, numpy
│   └── README.md
│
├── .gitignore
├── README.md
└── package.json                      # (optional root workspace config)
```

---

## 2. GitHub Branch Management Strategy

### Branch Naming Convention
```
main                      ← Production-ready, stable code only
develop                   ← Integration branch, all features merge here first

feature/auth-module       ← Completed ✅
feature/dashboard-ui      ← Completed ✅
feature/coingecko-api     ← In progress
feature/prophet-engine    ← Next
feature/vader-sentiment   ← Next
feature/fred-macro        ← Next
feature/mobile-responsive ← Final sprint

hotfix/jwt-bug            ← Emergency fixes → merge to both main & develop
```

### Workflow (Git Flow simplified for solo project)
```
main ←──────────────────── merge when milestone is done
  ↑
develop ←─────────────────── merge when feature is tested
  ↑
feature/your-feature ──────── your daily work happens here
```

### Commands for Each Feature

**Start a new feature:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/prophet-engine
```

**Daily work:**
```bash
git add .
git commit -m "feat: add Prophet 14-day forecast to AI engine"
git push origin feature/prophet-engine
```

**Finish a feature (merge to develop):**
```bash
git checkout develop
git merge --no-ff feature/prophet-engine
git push origin develop
git branch -d feature/prophet-engine
```

**Release to main (milestone complete):**
```bash
git checkout main
git merge --no-ff develop
git tag -a v1.2.0 -m "Prophet + VADER integration complete"
git push origin main --tags
```

### Commit Message Convention (keep your markers happy)
```
feat:     new feature added
fix:      bug fix
docs:     documentation update
style:    CSS / formatting only
refactor: code restructure, no feature change
test:     adding tests
chore:    build scripts, package.json changes

Examples:
feat: integrate Facebook Prophet 14-day forecast via Node-Python bridge
fix: resolve TradingView chart TypeError on React 19 mount
docs: update README with setup instructions for AI engine
refactor: extract CoinGecko calls into useMarketData custom hook
```

### Recommended Milestones → Tags
```
v0.1.0   Auth module + landing page (done ✅)
v0.2.0   Dashboard + TradingView charts + CoinGecko live (in progress)
v0.3.0   Python Prophet forecast working end-to-end
v0.4.0   VADER sentiment gauge live
v0.5.0   FRED macroeconomic dashboard
v1.0.0   Final — mobile responsive + UAT complete
```

---

## 3. Files Still Needed (priority order)

| Priority | File | Sprint |
|----------|------|--------|
| 1 🔴 | `ai-engine/prophet_forecast.py` | Now |
| 2 🔴 | `ai-engine/vader_sentiment.py` | Now |
| 3 🔴 | `server/controllers/forecastController.ts` | Now |
| 4 🟡 | `server/controllers/sentimentController.ts` | Next |
| 5 🟡 | `server/controllers/macroController.ts` | Next |
| 6 🟡 | `client/pages/MacroPage.jsx` | Next |
| 7 🟢 | Mobile responsive pass | Final sprint |
| 8 🟢 | UAT + deployment (Render/Heroku) | Final sprint |
