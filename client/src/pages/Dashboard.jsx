import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_translations: 0,
    translations_today: 0,
    most_used_target: null,
    words_today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/analytics`);
        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError("Unable to load analytics right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const languageLabel =
    stats.most_used_target === "hi"
      ? "Hindi"
      : stats.most_used_target === "en"
      ? "English"
      : stats.most_used_target === "te"
      ? "Telugu"
      : stats.most_used_target === "fr"
      ? "French"
      : stats.most_used_target === "es"
      ? "Spanish"
      : stats.most_used_target || "N/A";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Overview of your BhashaSetu AI translation activity and usage patterns.
          </p>
        </header>

        {loading ? (
          <p className="text-xs text-slate-400">Loading analytics...</p>
        ) : error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] text-slate-400">Translations today</p>
              <p className="text-2xl font-semibold mt-2">
                {stats.translations_today}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Based on created_at timestamps (UTC)
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] text-slate-400">Total translations</p>
              <p className="text-2xl font-semibold mt-2">
                {stats.total_translations}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                All-time across this project
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] text-slate-400">Most used target</p>
              <p className="text-lg font-semibold mt-2">
                {languageLabel}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Calculated from translations collection
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[11px] text-slate-400">Words translated today</p>
              <p className="text-2xl font-semibold mt-2">
                {stats.words_today}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Approximate, based on splitting text by spaces
              </p>
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[11px] text-slate-400 mb-2">
            Activity insight (preview)
          </p>
          <p className="text-xs text-slate-300">
            This dashboard currently shows basic aggregated metrics. In the
            README, you can describe future enhancements like weekly charts,
            user-level analytics, and language usage trends.
          </p>
        </section>
      </div>
    </div>
  );
}