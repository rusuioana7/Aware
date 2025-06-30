import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header from "../components/Cards/PageLayout/Header.tsx";
import AdminMenu from "../components/AdminPage/AdminMenu.tsx";
import {BASE_URL} from "../api/config.ts";

const AdminPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch(`${BASE_URL}/settings/logout`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
        } catch {
            // ignore errors
        }
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <>
            <style>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #f0f0f0;
        }
        .admin-content {
          flex: 1;
        }
        .admin-footer {
          background: #ffffff;
          border-top: 1px solid #ddd;
          padding: 16px;
          text-align: center;
        }
        .logout-button {
          background: #dc3545;
          color: #ffffff;
          font-weight: 600;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .logout-button:hover {
          background: #c82333;
        }
      `}</style>

            <div className="admin-container">
                <Header/>
                <div className="admin-content">
                    <AdminMenu/>
                </div>
                <footer className="admin-footer">
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Logout
                    </button>
                </footer>
            </div>
        </>
    );
};

export default AdminPage;
