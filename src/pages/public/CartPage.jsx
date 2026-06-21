import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, totalQuantity, totalPrice, updateCartItem, removeCartItem, clearCart, isLoading, isUpdating } = useContext(CartContext);

  const formatPrice = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return <div className="text-center" style={{ padding: '100px 0' }}>Đang tải giỏ hàng...</div>;
  }

  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 style={{ marginBottom: '30px', fontWeight: 'bold' }}>Giỏ Hàng Của Bạn</h2>

            {cartItems.length === 0 ? (
              <div className="text-center" style={{ padding: '50px 0', backgroundColor: '#fbfbfb', borderRadius: '8px' }}>
                <i className="fa fa-shopping-cart" style={{ fontSize: '60px', color: '#ddd', marginBottom: '20px' }}></i>
                <h4>Giỏ hàng trống</h4>
                <p>Không có sản phẩm nào trong giỏ hàng của bạn.</p>
                <Link to="/store" className="primary-btn mt-3">Tiếp Tục Mua Sắm</Link>
              </div>
            ) : (
              <>
                <div className="table-responsive" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
                  <table className="table">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th style={{ width: '150px', textAlign: 'center' }}>Số lượng</th>
                        <th>Thành tiền</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id}>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <img 
                                src={item.thumbnailUrl || "/img/product01.png"} 
                                alt={item.productName} 
                                style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px' }} 
                              />
                              <Link to={`/product/${item.productId}`} style={{ fontWeight: '500', color: '#2B2D42' }}>
                                {item.productName}
                              </Link>
                            </div>
                          </td>
                          <td style={{ verticalAlign: 'middle', color: '#C846C8', fontWeight: 'bold' }}>
                            {formatPrice(item.price)}
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div className="input-number" style={{ width: '100px', margin: '0 auto' }}>
                              <input 
                                type="number" 
                                value={item.quantity} 
                                readOnly 
                              />
                              <span 
                                className="qty-up" 
                                style={{ cursor: (item.quantity >= item.availableQuantity || isUpdating) ? 'not-allowed' : 'pointer', opacity: (item.quantity >= item.availableQuantity || isUpdating) ? 0.5 : 1 }}
                                onClick={() => {
                                  if (item.quantity < item.availableQuantity && !isUpdating) {
                                    updateCartItem(item.id, item.quantity + 1);
                                  }
                                }}
                              >+</span>
                              <span 
                                className="qty-down" 
                                style={{ cursor: (item.quantity <= 1 || isUpdating) ? 'not-allowed' : 'pointer', opacity: (item.quantity <= 1 || isUpdating) ? 0.5 : 1 }}
                                onClick={() => {
                                  if (item.quantity > 1 && !isUpdating) {
                                    updateCartItem(item.id, item.quantity - 1);
                                  }
                                }}
                              >-</span>
                            </div>
                          </td>
                          <td style={{ verticalAlign: 'middle', color: '#C846C8', fontWeight: 'bold' }}>
                            {formatPrice(item.price * item.quantity)}
                          </td>
                          <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                            <button 
                              onClick={() => removeCartItem(item.id)}
                              style={{ border: 'none', background: 'transparent', color: '#C846C8', fontSize: '18px', cursor: 'pointer' }}
                              title="Xóa"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="row" style={{ marginTop: '30px' }}>
                  <div className="col-md-6">
                    <button 
                      onClick={clearCart} 
                      className="btn" 
                      style={{ backgroundColor: '#fff', border: '1px solid #ddd', color: '#333', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <i className="fa fa-trash-o" style={{ marginRight: '8px' }}></i>
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="col-md-6" style={{ textAlign: 'right' }}>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)', display: 'inline-block', minWidth: '300px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <span style={{ fontSize: '16px', color: '#333' }}>Tổng số lượng:</span>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{totalQuantity}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Tổng tiền:</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#C846C8' }}>{formatPrice(totalPrice)}</span>
                      </div>
                      <Link 
                        to="/checkout"
                        className="primary-btn" 
                        style={{ width: '100%', display: 'block', textAlign: 'center' }}
                      >
                        Tiến Hành Thanh Toán
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
