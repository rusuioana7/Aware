import TopicTag from '../Tags/TopicTag.tsx';

const followedThreads = [
    {
        name: 'AI Regulation Updates',
        lastUpdatedBy: 'Samantha Ray',
        date: '17 May 2025',
        topic: 'Tech',
        image: '/news2.jpg',
    },
    {
        name: 'Olympic Games 2024 Recap',
        lastUpdatedBy: 'Liam Ford',
        date: '12 May 2025',
        topic: 'Sport',
        image: '/news2.jpg',
    },
    {
        name: 'Climate Policy Debates',
        lastUpdatedBy: 'Maya Greene',
        date: '10 May 2025',
        topic: 'Politics',
        image: '/news2.jpg',
    },
    {
        name: 'Economic Forecasts 2025',
        lastUpdatedBy: 'Nathan Bell',
        date: '06 May 2025',
        topic: 'Economy',
        image: '/news2.jpg',
    },
];

const ThreadsYouFollow = () => (
    <div style={{marginBottom: '30px'}}>
        <h2
            style={{
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '7px',
                color: '#000000',
            }}
        >
            Threads You Follow
        </h2>
        <div style={{height: '1px', backgroundColor: '#CCCCCC', marginBottom: '12px'}}/>

        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {followedThreads.map((thread, index) => (
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

export default ThreadsYouFollow;
