import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & New Password
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // BƯỚC 1: Gửi yêu cầu lấy OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(response.result || 'Mã OTP đã được gửi vào email của bạn!');
      setStep(2); // Chuyển sang bước 2
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // BƯỚC 2: Xác nhận OTP và đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(email, otpCode, newPassword);
      setSuccess(response.result || 'Đổi mật khẩu thành công!');
      
      // Chuyển về trang Login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Mã OTP không hợp lệ hoặc đã hết hạn.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container" style={styles.cardContainer}>
        <div className="row" style={{ margin: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Cột trái: Hình ảnh minh họa */}
          <div className="col-md-6 hidden-xs hidden-sm" style={styles.leftCol}>
            <div style={styles.illustrationWrapper}>
              <div style={styles.circleBg}>
                <i className="fa fa-envelope-o" style={styles.mainIcon}></i>
                <i className="fa fa-unlock-alt" style={styles.subIcon}></i>
              </div>
              <i className="fa fa-circle-o" style={{ ...styles.decoIcon, top: '20%', left: '10%', color: '#38bdf8' }}></i>
              <i className="fa fa-play" style={{ ...styles.decoIcon, top: '30%', right: '10%', color: '#84cc16', transform: 'rotate(-30deg)' }}></i>
              <i className="fa fa-caret-up" style={{ ...styles.decoIcon, bottom: '20%', left: '15%', color: '#84cc16', fontSize: '24px' }}></i>
              <i className="fa fa-circle" style={{ ...styles.decoIcon, bottom: '15%', right: '20%', color: '#38bdf8', fontSize: '10px' }}></i>
            </div>
          </div>

          {/* Cột phải: Form */}
          <div className="col-md-6 col-xs-12" style={styles.rightCol}>
            <div style={styles.formContainer}>
              <h2 style={styles.title}>Quên Mật Khẩu</h2>

              {success && <div style={styles.successBox}>{success}</div>}
              {error && <div style={styles.errorBox}>{error}</div>}

              {/* BƯỚC 1 FORM */}
              {step === 1 && (
                <form onSubmit={handleSendOtp}>
                  <p style={styles.description}>
                    Vui lòng nhập email bạn đã đăng ký. Chúng tôi sẽ gửi một mã xác thực (OTP) gồm 6 chữ số để giúp bạn đặt lại mật khẩu.
                  </p>
                  
                  <div className="form-group" style={styles.inputGroup}>
                    <i className="fa fa-envelope" style={styles.inputIcon}></i>
                    <input
                      type="email"
                      className="input"
                      placeholder="Nhập địa chỉ Email"
                      style={styles.inputField}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="primary-btn" style={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'Gửi Mã OTP'}
                  </button>
                </form>
              )}

              {/* BƯỚC 2 FORM */}
              {step === 2 && (
                <form onSubmit={handleResetPassword}>
                  <p style={styles.description}>
                    Mã xác thực đã được gửi tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư.
                  </p>

                  <div className="form-group" style={styles.inputGroup}>
                    <i className="fa fa-key" style={styles.inputIcon}></i>
                    <input
                      type="text"
                      className="input"
                      placeholder="Nhập mã OTP (6 số)"
                      style={styles.inputField}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength="6"
                      required
                    />
                  </div>

                  <div className="form-group" style={styles.inputGroup}>
                    <i className="fa fa-lock" style={styles.inputIcon}></i>
                    <input
                      type="password"
                      className="input"
                      placeholder="Mật khẩu mới"
                      style={styles.inputField}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={styles.inputGroup}>
                    <i className="fa fa-check-circle" style={styles.inputIcon}></i>
                    <input
                      type="password"
                      className="input"
                      placeholder="Nhập lại mật khẩu mới"
                      style={styles.inputField}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="primary-btn" style={{...styles.submitBtn, backgroundColor: '#84cc16'}} disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Xác nhận Đổi Mật Khẩu'}
                  </button>
                </form>
              )}

              <div style={styles.backToLogin}>
                <Link to="/login" style={{ color: '#1E293B', fontSize: '14px', fontWeight: 'bold' }}>
                  <i className="fa fa-long-arrow-left"></i> Quay lại Đăng nhập
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Bê nguyên style từ LoginPage.jsx sang để giữ tính nhất quán
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
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainIcon: {
    fontSize: '80px',
    color: '#1E293B'
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
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '700'
  },
  description: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#8D99AE',
    marginBottom: '25px',
    lineHeight: '1.5'
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
    marginTop: '10px'
  },
  backToLogin: {
    textAlign: 'center',
    paddingTop: '30px',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '20px',
    border: '1px solid #fca5a5'
  },
  successBox: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '20px',
    border: '1px solid #86efac'
  }
};
