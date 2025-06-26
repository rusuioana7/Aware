from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["aware_news"]
articles_col = db["articles"]


def label_from_score(score: int) -> str:
    if score >= 80:
        return "high"
    elif score >= 50:
        return "medium"
    return "low"


def update_labels():
    count = 0
    cursor = articles_col.find(
        {"credibility_score": {"$exists": True}, "credibility_label": {"$exists": False}}
    )

    for article in cursor:
        score = article["credibility_score"]
        label = label_from_score(score)

        result = articles_col.update_one(
            {"_id": article["_id"]},
            {"$set": {"credibility_label": label}}
        )

        count += result.modified_count

    print(f"✅ Updated {count} articles with credibility_label.")


if __name__ == "__main__":
    update_labels()
