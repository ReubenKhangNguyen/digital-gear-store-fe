import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminOrderService from '../../services/adminOrderService';
import { formatPrice } from '../../utils/formatters';

export default function AdminOrderListPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State cho chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNumber) => {
    setIsLoading(true);
    try {
      // Gọi API lấy danh sách đơn (mặc định 10 đơn 1 trang, sắp xếp mới nhất)
      const response = await adminOrderService.getAllOrders(pageNumber, 10, 'createdAt', 'desc');
      const data = response.result || response;
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      toast.error("Không thể tải dữ liệu đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminOrderService.updateOrderStatus(orderId, newStatus);
      toast.success("Cập nhật trạng thái thành công!");
      // Cập nhật state trực tiếp để UI thay đổi mà ko cần fetch lại toàn bộ
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      // Nếu đang mở Modal, cũng cập nhật status trong Modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderDetail = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING': return { bg: '#fff3cd', color: '#856404' }; // Vàng
      case 'CONFIRMED': return { bg: '#cce5ff', color: '#004085' }; // Xanh dương
      case 'SHIPPING': return { bg: '#d1ecf1', color: '#0c5460' }; // Xanh cyan
      case 'COMPLETED': return { bg: '#d4edda', color: '#155724' }; // Xanh lá
      case 'DELIVERY_FAILED': return { bg: '#f8d7da', color: '#721c24' }; // Đỏ nhạt
      case 'CANCELLED': return { bg: '#f8d7da', color: '#721c24' }; // Đỏ
      case 'RETURNED': return { bg: '#e2e3e5', color: '#383d41' }; // Xám
      default: return { bg: '#e2e3e5', color: '#383d41' }; // Xám
    }
  };

  // Mảng chứa cấu hình cho Dropdown Select
  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'COMPLETED', label: 'Thành công (Đã giao)' },
    { value: 'DELIVERY_FAILED', label: 'Giao thất bại' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'RETURNED', label: 'Đã hoàn trả' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Quản lý Đơn hàng</h2>
      </div>

      <div className="admin-card">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>Đang tải dữ liệu...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th style={{ width: '200px' }}>Chuyển trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Không có đơn hàng nào.</td>
                  </tr>
                ) : (
                  orders.map(order => {
                    const badgeStyle = getStatusBadgeColor(order.orderStatus);
                    return (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 'bold' }}>{order.orderCode}</td>
                        <td>{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                        <td>
                          <div>{order.receiverName}</div>
                          <small style={{ color: '#888' }}>{order.receiverPhone}</small>
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#D10024' }}>
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td>
                          <span style={{ 
                            backgroundColor: badgeStyle.bg, 
                            color: badgeStyle.color, 
                            padding: '4px 10px', 
                            borderRadius: '4px', 
                            fontSize: '12px', 
                            fontWeight: 'bold',
                            display: 'inline-block'
                          }}>
                            {statusOptions.find(o => o.value === order.orderStatus)?.label || order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="input-select"
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                            disabled={['COMPLETED', 'CANCELLED', 'RETURNED', 'DELIVERY_FAILED'].includes(order.orderStatus)}
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => openOrderDetail(order)}
                            style={{ background: 'transparent', border: 'none', color: '#005baa', cursor: 'pointer', fontSize: '18px' }}
                            title="Xem chi tiết"
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '5px' }}>
            <button 
              disabled={page === 0} 
              onClick={() => setPage(page - 1)}
              style={{ padding: '5px 15px', border: '1px solid #ddd', background: page === 0 ? '#f4f4f4' : '#fff', borderRadius: '4px', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i)}
                style={{ 
                  padding: '5px 15px', 
                  border: '1px solid #ddd', 
                  background: page === i ? '#D10024' : '#fff', 
                  color: page === i ? '#fff' : '#333',
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                {i + 1}
              </button>
            ))}

            <button 
              disabled={page === totalPages - 1} 
              onClick={() => setPage(page + 1)}
              style={{ padding: '5px 15px', border: '1px solid #ddd', background: page === totalPages - 1 ? '#f4f4f4' : '#fff', borderRadius: '4px', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* POPUP: CHI TIẾT ĐƠN HÀNG */}
      {isModalOpen && selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#fff', width: '800px', maxWidth: '95%', maxHeight: '90vh', 
            borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Chi tiết đơn hàng #{selectedOrder.orderCode}</h3>
              <button onClick={closeOrderDetail} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto' }}>
              <div className="row">
                <div className="col-md-6">
                  <h5 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Thông tin khách hàng</h5>
                  <p><strong>Người nhận:</strong> {selectedOrder.receiverName}</p>
                  <p><strong>SĐT:</strong> {selectedOrder.receiverPhone}</p>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                  {selectedOrder.customerNote && <p><strong>Ghi chú:</strong> <span style={{ color: '#D10024' }}>{selectedOrder.customerNote}</span></p>}
                </div>
                <div className="col-md-6">
                  <h5 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Thông tin thanh toán</h5>
                  <p><strong>Phương thức TT:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Trạng thái TT:</strong> <span style={{ color: selectedOrder.paymentStatus === 'PAID' ? 'green' : 'red' }}>{selectedOrder.paymentStatus}</span></p>
                  <p><strong>Phí giao hàng:</strong> {formatPrice(selectedOrder.shippingFee)}</p>
                  <p><strong>Tổng tiền:</strong> <strong style={{ color: '#D10024', fontSize: '18px' }}>{formatPrice(selectedOrder.totalAmount + (selectedOrder.shippingFee || 0))}</strong></p>
                </div>
              </div>

              <hr />

              <h5 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Sản phẩm đã đặt</h5>
              <table className="table table-bordered">
                <thead style={{ background: '#f4f4f4' }}>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th style={{ textAlign: 'center' }}>Đơn giá</th>
                    <th style={{ textAlign: 'center' }}>SL</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderDetails?.map(item => (
                    <tr key={item.id}>
                      <td style={{ verticalAlign: 'middle' }}>{item.productName}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                         <img src={item.thumbnailUrl || "/img/product01.png"} alt="img" style={{ width: '40px', height: '40px', objectFit: 'contain' }}/>
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{formatPrice(item.priceAtPurchase)}</td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'right', fontWeight: 'bold' }}>{formatPrice(item.priceAtPurchase * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'right', backgroundColor: '#f9f9f9' }}>
              <button onClick={closeOrderDetail} className="btn btn-secondary" style={{ padding: '8px 20px', borderRadius: '4px' }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
