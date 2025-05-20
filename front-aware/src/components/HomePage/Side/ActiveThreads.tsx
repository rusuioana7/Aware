import TopicTag from '../../Cards/Tags/TopicTag.tsx';

const activeThreads = [
    {
        name: 'Global AI Ethics',
        lastUpdatedBy: 'Emily Zhou',
        date: '18 May 2025',
        topic: 'Tech',
        image: '/news2.jpg',
    },
    {
        name: 'UEFA Finals Commentary',
        lastUpdatedBy: 'Carlos Mendes',
        date: '17 May 2025',
        topic: 'Sport',
        image: '/news2.jpg',
    },
    {
        name: 'Presidential Debate Highlights',
        lastUpdatedBy: 'Nora James',
        date: '16 May 2025',
        topic: 'Politics',
        image: '/news2.jpg',
    },
    {
        name: 'Q2 Market Trends',
        lastUpdatedBy: 'Harvey Lin',
        date: '15 May 2025',
        topic: 'Economy',
        image: '/news2.jpg',
    },
];

const ActiveThreads = () => (
    <div>
        <h2
            style={{
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '7px',
                color: '#000000',
            }}
        >
            Active Threads
        </h2>
        <div style={{height: '1px', backgroundColor: '#CCCCCC', marginBottom: '12px'}}/>

        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {activeThreads.map((thread, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        position: 'relative',
                    }}
                >
                    <div style={{position: 'absolute', top: '0px', left: '80px'}}>
                        <TopicTag label={thread.topic}/>
                    </div>

                    <img
                        src={thread.image}
                        alt={thread.name}
                        style={{width: '70px', height: '70px', objectFit: 'cover'}}
                    />
                    <div style={{flex: 1}}>
                        <p style={{fontSize: '18px', fontWeight: 550, margin: '30px 0 2px', color: '#222'}}>
                            {thread.name}
                        </p>
                        <p style={{fontSize: '15px', color: '#000', margin: 0}}>
                            Last updated: {thread.date}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ActiveThreads;
