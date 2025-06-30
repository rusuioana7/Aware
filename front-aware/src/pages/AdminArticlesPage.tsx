import React, {useState, useEffect} from 'react';
import {FaFlag} from 'react-icons/fa';
import Header from '../components/Cards/PageLayout/Header';
import AdminMenu from '../components/AdminPage/AdminMenu';
import {BASE_URL} from '../api/config';

interface Article {
    _id: string;
    title: string;
    reports?: number;

    [key: string]: any;
}

const PAGE_SIZE = 10;

const AdminArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
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
            const url = `${BASE_URL}/admin/articles?page=${pageNum}&size=${PAGE_SIZE}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                console.error('Failed to load articles:', res.status, res.statusText);
                setArticles([]);
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
            } else if (Array.isArray(json.articles)) {
                arr = json.articles;
            }
            setArticles(arr);
        } catch (err) {
            console.error('Network / parsing error:', err);
            setArticles([]);
        }
    };

    const fetchById = async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/articles/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error(`Not found (${res.status})`);
            const article = await res.json();
            setArticles([article]);
        } catch (err: any) {
            window.alert(err.message || 'Error fetching article');
            setArticles([]);
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
        if (!window.confirm(`Really delete article ${id}?`)) return;
        try {
            const res = await fetch(`${BASE_URL}/admin/articles/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                setArticles(a => a.filter(x => x._id !== id));
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
        .aup-container { display: flex; flex-direction: column; min-height: 100vh; background: #f9fafb; }
        .aup-menu { border-bottom: 1px solid #ddd; }
        .aup-content { flex: 1; padding: 24px; }
        .aup-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .aup-toolbar h2 { margin: 0; font-size: 1.5rem; color: #333; }
        .aup-search { display: flex; gap: 8px; margin-bottom: 16px; }
        .aup-search input { flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
        .aup-search button { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: #031A6B; color: #fff; }
        .aup-search button.clear { background: #555; }
        .aup-table-container { background: #fff; border: 1px solid #ddd; border-radius: 4px; overflow-x: auto; }
        .aup-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .aup-table th, .aup-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #eee; font-size: 0.95rem; color: #333; }
        .aup-table th { background: #f3f4f6; font-weight: 600; }
        .aup-row:hover { background: #f5f5f5; }
        .aup-details-row td { padding: 0; }
        .aup-no-items { text-align: center; color: #777; padding: 20px 0; }
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

            <div className="aup-container">
                <Header/>
                <div className="aup-menu"><AdminMenu/></div>
                <div className="aup-content">
                    <div className="aup-toolbar">
                        <h2>Manage Articles</h2>
                    </div>

                    <div className="aup-search">
                        <input
                            placeholder="Enter article ID…"
                            value={searchId}
                            onChange={e => setSearchId(e.target.value)}
                        />
                        <button onClick={handleSearch}>Search</button>
                        <button className="clear" onClick={handleClear}>Clear</button>
                    </div>

                    <div className="aup-table-container">
                        <table className="aup-table">
                            <thead>
                            <tr>
                                <th>_ID</th>
                                <th>Title</th>
                                <th>Reports</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {articles.map(article => (
                                <React.Fragment key={article._id}>
                                    <tr className="aup-row">
                                        <td>{article._id}</td>
                                        <td>{article.title}</td>
                                        <td>
                                            {article.reports && article.reports > 0
                                                ? <FaFlag color="red" title={`${article.reports} report(s)`}/>
                                                : '—'
                                            }
                                        </td>
                                        <td className="button-group">
                                            <button
                                                className="btn-details"
                                                onClick={() => toggleExpand(article._id)}
                                            >
                                                {expandedId === article._id ? 'Hide' : 'Details'}
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(article._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === article._id && (
                                        <tr className="aup-details-row">
                                            <td colSpan={4}>
                                                <div className="details-list">
                                                    {Object.entries(article)
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
                            {articles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="aup-no-items">
                                        No articles found.
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
                            disabled={articles.length < PAGE_SIZE}
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

export default AdminArticlesPage;
