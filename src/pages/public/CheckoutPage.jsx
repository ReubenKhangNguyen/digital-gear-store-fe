import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import userAddressService from '../../services/userAddressService';
import orderService from '../../services/orderService';
import AddressFormModal from '../../components/profile/AddressFormModal';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Phí vận chuyển giả lập
  const shippingFee = 0; 
  const totalAmount = totalPrice + shippingFee;

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const fetchAddresses = async () => {
    try {
      const response = await userAddressService.getMyAddresses();
      if (response && response.result) {
        setAddresses(response.result);
        
        // Chọn địa chỉ mặc định nếu có
        const defaultAddress = response.result.find(a => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (response.result.length > 0) {
          setSelectedAddressId(response.result[0].id);
        }
      }
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
      toast.error("Không thể tải danh sách địa chỉ.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Nếu giỏ hàng trống, quay về trang chủ hoặc giỏ hàng
    if (cartItems.length === 0 && !isLoading) {
      toast.info("Giỏ hàng của bạn đang trống!");
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [cartItems.length, navigate]);

  const handleOpenAddModal = () => setIsModalOpen(true);

  const handleFormSubmit = async (data) => {
    try {
      const res = await userAddressService.createAddress(data);
      toast.success("Thêm địa chỉ thành công!");
      setIsModalOpen(false);
      await fetchAddresses();
      
      // Tự động chọn địa chỉ mới vừa tạo
      if (res && res.result) {
        setSelectedAddressId(res.result.id);
      }
    } catch (error) {
      console.error("Lỗi lưu địa chỉ:", error);
      toast.error(error.response?.data?.message || "Lưu địa chỉ thất bại.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.warning("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod,
        customerNote: customerNote
      };

      const res = await orderService.checkout(orderData);
      
      if (res && res.result) {
        // Đặt hàng thành công
        toast.success("Đặt hàng thành công!");
        
        // Xóa giỏ hàng local
        clearCart();
        
        // Điều hướng sang trang Success
        navigate(`/checkout-success?order=${res.result.orderCode || res.result.id}`);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error(error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center" style={{ padding: '100px 0' }}>Đang tải thông tin...</div>;
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>Thanh Toán</h2>

        <div className="row">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
          <div className="col-md-7">
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f4f4f4', paddingBottom: '15px', marginBottom: '25px' }}>
                <h4 style={{ fontWeight: 'bold', margin: 0 }}>
                  <i className="fa fa-map-marker" style={{ color: '#C846C8', marginRight: '10px' }}></i> Địa Chỉ Giao Hàng
                </h4>
                <button onClick={handleOpenAddModal} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}>
                  <i className="fa fa-plus"></i> Thêm địa chỉ mới
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center" style={{ padding: '20px 0', color: '#888' }}>
                  <p>Bạn chưa có địa chỉ giao hàng nào.</p>
                  <button onClick={handleOpenAddModal} className="primary-btn" style={{ padding: '8px 20px', borderRadius: '4px' }}>Thêm ngay</button>
                </div>
              ) : (
                <div className="address-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {addresses.map(addr => (
                    <label 
                      key={addr.id} 
                      style={{ 
                        display: 'flex', alignItems: 'flex-start', padding: '15px', 
                        border: selectedAddressId === addr.id ? '2px solid #C846C8' : '1px solid #ddd', 
                        borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: selectedAddressId === addr.id ? '#F8E8FC' : '#fff',
                        margin: 0
                      }}
                    >
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.id} 
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: '5px', marginRight: '15px', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '10px' }}>{addr.receiverName}</span>
                          <span style={{ color: '#555' }}>({addr.receiverPhone})</span>
                          {addr.isDefault && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#C846C8', border: '1px solid #C846C8', padding: '1px 5px', borderRadius: '3px' }}>Mặc định</span>}
                        </div>
                        <div style={{ color: '#555' }}>{addr.specificAddress}</div>
                        <div style={{ color: '#555' }}>{addr.wardName}, {addr.districtName}, {addr.provinceName}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h4 style={{ borderBottom: '2px solid #f4f4f4', paddingBottom: '15px', marginBottom: '25px', fontWeight: 'bold' }}>
                <i className="fa fa-envelope-o" style={{ color: '#C846C8', marginRight: '10px' }}></i> Lời Nhắn Cho Người Bán
              </h4>
              <textarea 
                className="input" 
                placeholder="Lưu ý cho người bán (Ví dụ: Giao hàng vào giờ hành chính...)" 
                style={{ width: '100%', height: '100px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                value={customerNote}
                onChange={e => setCustomerNote(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="col-md-5">
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h4 style={{ borderBottom: '2px solid #f4f4f4', paddingBottom: '15px', marginBottom: '25px', fontWeight: 'bold' }}>
                Đơn Hàng Của Bạn
              </h4>

              <div className="order-items" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <img src={item.thumbnailUrl || "/img/product01.png"} alt={item.productName} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', marginRight: '15px', border: '1px solid #eee' }} />
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.productName}
                        </div>
                        <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Số lượng: {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#C846C8', marginLeft: '15px' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Phương thức thanh toán</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', padding: '10px 15px', border: paymentMethod === 'COD' ? '2px solid #C846C8' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'COD' ? '#F8E8FC' : '#fff' }}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ marginRight: '10px' }} />
                    <i className="fa fa-money" style={{ marginRight: '10px', fontSize: '20px', color: '#4caf50' }}></i>
                    <span style={{ fontWeight: '500' }}>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', padding: '10px 15px', border: paymentMethod === 'VNPAY' ? '2px solid #C846C8' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'VNPAY' ? '#F8E8FC' : '#fff' }}>
                    <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} style={{ marginRight: '10px' }} />
                    <i className="fa fa-credit-card" style={{ marginRight: '10px', fontSize: '20px', color: '#005baa' }}></i>
                    <span style={{ fontWeight: '500' }}>Thanh toán qua VNPAY (Demo)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', padding: '10px 15px', border: paymentMethod === 'MOMO' ? '2px solid #C846C8' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'MOMO' ? '#F8E8FC' : '#fff' }}>
                    <input type="radio" name="payment" value="MOMO" checked={paymentMethod === 'MOMO'} onChange={() => setPaymentMethod('MOMO')} style={{ marginRight: '10px' }} />
                    <i className="fa fa-mobile" style={{ marginRight: '10px', fontSize: '24px', color: '#a50064' }}></i>
                    <span style={{ fontWeight: '500' }}>Ví điện tử MoMo (Demo)</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#555' }}>Tổng tiền hàng:</span>
                  <span style={{ fontWeight: '500' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                  <span style={{ color: '#555' }}>Phí vận chuyển:</span>
                  <span style={{ fontWeight: '500' }}>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Tổng thanh toán:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#C846C8' }}>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isSubmitting || !selectedAddressId}
                className="primary-btn" 
                style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold', opacity: (isSubmitting || !selectedAddressId) ? 0.7 : 1, cursor: (isSubmitting || !selectedAddressId) ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm địa chỉ dùng chung */}
      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={null}
      />
    </div>
  );
}
