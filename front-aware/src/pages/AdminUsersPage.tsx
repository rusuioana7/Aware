import React, {useState, useEffect} from 'react';
import Header from '../components/Cards/PageLayout/Header';
import AdminMenu from '../components/AdminPage/AdminMenu';
import {BASE_URL} from '../api/config';

interface User {
    id: number;
    email: string;
    createdAt: string;

    [key: string]: any;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalError, setModalError] = useState('');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        };
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${BASE_URL}/admin/users`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                if (!res.ok) {
                    console.error('Failed to load users:', res.status, res.statusText);
                    return;
                }
                const data: User[] = await res.json();
                setUsers(data);
            } catch (err) {
                console.error('Network / parsing error:', err);
            }
        };
        fetchUsers();
    }, []);

    const toggleExpand = (id: number) =>
        setExpandedId(prev => (prev === id ? null : id));

    const handleDelete = async (id: number) => {
        if (!window.confirm(`Really delete user #${id}?`)) return;
        try {
            const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                setUsers(u => u.filter(x => x.id !== id));
            } else {
                console.error('Delete failed:', res.status, res.statusText);
                alert('Delete failed');
            }
        } catch (err) {
            console.error('Network error on delete:', err);
        }
    };

    const openModal = () => {
        setModalError('');
        setNewEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setShowModal(true);
    };

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError('');

        if (typeof confirmPassword !== 'string') {
            setModalError('Confirm password must be a string');
            return;
        }
        if (newPassword.length < 10) {
            setModalError('Password must be at least 10 characters');
            return;
        }
        if (confirmPassword.length < 10) {
            setModalError('Confirm password must be at least 10 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setModalError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/admin/users`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    email: newEmail,
                    password: newPassword,
                    confirmPassword,
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                setModalError(err.message || 'Create failed');
                return;
            }
            const created: User = await res.json();
            setUsers(prev => [created, ...prev]);
            setShowModal(false);
        } catch (err) {
            console.error('Network error on create:', err);
            setModalError('Network error');
        }
    };

    return (
        <>
            <style>{`
        /* Container */
        .aup-container { display: flex; flex-direction: column; min-height: 100vh; background: #f9fafb; }
        .aup-menu { border-bottom: 1px solid #ddd; }
        .aup-content { flex: 1; padding: 24px; }

        /* Toolbar */
        .aup-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .aup-toolbar h2 { margin: 0; font-size: 1.5rem; color: #333; }

        /* Table */
        .aup-table-container { background: #fff; border: 1px solid #ddd; border-radius: 4px; overflow-x: auto; }
        .aup-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .aup-table th, .aup-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #eee; font-size: 0.95rem; color: #333; }
        .aup-table th { background: #f3f4f6; font-weight: 600; }
        .aup-row:hover { background: #f5f5f5; }
        .aup-details-row td { padding: 0; }
        .aup-no-users { text-align: center; color: #777; padding: 20px 0; }

        /* Buttons */
        .button-group button { margin-right: 8px; }
        .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: background-color 0.2s ease; }
        .btn-create { background: #28a745; color: #fff; }
        .btn-create:hover { background: #218838; }
        .btn-details { background: #031A6B; color: #fff; }
        .btn-details:hover { background: #0069d9; }
        .btn-delete { background: #dc3545; color: #fff; }
        .btn-delete:hover { background: #c82333; }

        /* Modal */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
        }
        .modal {
          background: #fff; border-radius: 8px; padding: 24px; width: 90%; max-width: 400px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .modal h3 { margin-top: 0; margin-bottom: 16px; }
        .modal input {
          width: 100%; padding: 8px; margin-bottom: 12px;
          border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;
        }
        .modal .modal-buttons { display: flex; justify-content: flex-end; gap: 8px; }
        .btn-cancel { background: #ccc; color: #333; }
        .btn-cancel:hover { background: #bbb; }
        .btn-confirm { background: #28a745; color: #fff; }
        .btn-confirm:hover { background: #218838; }
        .modal .error { color: #dc3545; margin-bottom: 12px; font-size: 0.9rem; }

        /* Details list */
        .details-list {
          background: #fafafa;
          padding: 16px;
          border-radius: 4px;
        }
        .detail-item {
          margin-bottom: 12px;
        }
        .detail-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 4px;
        }
        .detail-value {
          color: #333;
          font-size: 0.95rem;
          word-break: break-word;
        }
      `}</style>

            <div className="aup-container">
                <Header/>
                <div className="aup-menu"><AdminMenu/></div>

                <div className="aup-content">
                    <div className="aup-toolbar">
                        <h2>Manage Users</h2>
                        <button className="btn btn-create" onClick={openModal}>+ Create User</button>
                    </div>

                    <div className="aup-table-container">
                        <table className="aup-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <React.Fragment key={user.id}>
                                    <tr className="aup-row">
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                                        <td className="button-group">
                                            <button className="btn btn-details" onClick={() => toggleExpand(user.id)}>
                                                {expandedId === user.id ? 'Hide' : 'Details'}
                                            </button>
                                            <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === user.id && (
                                        <tr className="aup-details-row">
                                            <td colSpan={4}>
                                                <div className="details-list">
                                                    {Object.entries(user)
                                                        .filter(([key]) => !['id', 'email', 'createdAt'].includes(key))
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
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="aup-no-users">No users found.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <form className="modal" onSubmit={handleModalSubmit}>
                        <h3>Create New User</h3>
                        {modalError && <div className="error">{modalError}</div>}
                        <input
                            type="email"
                            placeholder="Email"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            minLength={10}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            minLength={10}
                        />
                        <div className="modal-buttons">
                            <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-confirm">Create</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AdminUsersPage;
