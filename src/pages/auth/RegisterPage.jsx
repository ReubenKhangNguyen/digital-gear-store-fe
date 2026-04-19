import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validate client-side
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const response = await authService.register({
         username: formData.username,
         fullName: formData.fullName,
         email: formData.email,
         password: formData.password
      });

      // Kiểm tra format ApiResponse của backend
      if (response && response.code === 1000) {
         // Thành công
         navigate('/login');
      } else {
         setError(response?.message || 'Có lỗi xảy ra khi đăng ký!');
      }
    } catch (err) {
       // Thường backend Spring Boot ném lỗi 400 kèm message, axios sẽ nhảy vào catch
       if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
       } else {
          setError('Đã có lỗi xảy ra từ máy chủ!');
       }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container" style={styles.cardContainer}>
        <div className="row" style={{ margin: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row-reverse' }}>
          
          {/* Cột trái (Đảo ngược) để đổi vị trí hình ảnh cho khác Login */}
          <div className="col-md-5 hidden-xs hidden-sm" style={styles.leftCol}>
            <div style={styles.illustrationWrapper}>
              <div style={styles.circleBg}>
                <i className="fa fa-user-plus" style={styles.mainIcon}></i>
              </div>
              <i className="fa fa-circle-o" style={{...styles.decoIcon, top: '20%', left: '10%', color: '#38bdf8'}}></i>
              <i className="fa fa-play" style={{...styles.decoIcon, top: '30%', right: '10%', color: '#C026D3', transform: 'rotate(-30deg)'}}></i>
              <i className="fa fa-square-o" style={{...styles.decoIcon, bottom: '20%', left: '15%', color: '#84cc16', fontSize: '20px'}}></i>
            </div>
          </div>

          {/* Cột phải: Form Đăng ký */}
          <div className="col-md-7 col-xs-12" style={styles.rightCol}>
            <div style={styles.formContainer}>
              <h2 style={styles.title}>Create Account</h2>
              
              <form onSubmit={handleRegister}>
                <div className="row">
                  <div className="col-md-6">
                     {/* Input Username */}
                    <div className="form-group" style={styles.inputGroup}>
                      <i className="fa fa-user" style={styles.inputIcon}></i>
                      <input 
                        type="text" 
                        name="username"
                        className="input" 
                        placeholder="Username" 
                        style={styles.inputField}
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* Input FullName */}
                    <div className="form-group" style={styles.inputGroup}>
                      <i className="fa fa-id-card-o" style={styles.inputIcon}></i>
                      <input 
                        type="text" 
                        name="fullName"
                        className="input" 
                        placeholder="Full Name" 
                        style={styles.inputField}
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    {/* Input Email */}
                    <div className="form-group" style={styles.inputGroup}>
                      <i className="fa fa-envelope" style={styles.inputIcon}></i>
                      <input 
                        type="email" 
                        name="email"
                        className="input" 
                        placeholder="Email Address" 
                        style={styles.inputField}
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                     {/* Input Password */}
                    <div className="form-group" style={styles.inputGroup}>
                      <i className="fa fa-lock" style={styles.inputIcon}></i>
                      <input 
                        type="password" 
                        name="password"
                        className="input" 
                        placeholder="Password" 
                        style={styles.inputField}
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                     {/* Input Confirm Password */}
                    <div className="form-group" style={styles.inputGroup}>
                      <i className="fa fa-lock" style={styles.inputIcon}></i>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        className="input" 
                        placeholder="Confirm Password" 
                        style={styles.inputField}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Vùng hiển thị lỗi */}
                {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

                {/* Nút Đăng ký */}
                <button type="submit" className="primary-btn" style={styles.submitBtn}>
                  REGISTER
                </button>
              </form>

              <div style={styles.createAccount}>
                <Link to="/login" style={{ color: '#1E293B', fontSize: '14px', fontWeight: 'bold' }}>
                  <i className="fa fa-long-arrow-left"></i> Back to Login 
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
    background: 'linear-gradient(135deg, #0F172A 0%, #C026D3 100%)',
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
    padding: '40px',
    borderLeft: '1px solid #F1F5F9'
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
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainIcon: {
    fontSize: '80px',
    color: '#1E293B'
  },
  decoIcon: {
    position: 'absolute',
    fontSize: '14px'
  },
  rightCol: {
    padding: '50px 40px',
  },
  formContainer: {
    maxWidth: '450px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
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
    borderRadius: '40px',
    paddingLeft: '45px',
    backgroundColor: '#F1F5F9',
    border: 'none',
    height: '50px',
    fontWeight: '500'
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#C026D3',
    borderRadius: '40px',
    padding: '12px',
    fontSize: '14px',
    letterSpacing: '1px',
    marginTop: '15px'
  },
  createAccount: {
    textAlign: 'center',
    paddingTop: '25px',
  }
};
