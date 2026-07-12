from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.db import get_db
from services.translation_service import translate_text as api_translate

app = Flask(__name__)
CORS(app)

db = get_db()
translations_collection = db.get_collection("translations")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "BhashaSetu AI translator"}), 200


@app.route("/translate", methods=["POST"])
def translate():
    """
    Translation endpoint: uses MyMemory API, falls back gracefully if needed,
    and always saves history.
    """
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    source = data.get("source", "auto")
    target = data.get("target", "hi")

    if not text:
        return jsonify({"error": "text is required"}), 400

    # Enforce max 500 characters for backend
    max_chars = 500
    if len(text) > max_chars:
        text = text[:max_chars]

    translated_text = ""
    detected_language = None
    confidence = 0.90

    try:
        result = api_translate(text=text, source=source, target=target)
        translated_text = result.get("translated_text") or ""
        detected_language = result.get("detected_language")
        confidence = result.get("confidence", confidence)

        if not translated_text:
            raise RuntimeError("Empty translation from API")

    except Exception as e:
        print("MyMemory Translation error, using mock:", e)
        translated_text = f"[backend mock translation {source}->{target}] {text}"
        confidence = 0.60

    doc = {
        "text": text,
        "translated": translated_text,
        "source": source,
        "target": target,
        "detected_language": detected_language,
        "created_at": datetime.now(timezone.utc),
    }

    try:
        translations_collection.insert_one(doc)
    except Exception as e:
        print("Failed to insert translation:", e)

    return jsonify(
        {
            "text": text,
            "source": source,
            "target": target,
            "translated": translated_text,
            "detected_language": detected_language,
            "confidence": confidence,
        }
    ), 200


@app.route("/analytics", methods=["GET"])
def analytics():
    now = datetime.now(timezone.utc)
    start_of_day = datetime(
        year=now.year,
        month=now.month,
        day=now.day,
        tzinfo=timezone.utc,
    )

    total_translations = translations_collection.count_documents({})
    translations_today = translations_collection.count_documents(
        {"created_at": {"$gte": start_of_day}}
    )

    pipeline_target = [
        {"$group": {"_id": "$target", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1},
    ]
    most_used_target_result = list(translations_collection.aggregate(pipeline_target))
    most_used_target = (
        most_used_target_result[0]["_id"]
        if most_used_target_result
        else None
    )

    pipeline_words_today = [
        {"$match": {"created_at": {"$gte": start_of_day}}},
        {
            "$project": {
                "word_count": {
                    "$size": {
                        "$split": ["$text", " "]
                    }
                }
            }
        },
        {"$group": {"_id": None, "total_words": {"$sum": "$word_count"}}},
    ]
    words_today_result = list(translations_collection.aggregate(pipeline_words_today))
    words_today = (
        words_today_result[0]["total_words"]
        if words_today_result
        else 0
    )

    return jsonify(
        {
            "total_translations": int(total_translations),
            "translations_today": int(translations_today),
            "most_used_target": most_used_target,
            "words_today": int(words_today),
        }
    ), 200


@app.route("/history", methods=["GET"])
def history():
    try:
        limit_param = request.args.get("limit", "50")
        try:
            limit = max(1, min(int(limit_param), 100))
        except ValueError:
            limit = 50

        cursor = (
            translations_collection.find(
                {},
                {
                    "_id": 0,
                    "text": 1,
                    "translated": 1,
                    "source": 1,
                    "target": 1,
                    "detected_language": 1,
                    "created_at": 1,
                },
            )
            .sort("created_at", -1)
            .limit(limit)
        )

        items = []
        for doc in cursor:
            created_at = doc.get("created_at")
            if isinstance(created_at, datetime):
                created_iso = created_at.isoformat()
            else:
                created_iso = str(created_at)

            items.append(
                {
                    "text": doc.get("text", ""),
                    "translated": doc.get("translated", ""),
                    "source": doc.get("source", ""),
                    "target": doc.get("target", ""),
                    "detected_language": doc.get("detected_language"),
                    "created_at": created_iso,
                }
            )

        return jsonify({"items": items}), 200

    except Exception as e:
        return jsonify({"error": "Failed to load history", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)