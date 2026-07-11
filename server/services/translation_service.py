import os
from google.cloud import translate_v3 as translate


def get_client():
    return translate.TranslationServiceClient()


def translate_text(text: str, source: str, target: str):
    """
    Use Google Cloud Translation API v3 to translate text.
    source: language code or 'auto'
    target: language code, e.g. 'hi', 'en', 'fr'
    """
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    if not project_id:
        raise RuntimeError("GOOGLE_CLOUD_PROJECT is not set")

    parent = f"projects/{project_id}/locations/global"
    client = get_client()

    request = {
      "parent": parent,
      "contents": [text],
      "mime_type": "text/plain",
      "target_language_code": target,
    }

    if source != "auto":
        request["source_language_code"] = source

    response = client.translate_text(request=request)

    translated_text = ""
    detected_language = None

    if response.translations:
        translated_text = response.translations[0].translated_text
        # v3 returns detected language info when auto-detect used
        if source == "auto":
            detected_language = response.translations[0].detected_language_code

    return {
        "translated_text": translated_text,
        "detected_language": detected_language,
    }