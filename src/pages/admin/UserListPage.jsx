import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

export default function UserListPage() {
  const { user: currentUser } = React.useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        // ApiResponse structure: { code: 1000, result: [...] }
        const data = response.result || response;
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const actionText = user.isActive ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản @${user.username} không?`)) return;

    try {
      const response = await userService.updateUserStatus(user.id, !user.isActive);
      toast.success(response.result || `Đã ${actionText} tài khoản thành công!`);
      // Update local state
      setUsers(users.map(u => u.id === user.id ? { ...u, isActive: !user.isActive } : u));
    } catch (error) {
      console.error(`Lỗi ${actionText} tài khoản:`, error);
      toast.error(error.response?.data?.message || `Thao tác thất bại!`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Hồ sơ Người dùng</h2>
          <p style={{ color: '#8D99AE' }}>Danh sách tài khoản hệ thống (Khách hàng / Quản trị viên).</p>
        </div>
        {/* Users usually registered manually on front store, so Add user button is optional here */}
      </div>

      <div className="admin-card">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}><input type="checkbox" /></th>
                  <th>Username</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><input type="checkbox" /></td>
                    <td style={{ fontWeight: '600', color: '#C026D3' }}>@{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email || '--'}</td>
                    <td>{user.phone || '--'}</td>
                    <td>
                      <span className={user.isActive ? 'badge-success' : 'badge-danger'}>
                        {user.isActive ? 'Active' : 'Locked'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`action-btn ${user.isActive ? 'delete' : 'edit'}`} 
                        title={user.isActive ? 'Khóa TK' : 'Mở khóa'}
                        onClick={() => handleToggleStatus(user)}
                        disabled={currentUser?.id === user.id}
                        style={{ 
                          backgroundColor: user.isActive ? '#ffebee' : '#e8f5e9', 
                          color: user.isActive ? '#D10024' : '#2e7d32',
                          opacity: currentUser?.id === user.id ? 0.3 : 1,
                          cursor: currentUser?.id === user.id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <i className={`fa ${user.isActive ? 'fa-lock' : 'fa-unlock'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không có người dùng nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
