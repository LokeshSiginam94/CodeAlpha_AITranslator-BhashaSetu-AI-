import { useState } from "react";
import { translateText } from "../services/api";

const languages = [
  { code: "auto", name: "Auto Detect" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "te", name: "Telugu" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
];

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function countChars(text) {
  return text.length;
}

function estimateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = countWords(text);
  const minutes = words / wordsPerMinute;
  if (!words) return "0 min";
  if (minutes < 1) return "< 1 min";
  return `${minutes.toFixed(1)} min`;
}

function formatTimestamp(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Translator() {
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const words = countWords(inputText);
  const chars = countChars(inputText);
  const readingTime = estimateReadingTime(inputText);

  const handleSwapLanguages = () => {
    if (sourceLang === "auto") return;
    const prevSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(prevSource);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleTranslateClick = async () => {
    if (!inputText) return;
    setIsTranslating(true);
    setError("");

    try {
      const result = await translateText({
        text: inputText,
        source: sourceLang,
        target: targetLang,
      });

      const translated = result.translated || "";
      setOutputText(translated);

      const now = new Date();
      const entry = {
        id: now.getTime(),
        text: inputText,
        translated,
        source: sourceLang,
        target: targetLang,
        timestamp: now,
      };

      setHistory((prev) => [entry, ...prev].slice(0, 10)); // keep latest 10
    } catch (err) {
      setError("Unable to translate right now. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).catch(() => {});
  };

  const handleSpeak = () => {
    const textToSpeak = outputText || inputText;
    if (!textToSpeak) return;

    if (!("speechSynthesis" in window)) {
      alert("Speech is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (targetLang === "hi") utterance.lang = "hi-IN";
    else if (targetLang === "te") utterance.lang = "te-IN";
    else if (targetLang === "fr") utterance.lang = "fr-FR";
    else if (targetLang === "es") utterance.lang = "es-ES";
    else utterance.lang = "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleHistoryClick = (entry) => {
    setInputText(entry.text);
    setOutputText(entry.translated);
    setSourceLang(entry.source);
    setTargetLang(entry.target);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Translator
          </h1>
          <p className="text-xs text-slate-400">
            Type or paste your text, choose languages, and let BhashaSetu AI handle the translation.
          </p>
        </header>

        <div className="grid lg:grid-cols-[3fr,2fr] gap-6">
          {/* Left: input + language controls */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">From</label>
                  <select
                    className="bg-slate-900 border border-slate-700 text-xs rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSwapLanguages}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700"
                >
                  Swap
                </button>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">To</label>
                  <select
                    className="bg-slate-900 border border-slate-700 text-xs rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    {languages
                      .filter((lang) => lang.code !== "auto")
                      .map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex flex-col items-end">
                <span>Words: {words}</span>
                <span>Characters: {chars}</span>
                <span>Estimated reading: {readingTime}</span>
              </div>
            </div>

            <textarea
              className="w-full h-40 md:h-52 resize-none rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Type or paste text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleTranslateClick}
                className="px-5 py-2.5 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
                disabled={isTranslating || !inputText}
              >
                {isTranslating ? "Translating..." : "Translate"}
              </button>

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={handleSpeak}
                  className="px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500"
                >
                  Speak
                </button>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500">
                  Favorite
                </button>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500">
                  Download
                </button>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500">
                  Share
                </button>
              </div>
            </div>
          </section>

          {/* Right: output + history */}
          <section className="space-y-4">
            {/* Output + confidence */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Translation</p>
                  <p className="text-sm font-medium">
                    {sourceLang === "auto" ? "Detected → " : ""}
                    {languages.find((l) => l.code === targetLang)?.name || "Target"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-[11px] text-slate-400 text-right">
                    <p>Confidence</p>
                    <p className="text-emerald-400 font-semibold">92%</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-sm text-slate-100">
                {outputText ? (
                  <p className="whitespace-pre-wrap">{outputText}</p>
                ) : (
                  <p className="text-slate-500 text-xs">
                    Translation will appear here. Click &quot;Translate&quot; after entering your text.
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-60"
                  disabled={!outputText}
                >
                  Copy translation
                </button>
              </div>
            </div>

            {/* History panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-300">
                  Recent translations
                </p>
                <p className="text-[11px] text-slate-500">
                  {history.length} items
                </p>
              </div>

              {history.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  No translations yet. Your recent activity will appear here.
                </p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {history.map((entry) => {
                    const srcName =
                      languages.find((l) => l.code === entry.source)?.name ||
                      entry.source;
                    const tgtName =
                      languages.find((l) => l.code === entry.target)?.name ||
                      entry.target;

                    return (
                      <li
                        key={entry.id}
                        className="flex items-start justify-between gap-3 text-[11px] text-slate-300 border-b border-slate-800/70 pb-2 last:border-b-0"
                      >
                        <button
                          className="text-left flex-1 hover:text-slate-100"
                          onClick={() => handleHistoryClick(entry)}
                        >
                          <p className="truncate">
                            {entry.text}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {srcName} → {tgtName} • {formatTimestamp(entry.timestamp)}
                          </p>
                        </button>
                        <button
                          className="px-2 py-1 rounded-full border border-slate-700 hover:border-slate-500 text-[10px]"
                          onClick={() => navigator.clipboard.writeText(entry.translated).catch(() => {})}
                        >
                          Copy
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}