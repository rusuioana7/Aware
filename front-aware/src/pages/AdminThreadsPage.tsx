import React, {useState, useEffect} from 'react';
import Header from '../components/Cards/PageLayout/Header';
import AdminMenu from '../components/AdminPage/AdminMenu';
import {BASE_URL} from '../api/config';

interface Thread {
    _id: string;
    title?: string;

    [key: string]: any;
}

const PAGE_SIZE = 10;

const AdminThreadsPage: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const [searchId, setSearchId] = useState<string>('');
    const [isSearching, setIsSearching] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        };
    };

    const fetchPage = async (pageNum: number) => {
        try {
            const url = `${BASE_URL}/admin/threads?page=${pageNum}&size=${PAGE_SIZE}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                console.error('Failed to load threads:', res.status, res.statusText);
                setThreads([]);
                return;
            }
            const json = await res.json();
            let arr: any[] = [];
            if (Array.isArray(json)) {
                arr = json;
            } else if (Array.isArray(json.data)) {
                arr = json.data;
            } else if (Array.isArray(json.items)) {
                arr = json.items;
            } else if (Array.isArray(json.threads)) {
                arr = json.threads;
            }
            setThreads(arr);
        } catch (err) {
            console.error('Network / parsing error:', err);
            setThreads([]);
        }
    };

    const fetchById = async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/threads/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error(`Not found (${res.status})`);
            const thread = await res.json();
            setThreads([thread]);
        } catch (err: any) {
            window.alert(err.message || 'Error fetching thread');
            setThreads([]);
        }
    };

    useEffect(() => {
        if (!isSearching) {
            fetchPage(page);
        }
    }, [page, isSearching]);

    const toggleExpand = (id: string) =>
        setExpandedId(prev => (prev === id ? null : id));

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Really delete thread ${id}?`)) return;
        try {
            const res = await fetch(`${BASE_URL}/admin/threads/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                setThreads(t => t.filter(x => x._id !== id));
            } else {
                console.error('Delete failed:', res.status, res.statusText);
                alert('Delete failed');
            }
        } catch (err) {
            console.error('Network error on delete:', err);
        }
    };

    const handleSearch = () => {
        if (!searchId.trim()) return;
        setIsSearching(true);
        fetchById(searchId.trim());
    };

    const handleClear = () => {
        setSearchId('');
        setIsSearching(false);
        setPage(1);
    };

    return (
        <>
            <style>{`
        .atp-container { display: flex; flex-direction: column; min-height: 100vh; background: #f9fafb; }
        .atp-menu { border-bottom: 1px solid #ddd; }
        .atp-content { flex: 1; padding: 24px; }

        .atp-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .atp-toolbar h2 { margin: 0; font-size: 1.5rem; color: #333; }

        .atp-search { display: flex; gap: 8px; margin-bottom: 16px; }
        .atp-search input { flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
        .atp-search button { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: #031A6B; color: #fff; }
        .atp-search button.clear { background: #555; }

        .atp-table-container { background: #fff; border: 1px solid #ddd; border-radius: 4px; overflow-x: auto; }
        .atp-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .atp-table th, .atp-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #eee; font-size: 0.95rem; color: #333; }
        .atp-table th { background: #f3f4f6; font-weight: 600; }
        .atp-row:hover { background: #f5f5f5; }
        .atp-details-row td { padding: 0; }
        .atp-no-items { text-align: center; color: #777; padding: 20px 0; }

        .button-group button { margin-right: 8px; }
        .btn-details { background: #031A6B; color: #fff; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-details:hover { background: #0069d9; }
        .btn-delete { background: #dc3545; color: #fff; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-delete:hover { background: #c82333; }

        .details-list { background: #fafafa; padding: 16px; border-radius: 4px; }
        .detail-item { margin-bottom: 12px; }
        .detail-label { font-weight: 600; color: #555; margin-bottom: 4px; }
        .detail-value { color: #333; font-size: 0.95rem; white-space: pre-wrap; word-break: break-word; }

        .pagination { display: flex; justify-content: center; align-items: center; margin-top: 16px; gap: 8px; }
        .btn-page { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: #031A6B; color: #fff; }
        .btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

            <div className="atp-container">
                <Header/>
                <div className="atp-menu"><AdminMenu/></div>
                <div className="atp-content">
                    <div className="atp-toolbar">
                        <h2>Manage Threads</h2>
                    </div>

                    <div className="atp-search">
                        <input
                            placeholder="Enter thread ID…"
                            value={searchId}
                            onChange={e => setSearchId(e.target.value)}
                        />
                        <button onClick={handleSearch}>Search</button>
                        <button className="clear" onClick={handleClear}>Clear</button>
                    </div>

                    <div className="atp-table-container">
                        <table className="atp-table">
                            <thead>
                            <tr>
                                <th>_ID</th>
                                <th>Title</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {threads.map(thread => (
                                <React.Fragment key={thread._id}>
                                    <tr className="atp-row">
                                        <td>{thread._id}</td>
                                        <td>{thread.title || '—'}</td>
                                        <td className="button-group">
                                            <button
                                                className="btn-details"
                                                onClick={() => toggleExpand(thread._id)}
                                            >
                                                {expandedId === thread._id ? 'Hide' : 'Details'}
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(thread._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === thread._id && (
                                        <tr className="atp-details-row">
                                            <td colSpan={3}>
                                                <div className="details-list">
                                                    {Object.entries(thread)
                                                        .filter(([key]) => !['_id', 'title'].includes(key))
                                                        .map(([key, val]) => {
                                                            const display = Array.isArray(val)
                                                                ? val.join(', ')
                                                                : val == null
                                                                    ? '—'
                                                                    : String(val);
                                                            const label = key
                                                                .replace(/([A-Z])/g, ' $1')
                                                                .replace(/^./, str => str.toUpperCase());
                                                            return (
                                                                <div className="detail-item" key={key}>
                                                                    <div className="detail-label">{label}</div>
                                                                    <div className="detail-value">{display}</div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {threads.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="atp-no-items">
                                        No threads found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            className="btn-page"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </button>
                        <span>Page {page}</span>
                        <button
                            className="btn-page"
                            disabled={threads.length < PAGE_SIZE}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminThreadsPage;
