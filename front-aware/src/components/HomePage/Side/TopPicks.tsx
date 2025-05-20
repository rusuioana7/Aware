import TopicTag from "../../Cards/Tags/TopicTag.tsx";

const topPicksArticles = [
    {
        author: 'Amanda Lee',
        date: '08 May 2021',
        title: 'Exploring Minimalist Living Tips',
        topic: 'Lifestyle',
        image: '/news3.jpg',
    },
    {
        author: 'Tom Nash',
        date: '20 Apr 2021',
        title: 'How to Stay Focused While Working',
        topic: 'Lifestyle',
        image: '/news3.jpg',
    },
    {
        author: 'Rachel Chu',
        date: '12 Mar 2021',
        title: 'Must-Read Books for Personal Growth',
        topic: 'Lifestyle',
        image: '/news3.jpg',
    },
    {
        author: 'Kevin Hart',
        date: '03 Feb 2021',
        title: 'Meditation Techniques Backed by Science',
        topic: 'Lifestyle',
        image: '/news3.jpg',
    },
    {
        author: 'Lena Moore',
        date: '22 Jan 2021',
        title: 'Organize Your Digital Life in 2021',
        topic: 'Lifestyle',
        image: '/news3.jpg',
    },
];

const TopPicks = () => (
    <div style={{marginBottom: '30px'}}>
        <h2
            style={{
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '7px',
                color: '#000000',
            }}
        >
            Top Picks For You
        </h2>
        <div style={{height: '1px', backgroundColor: '#CCCCCC', marginBottom: '12px'}}/>

        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {topPicksArticles.map((article, index) => (
                <div
                    key={index}
                    style={{display: 'flex', gap: '10px', alignItems: 'flex-start', position: 'relative',}}
                >
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

export default TopPicks;
