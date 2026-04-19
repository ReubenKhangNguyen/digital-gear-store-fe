import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';

export default function UserListPage() {
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
                      <button className="action-btn edit" title="Chi tiết"><i className="fa fa-eye"></i></button>
                      <button className="action-btn delete" title="Khóa TK"><i className="fa fa-lock"></i></button>
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
