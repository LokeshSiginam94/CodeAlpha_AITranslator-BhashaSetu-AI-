import { useState } from "react";
import Translator from "./pages/Translator";
import Dashboard from "./pages/Dashboard";

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold">
              BS
            </span>
            <span className="text-lg font-semibold tracking-tight">
              BhashaSetu AI
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <button
              className={`hover:text-white ${
                activePage === "home" ? "text-white" : ""
              }`}
              onClick={() => setActivePage("home")}
            >
              Home
            </button>
            <button
              className={`hover:text-white ${
                activePage === "translator" ? "text-white" : ""
              }`}
              onClick={() => setActivePage("translator")}
            >
              Translator
            </button>
            <button
              className={`hover:text-white ${
                activePage === "dashboard" ? "text-white" : ""
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`hover:text-white ${
                activePage === "history" ? "text-white" : ""
              }`}
              onClick={() => setActivePage("history")}
            >
              History
            </button>
          </nav>
          <button className="text-sm font-medium px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500">
            Login
          </button>
        </div>
      </header>

      {activePage === "home" && (
        <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold mb-4">
              AI Translation Platform
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-5">
              Breaking language barriers
              <span className="block text-blue-400">
                with intelligent translation.
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 mb-8 max-w-xl">
              BhashaSetu AI is a multilingual communication tool that helps
              students, travelers, professionals and businesses translate text
              instantly with AI, while tracking usage, history and productivity.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                className="px-5 py-2.5 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-500"
                onClick={() => setActivePage("translator")}
              >
                Start Translating
              </button>
              <button
                className="px-5 py-2.5 rounded-full text-sm font-medium border border-slate-700 text-slate-100 hover:border-slate-500"
                onClick={() => setActivePage("dashboard")}
              >
                View Dashboard
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Supports 100+ languages • Live translation history • Built for
              CodeAlpha AI Internship
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 shadow-lg shadow-slate-950/40">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-slate-400">Today&apos;s usage</p>
                <p className="text-lg font-semibold">1,248 words</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Most used language</span>
                <span>Translations today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-100">
                  English → Hindi
                </span>
                <span className="font-semibold text-blue-400">37</span>
              </div>
            </div>

            <div className="h-32 rounded-xl bg-gradient-to-tr from-blue-600/40 via-violet-500/30 to-emerald-500/20 flex items-center justify-center text-xs text-slate-100">
              Translation analytics preview (Dashboard coming soon)
            </div>
          </section>
        </main>
      )}

      {activePage === "translator" && <Translator />}

      {activePage === "dashboard" && <Dashboard />}

      {activePage === "history" && (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-xl font-semibold tracking-tight mb-2">
              History (coming soon)
            </h1>
            <p className="text-xs text-slate-400">
              This page will later show searchable, filterable translation
              history from MongoDB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;