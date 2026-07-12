import requests

MYMEMORY_BASE_URL = "https://api.mymemory.translated.net/get"


def translate_text(text, source="auto", target="hi"):
    if not text or not text.strip():
        raise ValueError("Text is required for translation")

    langpair = f"{source}|{target}"
    params = {
        "q": text,
        "langpair": langpair,
    }

    response = requests.get(MYMEMORY_BASE_URL, params=params, timeout=15)
    response.raise_for_status()

    data = response.json()

    if data.get("responseStatus") != 200:
        raise RuntimeError(data.get("responseDetails", "Translation failed"))

    response_data = data.get("responseData", {}) or {}
    translated_text = response_data.get("translatedText", "").strip()

    if not translated_text:
        raise RuntimeError("Empty translated text from MyMemory")

    matches = data.get("matches", []) or []

    detected_language = None
    confidence = 0.90

    if source == "auto":
        for match in matches:
            segment = (match.get("segment") or "").strip().lower()
            translation = (match.get("translation") or "").strip().lower()
            if segment and translation:
                detected_language = match.get("source")
                break

    match_score = response_data.get("match")
    if isinstance(match_score, (int, float)):
        confidence = round(float(match_score), 2)

    return {
        "translated_text": translated_text,
        "detected_language": detected_language,
        "confidence": confidence,
    }