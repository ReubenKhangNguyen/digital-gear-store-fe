import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.result || response);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      toast.error('Không thể tải lịch sử đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span style={{ backgroundColor: '#cce5ff', color: '#004085', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã xác nhận</span>;
      case 'SHIPPING':
        return <span style={{ backgroundColor: '#d1ecf1', color: '#0c5460', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đang giao</span>;
      case 'COMPLETED':
        return <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Thành công (Đã giao)</span>;
      case 'DELIVERY_FAILED':
        return <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Giao thất bại</span>;
      case 'CANCELLED':
        return <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã hủy</span>;
      case 'RETURNED':
        return <span style={{ backgroundColor: '#e2e3e5', color: '#383d41', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã hoàn trả</span>;
      default:
        return <span style={{ backgroundColor: '#e2e3e5', color: '#383d41', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3>Đang tải lịch sử đơn hàng...</h3>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Đơn Hàng Của Tôi</h2>
            <p style={{ color: '#888' }}>Quản lý và theo dõi trạng thái các đơn hàng bạn đã đặt</p>
          </div>
          <Link to="/store" className="primary-btn" style={{ padding: '10px 20px', borderRadius: '4px' }}>
            Tiếp Tục Mua Sắm
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '50px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <i className="fa fa-shopping-bag" style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px' }}></i>
            <h4 style={{ color: '#555' }}>Bạn chưa có đơn hàng nào</h4>
            <p style={{ color: '#888', marginBottom: '20px' }}>Cùng khám phá hàng ngàn sản phẩm công nghệ đang chờ bạn!</p>
            <Link to="/store" className="primary-btn" style={{ borderRadius: '30px', padding: '10px 30px' }}>
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div className="table-responsive">
              <table className="table" style={{ marginBottom: 0 }}>
                <thead style={{ backgroundColor: '#F8E8FC' }}>
                  <tr>
                    <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#C846C8' }}>Mã Đơn</th>
                    <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#C846C8' }}>Ngày Đặt</th>
                    <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#C846C8' }}>Sản Phẩm</th>
                    <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#C846C8' }}>Tổng Tiền</th>
                    <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#C846C8' }}>Trạng Thái</th>
                    <th style={{ padding: '15px 20px', borderBottom: 'none', color: '#C846C8', textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ padding: '20px', verticalAlign: 'middle', fontWeight: 'bold' }}>
                        {order.orderCode}
                      </td>
                      <td style={{ padding: '20px', verticalAlign: 'middle', color: '#666' }}>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                        {order.orderDetails && order.orderDetails.length > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img 
                              src={order.orderDetails[0].thumbnailUrl || "/img/product01.png"} 
                              alt="product" 
                              style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px', marginRight: '10px' }} 
                            />
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '200px' }}>
                                {order.orderDetails[0].productName}
                              </div>
                              {order.orderDetails.length > 1 && (
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                                  + {order.orderDetails.length - 1} sản phẩm khác
                                </div>
                              )}
                            </div>
                          </div>
                        ) : '---'}
                      </td>
                      <td style={{ padding: '20px', verticalAlign: 'middle', color: '#C846C8', fontWeight: 'bold' }}>
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                        {getStatusBadge(order.orderStatus)}
                      </td>
                      <td style={{ padding: '20px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <Link 
                          to={`/my-orders/${order.id}`} 
                          className="btn btn-outline-primary btn-sm"
                          style={{ borderRadius: '20px', padding: '5px 15px', color: '#C846C8', borderColor: '#C846C8' }}
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
