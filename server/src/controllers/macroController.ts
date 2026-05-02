import { Request, Response } from "express";

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

const getFredKey = () => process.env.FRED_API_KEY || "";

interface CacheEntry { data: unknown; expiry: number; }
const cache = new Map<string, CacheEntry>();
const getFromCache = (key: string) => {
  const e = cache.get(key);
  if (!e || Date.now() > e.expiry) { cache.delete(key); return null; }
  return e.data;
};
const setCache = (key: string, data: unknown) =>
  cache.set(key, { data, expiry: Date.now() + 60 * 60 * 1000 }); // 1hr TTL


const INDICATORS: Record<string, { series: string; label: string; unit: string; freq: string }> = {
  cpi:          { series: "CPIAUCSL", label: "CPI (Consumer Price Index)", unit: "Index",   freq: "m" },
  fed_rate:     { series: "FEDFUNDS", label: "Fed Funds Rate",             unit: "%",        freq: "m" },
  dxy:          { series: "DTWEXBGS", label: "US Dollar Index (DXY)",      unit: "Index",   freq: "d" },
  unemployment: { series: "UNRATE",   label: "US Unemployment Rate",       unit: "%",        freq: "m" },
};

const fetchSeries = async (seriesId: string, limit = 60) => {
  const key = getFredKey();
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${key}&file_type=json&sort_order=desc&limit=${limit}`;
  const res  = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`FRED API error ${res.status} for ${seriesId}`);
  const json = await res.json() as { observations: { date: string; value: string }[] };

  return json.observations
    .filter(o => o.value !== ".")
    .map(o => ({
      date:  o.date,
      value: parseFloat(o.value),
      // Also provide as Unix timestamp for chart overlay
      time:  Math.floor(new Date(o.date).getTime() / 1000),
    }))
    .reverse(); 
};


// Returns all 4 indicators in one call for the macro dashboard
export const getAllIndicators = async (req: Request, res: Response) => {
  const cacheKey = "macro:all";
  const cached   = getFromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const [cpi, fedRate, dxy, unemployment] = await Promise.all([
      fetchSeries("CPIAUCSL", 36),   
      fetchSeries("FEDFUNDS",  36),
      fetchSeries("DTWEXBGS",  90),  
      fetchSeries("UNRATE",    36),
    ]);

    // Latest values for summary cards
    const last = (arr: any[]) => arr[arr.length - 1];
    const prev = (arr: any[]) => arr[arr.length - 2];

    const latest = {
      cpi:          { value: last(cpi)?.value,          prev: prev(cpi)?.value          },
      fed_rate:     { value: last(fedRate)?.value,       prev: prev(fedRate)?.value       },
      dxy:          { value: last(dxy)?.value,           prev: prev(dxy)?.value           },
      unemployment: { value: last(unemployment)?.value,  prev: prev(unemployment)?.value  },
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
