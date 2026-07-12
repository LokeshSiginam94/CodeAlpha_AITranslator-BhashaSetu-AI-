import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/history?limit=50`);
        if (!res.ok) {
          throw new Error("Failed to fetch history");
        }
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        setError("Unable to load history right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (item.text || "").toLowerCase().includes(term) ||
      (item.translated || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              History
            </h1>
            <p className="text-xs text-slate-400">
              Review, search and reuse your past translations stored by BhashaSetu AI.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="bg-slate-900 border border-slate-700 rounded-full px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search in text or translation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <p className="text-xs text-slate-400">Loading history...</p>
        ) : error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-xs text-slate-400">
            No history items found. Try translating some text first.
          </p>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[11px] text-slate-400 mb-3">
              {filteredItems.length} item(s) shown
            </p>
            <ul className="space-y-3 max-h-[480px] overflow-y-auto">
              {filteredItems.map((item, index) => {
                const created = item.created_at || "";
                const source = item.source || "auto";
                const target = item.target || "-";
                return (
                  <li
                    key={`${created}-${index}`}
                    className="border-b border-slate-800/70 pb-3 last:border-b-0"
                  >
                    <p className="text-xs text-slate-300 mb-1">
                      {item.text}
                    </p>
                    <p className="text-[11px] text-slate-400 mb-1">
                      {item.translated}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        {source} → {target}
                      </span>
                      <span>{created}</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-2 py-1 rounded-full border border-slate-700 hover:border-slate-500 text-[10px]"
                        onClick={() =>
                          navigator.clipboard
                            .writeText(item.translated || "")
                            .catch(() => {})
                        }
                      >
                        Copy translation
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}