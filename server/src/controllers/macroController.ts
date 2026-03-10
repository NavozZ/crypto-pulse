import { Request, Response } from "express";

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";
const FRED_KEY  = process.env.FRED_API_KEY || "";

// ── Cache (1 hour TTL — macro data changes slowly) ─────────────────────────
interface CacheEntry { data: unknown; expiry: number; }
const cache = new Map<string, CacheEntry>();
const getFromCache = (key: string) => {
  const e = cache.get(key);
  if (!e || Date.now() > e.expiry) { cache.delete(key); return null; }
  return e.data;
};
const setCache = (key: string, data: unknown) =>
  cache.set(key, { data, expiry: Date.now() + 60 * 60 * 1000 }); // 1hr TTL

// ── FRED Series IDs ────────────────────────────────────────────────────────
// CPIAUCSL  — Consumer Price Index (All Urban, All Items) — monthly
// FEDFUNDS  — Federal Funds Effective Rate — monthly
// DTWEXBGS  — US Dollar Index (DXY trade-weighted) — daily
// UNRATE    — US Unemployment Rate — monthly
const INDICATORS: Record<string, { series: string; label: string; unit: string; freq: string }> = {
  cpi:          { series: "CPIAUCSL", label: "CPI (Consumer Price Index)", unit: "Index",   freq: "m" },
  fed_rate:     { series: "FEDFUNDS", label: "Fed Funds Rate",             unit: "%",        freq: "m" },
  dxy:          { series: "DTWEXBGS", label: "US Dollar Index (DXY)",      unit: "Index",   freq: "d" },
  unemployment: { series: "UNRATE",   label: "US Unemployment Rate",       unit: "%",        freq: "m" },
};

// ── Helper: fetch one FRED series ─────────────────────────────────────────
const fetchSeries = async (seriesId: string, limit = 60) => {
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
  const res  = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`FRED API error ${res.status} for ${seriesId}`);
  const json = await res.json() as { observations: { date: string; value: string }[] };

  // Transform → { date, value } array, filter out missing values (".")
  return json.observations
    .filter(o => o.value !== ".")
    .map(o => ({
      date:  o.date,
      value: parseFloat(o.value),
      // Also provide as Unix timestamp for chart overlay
      time:  Math.floor(new Date(o.date).getTime() / 1000),
    }))
    .reverse(); // oldest first for charts
};

// ── GET /api/macro/indicators ──────────────────────────────────────────────
// Returns all 4 indicators in one call for the macro dashboard
export const getAllIndicators = async (req: Request, res: Response) => {
  const cacheKey = "macro:all";
  const cached   = getFromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const [cpi, fedRate, dxy, unemployment] = await Promise.all([
      fetchSeries("CPIAUCSL", 36),   // 3 years monthly
      fetchSeries("FEDFUNDS",  36),
      fetchSeries("DTWEXBGS",  90),  // 90 days for DXY
      fetchSeries("UNRATE",    36),
    ]);

    // Latest values for summary cards
    const latest = {
      cpi:          { value: cpi.at(-1)?.value,          prev: cpi.at(-2)?.value          },
      fed_rate:     { value: fedRate.at(-1)?.value,       prev: fedRate.at(-2)?.value       },
      dxy:          { value: dxy.at(-1)?.value,           prev: dxy.at(-2)?.value           },
      unemployment: { value: unemployment.at(-1)?.value,  prev: unemployment.at(-2)?.value  },
    };

    const result = {
      indicators: { cpi, fed_rate: fedRate, dxy, unemployment },
      latest,
      meta:        INDICATORS,
      updated_at:  new Date().toISOString(),
    };

    setCache(cacheKey, result);
    return res.json(result);

  } catch (error) {
    console.error("❌ FRED macro error:", (error as Error).message);
    return res.status(500).json({
      message: "Failed to fetch macro data",
      error:   (error as Error).message,
    });
  }
};

// ── GET /api/macro/:indicator ──────────────────────────────────────────────
// Returns a single indicator — used for chart overlay on price chart
export const getSingleIndicator = async (req: Request, res: Response) => {
  const { indicator } = req.params;

  if (!INDICATORS[indicator]) {
    return res.status(400).json({
      message: `Invalid indicator. Valid options: ${Object.keys(INDICATORS).join(", ")}`,
    });
  }

  const cacheKey = `macro:${indicator}`;
  const cached   = getFromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const { series, label, unit } = INDICATORS[indicator];
    const data = await fetchSeries(series, 60);

    const result = { indicator, label, unit, data };
    setCache(cacheKey, result);
    return res.json(result);

  } catch (error) {
    console.error("❌ FRED indicator error:", (error as Error).message);
    return res.status(500).json({ message: "Failed to fetch indicator", error: (error as Error).message });
  }
};
