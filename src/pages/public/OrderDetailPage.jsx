import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.result || response);
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      toast.error('Không thể tải chi tiết đơn hàng.');
      navigate('/my-orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    
    setIsCancelling(true);
    try {
      await orderService.cancelOrder(id);
      toast.success('Hủy đơn hàng thành công!');
      fetchOrderDetails(); // Reload data to get new status
    } catch (error) {
      console.error('Lỗi hủy đơn:', error);
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng lúc này.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span style={{ backgroundColor: '#cce5ff', color: '#004085', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Đã xác nhận</span>;
      case 'SHIPPING':
        return <span style={{ backgroundColor: '#d1ecf1', color: '#0c5460', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Đang giao</span>;
      case 'COMPLETED':
        return <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Thành công (Đã giao)</span>;
      case 'DELIVERY_FAILED':
        return <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Giao thất bại</span>;
      case 'CANCELLED':
        return <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Đã hủy</span>;
      case 'RETURNED':
        return <span style={{ backgroundColor: '#e2e3e5', color: '#383d41', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Đã hoàn trả</span>;
      default:
        return <span style={{ backgroundColor: '#e2e3e5', color: '#383d41', padding: '8px 15px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Đang tải chi tiết đơn hàng...</h3>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <Link to="/my-orders" style={{ color: '#888', textDecoration: 'none' }}>
            <i className="fa fa-angle-left" style={{ marginRight: '5px' }}></i> Quay lại danh sách đơn hàng
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
              Chi Tiết Đơn Hàng #{order.orderCode}
            </h2>
            <p style={{ color: '#888', margin: 0 }}>
              Ngày đặt: {new Date(order.createdAt || Date.now()).toLocaleString('vi-VN')}
            </p>
          </div>
          <div>
            {getStatusBadge(order.orderStatus)}
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px', fontWeight: 'bold' }}>
                Danh sách sản phẩm
              </h4>
              
              <div className="order-products">
                {order.orderDetails?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <img src={item.thumbnailUrl || "/img/product01.png"} alt={item.productName} style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '4px', marginRight: '15px', border: '1px solid #eee' }} />
                      <div>
                        <Link to={`/product/${item.productId}`} style={{ fontWeight: '500', fontSize: '15px', color: '#333', textDecoration: 'none', display: 'block', marginBottom: '5px' }}>
                          {item.productName}
                        </Link>
                        <div style={{ color: '#888', fontSize: '13px' }}>
                          Số lượng: <span style={{ fontWeight: 'bold', color: '#333' }}>x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#C846C8', fontSize: '16px' }}>
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Điều kiện Hủy đơn */}
            {order.orderStatus === 'PENDING' && (
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Hủy đơn hàng</h5>
                  <p style={{ margin: '5px 0 0', color: '#888', fontSize: '13px' }}>Chỉ có thể hủy khi đơn hàng chưa được xác nhận.</p>
                </div>
                <button 
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#D10024', 
                    border: '1px solid #D10024', 
                    padding: '8px 20px', 
                    borderRadius: '4px', 
                    fontWeight: 'bold',
                    cursor: isCancelling ? 'not-allowed' : 'pointer',
                    opacity: isCancelling ? 0.7 : 1
                  }}
                >
                  {isCancelling ? 'Đang xử lý...' : 'HỦY ĐƠN HÀNG'}
                </button>
              </div>
            )}
          </div>

          <div className="col-md-4">
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px', fontWeight: 'bold' }}>
                Thông tin nhận hàng
              </h4>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>{order.receiverName}</div>
                <div style={{ color: '#555', marginBottom: '5px' }}><i className="fa fa-phone" style={{ width: '20px', color: '#C846C8' }}></i> {order.receiverPhone}</div>
                <div style={{ color: '#555', lineHeight: '1.5' }}><i className="fa fa-map-marker" style={{ width: '20px', color: '#C846C8' }}></i> {order.shippingAddress}</div>
              </div>
              
              {order.customerNote && (
                <div style={{ backgroundColor: '#F8E8FC', padding: '10px', borderRadius: '4px', marginTop: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#C846C8', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Ghi chú:</span>
                  <span style={{ color: '#555', fontSize: '13px' }}>{order.customerNote}</span>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px', fontWeight: 'bold' }}>
                Thanh toán
              </h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                <span>Phương thức:</span>
                <span style={{ fontWeight: '500', color: '#333' }}>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                <span>Trạng thái TT:</span>
                <span style={{ fontWeight: '500', color: order.paymentStatus === 'PAID' ? '#155724' : '#856404' }}>
                  {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              
              <hr style={{ borderColor: '#eee', margin: '15px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                <span>Tạm tính:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555' }}>
                <span>Phí vận chuyển:</span>
                <span>{order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Miễn phí'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '2px solid #f4f4f4' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Tổng cộng:</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#C846C8' }}>{formatPrice(order.totalAmount + (order.shippingFee || 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
