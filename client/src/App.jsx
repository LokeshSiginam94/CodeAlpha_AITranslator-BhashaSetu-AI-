import { useState } from "react";
import Translator from "./pages/Translator";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

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
        </div>
      </header>

      {activePage === "home" && (
        <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
          {/* Hero */}
          <section className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold mb-4">
                AI Translation Platform
              </p>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-5">
                Breaking language barriers
                <span className="block text-blue-400">
                  with intelligent translation.
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 mb-6 max-w-xl">
                BhashaSetu AI is a multilingual communication tool that helps
                students, travelers, professionals and businesses translate text
                instantly, listen to speech, track history, and understand usage
                with analytics.
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
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
                Supports 20+ languages • History & analytics • Built for CodeAlpha AI Internship
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 shadow-lg shadow-slate-950/40 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">Today&apos;s translations</p>
                  <p className="text-lg font-semibold">Live activity preview</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>English → Hindi</span>
                  <span>English → French</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-100">
                    “I love programming.”
                  </span>
                  <span className="font-semibold text-blue-400">J&apos;adore programmer.</span>
                </div>
              </div>
              <div className="h-24 rounded-xl bg-gradient-to-tr from-blue-600/40 via-violet-500/30 to-emerald-500/20 flex items-center justify-center text-xs text-slate-100">
                Analytics and history are powered by Flask API + MongoDB Atlas.
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2">
                How it works
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-200 mb-2">
                1. Type or paste text
              </p>
              <p className="text-xs text-slate-400">
                Enter your sentence or paragraph, choose source and target languages,
                and let BhashaSetu AI prepare the request.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-200 mb-2">
                2. AI translation backend
              </p>
              <p className="text-xs text-slate-400">
                The Flask backend calls a translation API, returns the translated
                text, and stores the activity in MongoDB Atlas.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-200 mb-2">
                3. History & analytics
              </p>
              <p className="text-xs text-slate-400">
                The Dashboard and History pages give you insights into what you
                translate most, and let you reuse past translations.
              </p>
            </div>
          </section>

          {/* Key features */}
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
              Features
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-200 mb-2">
                  Smart translator
                </p>
                <p className="text-xs text-slate-400">
                  Large input/output, counters, auto-detect, swap languages,
                  copy, speak and quick history preview.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-200 mb-2">
                  History module
                </p>
                <p className="text-xs text-slate-400">
                  Searchable list of past translations backed by MongoDB Atlas,
                  with copy actions for productivity.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-200 mb-2">
                  Analytics dashboard
                </p>
                <p className="text-xs text-slate-400">
                  Shows translations today, total translations, most used target
                  and approximate words translated.
                </p>
              </div>
            </div>
          </section>

          {/* Supported languages */}
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
              Supported languages
            </p>
            <p className="text-xs text-slate-400">
              BhashaSetu AI focuses on languages widely used by students, professionals
              and travelers.
            </p>
            <div className="grid md:grid-cols-3 gap-2 text-xs text-slate-300">
              <p>English, Hindi, Telugu, Tamil, Marathi, Bengali, Gujarati, Kannada</p>
              <p>Malayalam, Punjabi, Urdu, French, Spanish, German, Italian</p>
              <p>Portuguese, Russian, Arabic, Chinese, Japanese, Korean, Turkish</p>
            </div>
          </section>

          {/* CodeAlpha note */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold text-slate-200 mb-2">
              Built for CodeAlpha AI Internship
            </p>
            <p className="text-xs text-slate-400">
              This project is structured like a product: frontend (React + Vite + Tailwind),
              backend (Flask), database (MongoDB Atlas), analytics, history and documentation,
              all under a single repository named <code>CodeAlpha_AITranslator</code>.
            </p>
          </section>
        </main>
      )}

      {activePage === "translator" && <Translator />}

      {activePage === "dashboard" && <Dashboard />}

      {activePage === "history" && <History />}
    </div>
  );
}

export default App;