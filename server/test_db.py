from services.db import get_db

try:
    db = get_db()

    print("=" * 50)
    print(" MongoDB Connected Successfully ")
    print("=" * 50)

    print(f"Database : {db.name}")

    collections = db.list_collection_names()

    if collections:
        print("Collections:")
        for c in collections:
            print("-", c)
    else:
        print("No collections found yet.")

except Exception as e:
    print("=" * 50)
    print("MongoDB Connection Failed")
    print("=" * 50)
    print(e)