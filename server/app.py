from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.db import get_db

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
    Translation endpoint (currently mock text) that also saves history to MongoDB.
    """
    data = request.get_json() or {}
    text = data.get("text", "")
    source = data.get("source", "auto")
    target = data.get("target", "hi")

    if not text:
        return jsonify({"error": "text is required"}), 400

    translated_text = f"[backend mock translation {source}->{target}] {text}"

    doc = {
        "text": text,
        "translated": translated_text,
        "source": source,
        "target": target,
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
            "confidence": 0.92,
        }
    ), 200


@app.route("/analytics", methods=["GET"])
def analytics():
    """
    Basic usage analytics based on translations collection.
    Returns totals and today's stats.
    """
    now = datetime.now(timezone.utc)
    start_of_day = datetime(
        year=now.year,
        month=now.month,
        day=now.day,
        tzinfo=timezone.utc,
    )

    # total translations
    total_translations = translations_collection.count_documents({})

    # translations today
    translations_today = translations_collection.count_documents(
        {"created_at": {"$gte": start_of_day}}
    )

    # most used target language
    pipeline = [
        {"$group": {"_id": "$target", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1},
    ]
    most_used_target_result = list(translations_collection.aggregate(pipeline))
    most_used_target = (
        most_used_target_result[0]["_id"]
        if most_used_target_result
        else None
    )

    # approximate words today (split by spaces)
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)