import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderCode = searchParams.get('order');

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '50px 30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <i className="fa fa-check" style={{ fontSize: '40px', color: '#4caf50' }}></i>
        </div>
        
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>Đặt Hàng Thành Công!</h2>
        <p style={{ color: '#555', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
          Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </p>
        
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px dashed #ccc' }}>
          <span style={{ display: 'block', color: '#888', fontSize: '14px', marginBottom: '5px' }}>Mã đơn hàng của bạn</span>
          <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#C846C8', letterSpacing: '2px' }}>
            {orderCode || 'Không xác định'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/" className="btn" style={{ padding: '12px 25px', borderRadius: '30px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#333', fontWeight: 'bold', flex: 1 }}>
            Tiếp Tục Mua Sắm
          </Link>
          <Link to="/profile" className="primary-btn" style={{ padding: '12px 25px', borderRadius: '30px', fontWeight: 'bold', flex: 1 }}>
            Xem Chi Tiết Đơn
          </Link>
        </div>
      </div>
    </div>
  );
}
