import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
HF_MODEL = os.getenv("HUGGINGFACE_MODEL")
MAX_PAGES = int(os.getenv("MAX_PAGES_PER_SOURCE", "5"))
MAX_ARTICLES_PER_SOURCE = 8
DELAY = float(os.getenv("CRAWL_DELAY", "1.0"))

RSS_SOURCES = [

    # ─── Politics ───────────────────────────────────────────────────────────────────────
    {"language": "en", "country": "", "source": "Foreign Policy",
     "feedUrl": "https://foreignpolicy.com/feed/"},

    # ─── Entertainment ─────────────────────────────────────────────────────────────────
    {"language": "en", "country": "", "source": "TMZ", "feedUrl": "https://www.tmz.com/rss.xml"},
    {"language": "en", "country": "", "source": "Entertainment Tonight",
     "feedUrl": "https://www.etonline.com/news/rss"},

    # ─── Science ────────────────────────────────────────────────────────────────────────
    {"language": "en", "country": "", "source": "Science Daily",
     "feedUrl": "https://www.sciencedaily.com/rss/all.xml"},

    {"language": "en", "country": "", "source": "Nomadic Matt", "feedUrl": "https://www.nomadicmatt.com/feed/"},

    # ─── Lifestyle ───────────────────────────────────────────────────────────────────────
    {"language": "en", "country": "", "source": "Better Living",
     "feedUrl": "https://onbetterliving.com/feed/"},

    # ─── Automotive ─────────────────────────────────────────────────────────────────────
    {"language": "en", "country": "", "source": "Piston Heads",
     "feedUrl": "https://www.pistonheads.com/xml/news091.asp"},

    # ─── English General / World ─────────────────────────────────────────────────────────
    {"language": "en", "country": "", "source": "BBC News - General",
     "feedUrl": "http://feeds.bbci.co.uk/news/rss.xml"},
    {"language": "en", "country": "", "source": "BBC News - World",
     "feedUrl": "http://feeds.bbci.co.uk/news/world/rss.xml"},
    {"language": "en", "country": "", "source": "CNN - Top Stories",
     "feedUrl": "http://rss.cnn.com/rss/edition.rss"},
    {"language": "en", "country": "", "source": "CNN - World",
     "feedUrl": "http://rss.cnn.com/rss/edition_world.rss"},
    {"language": "en", "country": "", "source": "The Guardian - World News",
     "feedUrl": "https://www.theguardian.com/world/rss"},
    {"language": "en", "country": "", "source": "The Guardian - US News",
     "feedUrl": "https://www.theguardian.com/us-news/rss"},
    {"language": "en", "country": "", "source": "NYT - Top Stories",
     "feedUrl": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"},
    {"language": "en", "country": "", "source": "NYT - World",
     "feedUrl": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"},
    {"language": "en", "country": "", "source": "NYT - US",
     "feedUrl": "https://rss.nytimes.com/services/xml/rss/nyt/US.xml"},
    {"language": "en", "country": "", "source": "NPR - News",
     "feedUrl": "https://feeds.npr.org/1001/rss.xml"},
    {"language": "en", "country": "", "source": "The Verge - Main",
     "feedUrl": "https://www.theverge.com/rss/index.xml"},

    # ─── Romanian General ────────────────────────────────────────────────────────────────
    {"language": "ro", "country": "RO", "source": "Adevărul - General", "feedUrl": "https://adevarul.ro/rss"},
    {"language": "ro", "country": "RO", "source": "HotNews.ro - General",
     "feedUrl": "https://feeds.feedburner.com/hotnews/yvoq"},
    {"language": "ro", "country": "RO", "source": "Observator", "feedUrl": "https://observatornews.ro/rss/video"},
    {"language": "ro", "country": "RO", "source": "Realitatea", "feedUrl": "https://rss.realitatea.net/stiri.xml"},
    {"language": "ro", "country": "RO", "source": "Stirile Zilei",
     "feedUrl": "https://www.stiripesurse.ro/rss/stirile-zilei.xml"},

    # ─── French General ─────────────────────────────────────────────────────────────────
    {"language": "fr", "country": "FR", "source": "Le Monde - International",
     "feedUrl": "https://www.lemonde.fr/international/rss_full.xml"},
    {"language": "fr", "country": "FR", "source": "Le Monde - Une",
     "feedUrl": "https://www.lemonde.fr/en/rss/une.xml"},
    {"language": "fr", "country": "FR", "source": "Le Figaro - Actualités",
     "feedUrl": "https://www.lefigaro.fr/rss/figaro_actualites.xml"},
    {"language": "fr", "country": "FR", "source": "France 24 - Monde", "feedUrl": "https://www.france24.com/fr/rss"},
    {"language": "fr", "country": "FR", "source": "Le Parisien - Actu",
     "feedUrl": "https://www.leparisien.fr/une/rss.xml"},

    # ─── Spanish General ─────────────────────────────────────────────────────────────────
    {"language": "es", "country": "ES", "source": "El País - Portada",
     "feedUrl": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada"},
    {"language": "es", "country": "ES", "source": "El País - Internacional",
     "feedUrl": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/internacional"},
    {"language": "es", "country": "ES", "source": "ABC.es - Mundo",
     "feedUrl": "https://www.abc.es/rss/feeds/abc_Internacional.xml"},
    {"language": "es", "country": "ES", "source": "ABC.es - Economía",
     "feedUrl": "https://www.abc.es/rss/feeds/abc_Economia.xml"},
    {"language": "es", "country": "ES", "source": "ABC.es - Tecnología",
     "feedUrl": "https://www.abc.es/rss/feeds/abc_Tecnologia.xml"},
    {"language": "es", "country": "ES", "source": "ABC.es - Deportes",
     "feedUrl": "https://www.abc.es/rss/feeds/abc_Deportes.xml"},

    # ─── German General ─────────────────────────────────────────────────────────────────
    {"language": "de", "country": "DE", "source": "Der Spiegel - International (English)",
     "feedUrl": "https://www.spiegel.de/international/index.rss"},
    {"language": "de", "country": "DE", "source": "Der Spiegel - Schlagzeilen",
     "feedUrl": "https://www.spiegel.de/schlagzeilen/index.rss"},
    {"language": "de", "country": "DE", "source": "Der Spiegel - Politik",
     "feedUrl": "https://www.spiegel.de/politik/index.rss"},
    {"language": "de", "country": "DE", "source": "Der Spiegel - Wirtschaft",
     "feedUrl": "https://www.spiegel.de/wirtschaft/index.rss"},
    {"language": "de", "country": "DE", "source": "Der Spiegel - Wissenschaft",
     "feedUrl": "https://www.spiegel.de/wissenschaft/index.rss"},
    {"language": "de", "country": "DE", "source": "Der Spiegel - Kultur",
     "feedUrl": "https://www.spiegel.de/kultur/index.rss"},
    {"language": "de", "country": "DE", "source": "Die Welt - Top News",
     "feedUrl": "https://www.welt.de/feeds/topnews.rss"},
    {"language": "de", "country": "DE", "source": "Die Welt - Politik",
     "feedUrl": "https://www.welt.de/feeds/politik.rss"},
    {"language": "de", "country": "DE", "source": "Die Welt - Wirtschaft",
     "feedUrl": "https://www.welt.de/feeds/wirtschaft.rss"},
    {"language": "de", "country": "DE", "source": "Die Welt - Sport",
     "feedUrl": "https://www.welt.de/feeds/sport.rss"},
    {"language": "de", "country": "DE", "source": "Der Standard - Österreich",
     "feedUrl": "https://www.derstandard.at/rss/"},
    {"language": "de", "country": "DE", "source": "Der Standard - Politik",
     "feedUrl": "https://www.derstandard.at/rss/politik"},
    {"language": "de", "country": "DE", "source": "Der Standard - Wirtschaft",
     "feedUrl": "https://www.derstandard.at/rss/wirtschaft"},
    {"language": "de", "country": "DE", "source": "Der Standard - Wissenschaft",
     "feedUrl": "https://www.derstandard.at/rss/wissenschaft"},
    {"language": "de", "country": "DE", "source": "Der Standard - Kultur",
     "feedUrl": "https://www.derstandard.at/rss/kultur"},
]

TOPICS = ["all", "sport", "health", "economy", "tech", "climate", "politics",
          "entertainment", "science", "travel", "education", "world", "business",
          "culture", "food", "lifestyle", "automotive", "weather", "crime", "opinion"]
