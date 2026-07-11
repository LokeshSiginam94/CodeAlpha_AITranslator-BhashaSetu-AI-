from pymongo import MongoClient

MONGODB_URI = "mongodb+srv://lokeshsiginam199_db_user:Lokesh%402004@aitranslator-bhashasetu.mqkptrn.mongodb.net/?retryWrites=true&w=majority&appName=AITranslator-BhashaSetu-AI"

client = MongoClient(MONGODB_URI)
db = client["AITranslator"]  # Replace with your database name if different

def get_db():
    return db