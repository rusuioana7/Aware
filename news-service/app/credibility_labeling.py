def label_from_score(score: int) -> str:
    if score >= 80:
        return "high"
    elif score >= 50:
        return "medium"
    return "low"

def compute_score_fields(article: dict, credibility_map: dict, assess_grammar, is_clickbait, is_ad_content, get_domain) -> dict:
    score = 0
    domain = get_domain(article.get("url", ""))
    trust = credibility_map.get(domain, "unrated")

    if trust == "high":
        score += 40
    elif trust == "medium":
        score += 20

    if assess_grammar(article.get("content", "")):
        score += 15

    title = article.get("title", "")
    content = article.get("content", "")
    ad = is_ad_content(title, content)
    clickbait = is_clickbait(title)

    if not clickbait:
        score += 10
    if not ad:
        score += 5
    else:
        score -= 10

    if article.get("author"):
        score += 5
    if article.get("image"):
        score += 5
    if article.get("description"):
        score += 5
    if len(content) > 500:
        score += 10

    final_score = max(0, min(score, 100))
    return {
        "credibility_score": final_score,
        "credibility_label": label_from_score(final_score),
        "is_clickbait": clickbait,
        "is_ad": ad
    }
