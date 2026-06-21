import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.authError || '');
  const { login } = useContext(AuthContext);

  // Clear error from history state so it doesn't persist on refresh
  useEffect(() => {
    if (location.state?.authError) {
      navigate('/login', { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login(username, password);
      // Check cấu trúc ApiResponse: response.code === 1000 và có token
      if (response && response.code === 1000 && response.result?.token) {
        // Lưu token vào localStorage 
        const newToken = response.result.token;
        localStorage.setItem("accessToken", newToken);

        // Lấy thông tin user từ API /users/myinfo để lưu vào Context
        const userInfoResponse = await userService.getMyInfo();

        // Cập nhật Context với token và thông tin user
        login(newToken, userInfoResponse.result);

        navigate('/'); // Chuyển hướng trang chủ
      } else {
        setError(response?.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Hiển thị lỗi từ server
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container" style={styles.cardContainer}>
        <div className="row" style={{ margin: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Cột trái: Hình ảnh minh họa */}
          <div className="col-md-6 hidden-xs hidden-sm" style={styles.leftCol}>
            <div style={styles.illustrationWrapper}>
              {/* Vòng tròn nền */}
              <div style={styles.circleBg}>
                <i className="fa fa-laptop" style={styles.mainIcon}></i>
                <i className="fa fa-user" style={styles.subIcon}></i>
              </div>
              {/* Trang trí xung quanh */}
              <i className="fa fa-circle-o" style={{ ...styles.decoIcon, top: '20%', left: '10%', color: '#38bdf8' }}></i>
              <i className="fa fa-play" style={{ ...styles.decoIcon, top: '30%', right: '10%', color: '#84cc16', transform: 'rotate(-30deg)' }}></i>
              <i className="fa fa-caret-up" style={{ ...styles.decoIcon, bottom: '20%', left: '15%', color: '#84cc16', fontSize: '24px' }}></i>
              <i className="fa fa-circle" style={{ ...styles.decoIcon, bottom: '15%', right: '20%', color: '#38bdf8', fontSize: '10px' }}></i>
            </div>
          </div>

          {/* Cột phải: Form Đăng nhập */}
          <div className="col-md-6 col-xs-12" style={styles.rightCol}>
            <div style={styles.formContainer}>
              <h2 style={styles.title}>Member Login</h2>

              <form onSubmit={handleLogin}>
                {/* Input Tên đăng nhập */}
                <div className="form-group" style={styles.inputGroup}>
                  <i className="fa fa-envelope" style={styles.inputIcon}></i>
                  <input
                    type="text"
                    className="input"
                    placeholder="Username / Email"
                    style={styles.inputField}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Input Mật khẩu */}
                <div className="form-group" style={styles.inputGroup}>
                  <i className="fa fa-lock" style={styles.inputIcon}></i>
                  <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    style={styles.inputField}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Vùng hiển thị lỗi */}
                {error && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center', margin: '-10px 0 10px' }}>{error}</p>}

                {/* Nút Đăng nhập */}
                <button type="submit" className="primary-btn" style={styles.submitBtn}>
                  LOGIN
                </button>

                {/* Dòng phân cách */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                  <span style={{ padding: '0 10px', color: '#8D99AE', fontSize: '12px' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                {/* Nút Đăng nhập Google */}
                <button 
                  type="button" 
                  onClick={() => window.location.href = "http://localhost:8080/api/v1/digital-store/oauth2/authorization/google"}
                  style={{...styles.submitBtn, backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{width: '18px', marginRight: '10px'}} />
                  Sign in with Google
                </button>
              </form>

              <div style={styles.forgotPassword}>
                <Link to="/forgot-password" style={{ color: '#8D99AE', fontSize: '12px' }}>Forgot Username / Password?</Link>
              </div>

              <div style={styles.createAccount}>
                <Link autoFocus to="/register" style={{ color: '#1E293B', fontSize: '14px', fontWeight: 'bold' }}>
                  Create your Account <i className="fa fa-long-arrow-right"></i>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0F172A 0%, #C026D3 100%)', // Phối màu Dark (#0F172A) sang Primary (#C026D3) của style.css
    padding: '20px'
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    maxWidth: '900px',
    padding: 0
  },
  leftCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  },
  illustrationWrapper: {
    position: 'relative',
    width: '100%',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleBg: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#F1F5F9', // Grey từ style.css
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainIcon: {
    fontSize: '80px',
    color: '#1E293B' // Headers color
  },
  subIcon: {
    position: 'absolute',
    fontSize: '30px',
    color: '#8D99AE',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -30%)'
  },
  decoIcon: {
    position: 'absolute',
    fontSize: '14px'
  },
  rightCol: {
    padding: '50px 40px',
  },
  formContainer: {
    maxWidth: '320px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '24px',
    fontWeight: '700'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '20px'
  },
  inputIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#8D99AE',
    fontSize: '14px'
  },
  inputField: {
    borderRadius: '40px', // Cho giống với nút bấm
    paddingLeft: '45px', // Tránh đè lên thẻ i
    backgroundColor: '#F1F5F9', // Nền màu xám xám y hình
    border: 'none',
    height: '50px',
    fontWeight: '500'
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#C026D3', // Màu Primary của dự án
    borderRadius: '40px',
    padding: '12px',
    fontSize: '14px',
    letterSpacing: '1px',
    marginTop: '10px'
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '40px'
  },
  createAccount: {
    textAlign: 'center',
    paddingTop: '30px',
  }
};
