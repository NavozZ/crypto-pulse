import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";

// Path to ai-engine folder (relative to server/src/controllers/)
const AI_ENGINE_PATH = path.join(__dirname, "../../../ai-engine");
const PYTHON_SCRIPT  = path.join(AI_ENGINE_PATH, "prophet_forecast.py");

// Allowed coin IDs — prevent injection
const ALLOWED_COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano"];

// ── GET /api/forecast/:coinId ──────────────────────────────────────────────
export const getForecast = async (req: Request, res: Response) => {
  const { coinId } = req.params;
  const days = (req.query.days as string) || "90";

  if (!ALLOWED_COINS.includes(coinId)) {
    return res.status(400).json({ message: "Invalid coin ID" });
  }

  try {
    const result = await runPythonScript(PYTHON_SCRIPT, [coinId, days]);
    return res.json(result);
  } catch (error) {
    console.error("❌ Prophet forecast error:", (error as Error).message);
    return res.status(500).json({
      message: "Forecast engine error",
      error:   (error as Error).message,
    });
  }
};

// ── Node-Python Bridge ────────────────────────────────────────────────────
// Spawns Python as a child process, captures stdout JSON output
export const runPythonScript = (
  scriptPath: string,
  args: string[] = []
): Promise<unknown> => {
  return new Promise((resolve, reject) => {

    // Use "python" on Windows, "python3" on Linux/Mac
    const pythonCmd = process.platform === "win32" ? "python" : "python3";

    const child = spawn(pythonCmd, [scriptPath, ...args], {
      cwd: AI_ENGINE_PATH,
      env: { ...process.env },      // pass all env vars (includes TWITTER_BEARER_TOKEN)
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    child.on("close", (code: number) => {
      if (code !== 0 && !stdout) {
        return reject(new Error(`Python exited ${code}: ${stderr}`));
      }

      try {
        // Parse the JSON printed to stdout by the Python script
        const parsed = JSON.parse(stdout.trim());

        if (parsed.error) {
          return reject(new Error(parsed.error));
        }

        resolve(parsed);
      } catch {
        reject(new Error(`Failed to parse Python output: ${stdout}`));
      }
    });

    child.on("error", (err: Error) => {
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });

    // Timeout — kill Python after 60 seconds
    setTimeout(() => {
      child.kill();
      reject(new Error("Python script timed out after 60s"));
    }, 60000);
  });
};
