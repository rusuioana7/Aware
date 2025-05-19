import React, {useState} from 'react';
import FeedOptions from './FeedOptions.tsx';
import Feed from './Feed.tsx';

const SelectView: React.FC = () => {
    const [selectedView, setSelectedView] = useState<'All' | 'Articles' | 'Threads'>('All');

    return (
        <div>
            <FeedOptions onViewChange={setSelectedView}/>
            <Feed selectedView={selectedView}/>
        </div>
    );
};

export default SelectView;