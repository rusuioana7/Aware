import TopicTag from "../Tags/TopicTag.tsx";
import ArticleOptions from "../ArticleOptions.tsx";
import React, {useState} from "react";

const trendingArticles = [
    {
        author: 'Craig Bator',
        date: '27 Dec 2020',
        title: 'Gluten-Free Almond Cake with Berries',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Jane Doe',
        date: '15 Jan 2021',
        title: '10-Minute Healthy Breakfast Ideas',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Mark Smith',
        date: '01 Mar 2021',
        title: 'Benefits of Intermittent Fasting',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Sally Green',
        date: '10 Feb 2021',
        title: '5 Salad Recipes for Every Season',
        topic: 'Food',
        image: '/news3.jpg',
    },
    {
        author: 'Leo King',
        date: '05 Apr 2021',
        title: 'Homemade Vegan Burgers in 20 Minutes',
        topic: 'Food',
        image: '/news3.jpg',
    },
];

const Trending: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    return (
        <div style={{marginBottom: '30px'}}>
            <h2
                style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '7px',
                    color: '#000000',
                }}
            >
                Trending
            </h2>
            <div style={{height: '1px', backgroundColor: '#CCCCCC', marginBottom: '12px'}}/>

            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {trendingArticles.map((article, index) => (
                    <div
                        key={index}
                        style={{display: 'flex', gap: '10px', alignItems: 'flex-start', position: 'relative',}}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >

                        {hoveredIndex === index &&
                            <ArticleOptions position="top-right" customStyle={{marginTop: "-12px"}}/>}

                        <div style={{position: 'absolute', top: '0px', left: '80px'}}>
                            <TopicTag label={article.topic}/>
                        </div>
                        <img
                            src={article.image}
                            alt={article.title}
                            style={{width: '70px', height: '70px', objectFit: 'cover',}}
                        />
                        <div>
                            <p style={{fontSize: '15px', color: '#000000', margin: '30px 0 2px'}}>
                                {article.author} - {article.date}
                            </p>
                            <p style={{fontSize: '18px', fontWeight: 550, margin: 0, color: '#222'}}>
                                {article.title}
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Trending;
