import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';

export default function OAuth2RedirectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [statusText, setStatusText] = useState('Đang xử lý đăng nhập...');

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        // 1. Kiểm tra xem có token trả về qua hash không (vd: #token=eyJhbG...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get('token');
        const error = hashParams.get('error');

        // Note: Spring security might return error via standard query parameters ?error=...
        const queryParams = new URLSearchParams(location.search);
        const queryError = queryParams.get('error');

        const finalError = error || queryError;

        if (finalError) {
          // Xử lý trường hợp backend quăng lỗi (vd: Account Collision)
          navigate('/login', { state: { authError: decodeURIComponent(finalError) } });
          return;
        }

        if (token) {
          // 2. Lưu token vào localStorage tạm để userService có thể gắn vào Bearer
          localStorage.setItem("accessToken", token);

          // 3. Gọi API để lấy My Info (chứng thực token và lấy Profile)
          const userInfoResponse = await userService.getMyInfo();
          
          // 4. Cập nhật Context trạng thái đăng nhập
          login(token, userInfoResponse.result);

          // 5. Điều hướng về trang chủ
          setStatusText('Đăng nhập thành công! Đang chuyển hướng...');
          setTimeout(() => navigate('/'), 1000);
        } else {
          // Nếu URL không có params nào hợp lệ
          navigate('/login', { state: { authError: 'Không tìm thấy thông tin xác thực từ Google.' } });
        }
      } catch (err) {
        console.error("Lỗi khi xử lý OAuth2 Redirect:", err);
        navigate('/login', { state: { authError: 'Quá trình đăng nhập Google bị gián đoạn. Vui lòng thử lại.' } });
      }
    };

    handleOAuth2Redirect();
  }, [navigate, login, location.search]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#F1F5F9'
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <i className="fa fa-spinner fa-spin" style={{ fontSize: '40px', color: '#C026D3', marginBottom: '20px' }}></i>
        <h3 style={{ margin: 0, color: '#1E293B' }}>{statusText}</h3>
        <p style={{ color: '#8D99AE', marginTop: '10px' }}>Vui lòng không đóng trình duyệt lúc này...</p>
      </div>
    </div>
  );
}
