import os
from google.cloud import translate_v3 as translate


def get_translate_client():
  """
  Create and return a Google Cloud Translation client.
  Requires GOOGLE_APPLICATION_CREDENTIALS to be set to a JSON key file.
  """
  return translate.TranslationServiceClient()


def translate_text(text: str, source: str, target: str):
  """
  Call Google Cloud Translation API to translate the given text.
  """
  project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
  location = "global"

  if not project_id:
    raise RuntimeError("GOOGLE_CLOUD_PROJECT environment variable is not set")

  parent = f"projects/{project_id}/locations/{location}"

  client = get_translate_client()

  # If source is "auto", omit source_language_code so API auto-detects.
  request = {
    "parent": parent,
    "contents": [text],
    "target_language_code": target,
  }

  if source != "auto":
    request["source_language_code"] = source

  response = client.translate_text(request=request)

  translations = response.translations
  translated_text = translations[0].translated_text if translations else ""

  detected_language = None
  if source == "auto" and response.glossary_translations == []:
    # v3 response may include detected language codes
    detected_language = response.contains_translation_glossary_config.language_code if hasattr(
      response, "contains_translation_glossary_config"
    ) else None

  return {
    "translated_text": translated_text,
    "detected_language": detected_language,
  }