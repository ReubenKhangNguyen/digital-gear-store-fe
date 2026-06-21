import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <h3 className="page-title">Admin Dashboard</h3>
      <div className="admin-user-menu">
        <div className="admin-avatar">
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
        </div>
        <div>
          <span 
            style={{ fontWeight: '600', display: 'block', fontSize: '14px', cursor: 'pointer' }} 
            onClick={() => navigate('/profile')}
            title="Đi tới trang cá nhân"
          >
            {user?.fullName || 'Administrator'}
          </span>
          <span style={{ fontSize: '12px', color: '#8D99AE', cursor: 'pointer' }} onClick={handleLogout}>
            Đăng xuất
          </span>
        </div>
      </div>
    </header>
  );
}
