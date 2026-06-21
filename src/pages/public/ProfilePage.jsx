import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import UserAddressList from '../../components/profile/UserAddressList';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for Info Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // States for Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Nếu chưa có token thì đẩy về login
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await userService.getMyInfo();
        const data = response.result || response;
        setProfile(data);
        setFullName(data.fullName || '');
        setPhone(data.phone || '');
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
        // Token có thể hết hạn
        if (error.response?.status === 401) {
           localStorage.removeItem('accessToken');
           navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!fullName) {
      toast.warning('Vui lòng nhập họ và tên!');
      return;
    }
    
    try {
      const response = await userService.updateMyInfo({ fullName, phone });
      toast.success('Cập nhật thông tin thành công!');
      // Update local profile state
      const data = response.result || response;
      setProfile(data);
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      toast.error(error.response?.data?.message || 'Cập nhật thất bại!');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning('Vui lòng điền đầy đủ các trường mật khẩu!');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      const response = await userService.changePassword({ oldPassword, newPassword });
      toast.success(response.result || 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại với mật khẩu mới!');
      
      // Xóa form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Đăng xuất và chuyển về login
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại!');
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Đang tải thông tin...</h3>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        
        {/* Tiêu đề trang */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Tài khoản của tôi</h2>
          <p style={{ color: '#888' }}>Quản lý thông tin hồ sơ và bảo mật tài khoản</p>
        </div>

        <div className="row">
          
          {/* CỘT TRÁI: THÔNG TIN TỔNG QUAN (AVATAR) */}
          <div className="col-md-4">
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 20px', 
                backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', border: '3px solid #C846C8'
              }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="fa fa-user" style={{ fontSize: '50px', color: '#ccc' }}></i>
                )}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px' }}>{profile.fullName}</h3>
              <p style={{ color: '#888', marginBottom: '15px' }}>@{profile.username}</p>
              
              <div style={{ display: 'inline-block', backgroundColor: '#F8E8FC', color: '#C846C8', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {profile.roles?.map(r => r.name || r).join(', ') || 'USER'}
              </div>

              <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: '10px 0', color: '#555' }}><i className="fa fa-envelope" style={{ width: '20px', color: '#C846C8' }}></i> {profile.email}</p>
                <p style={{ margin: '10px 0', color: '#555' }}><i className="fa fa-phone" style={{ width: '20px', color: '#C846C8' }}></i> {profile.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CÁC FORM CẬP NHẬT */}
          <div className="col-md-8">
            
            {/* 1. FORM CẬP NHẬT THÔNG TIN */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h4 style={{ borderBottom: '2px solid #f4f4f4', paddingBottom: '15px', marginBottom: '25px', fontWeight: 'bold' }}>
                <i className="fa fa-edit" style={{ color: '#C846C8', marginRight: '10px' }}></i> Thông tin cá nhân
              </h4>
              
              <form onSubmit={handleUpdateInfo}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Họ và Tên</label>
                    <input 
                      className="input" 
                      type="text" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      placeholder="Nhập họ và tên..."
                      style={{ borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Số điện thoại</label>
                    <input 
                      className="input" 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="Nhập số điện thoại..."
                      style={{ borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#aaa' }}>Email (Không thể thay đổi)</label>
                    <input 
                      className="input" 
                      type="email" 
                      value={profile.email} 
                      disabled
                      style={{ borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#aaa' }}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#aaa' }}>Tên đăng nhập (Không thể thay đổi)</label>
                    <input 
                      className="input" 
                      type="text" 
                      value={profile.username} 
                      disabled
                      style={{ borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#aaa' }}
                    />
                  </div>
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <button type="submit" className="primary-btn" style={{ padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold' }}>
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>

            {/* 2. FORM ĐỔI MẬT KHẨU */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h4 style={{ borderBottom: '2px solid #f4f4f4', paddingBottom: '15px', marginBottom: '25px', fontWeight: 'bold' }}>
                <i className="fa fa-lock" style={{ color: '#C846C8', marginRight: '10px' }}></i> Đổi Mật Khẩu
              </h4>
              
              <form onSubmit={handleChangePassword}>
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Mật khẩu hiện tại</label>
                    <input 
                      className="input" 
                      type="password" 
                      value={oldPassword} 
                      onChange={e => setOldPassword(e.target.value)} 
                      placeholder="Nhập mật khẩu cũ..."
                      style={{ borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Mật khẩu mới</label>
                    <input 
                      className="input" 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      placeholder="Nhập mật khẩu mới..."
                      style={{ borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Xác nhận mật khẩu mới</label>
                    <input 
                      className="input" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="Nhập lại mật khẩu mới..."
                      style={{ borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <button type="submit" className="primary-btn" style={{ padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold', backgroundColor: '#333' }}>
                    Cập Nhật Mật Khẩu
                  </button>
                </div>
              </form>
            </div>

            {/* 3. QUẢN LÝ SỔ ĐỊA CHỈ */}
            <div style={{ marginTop: '30px' }}>
              <UserAddressList />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
