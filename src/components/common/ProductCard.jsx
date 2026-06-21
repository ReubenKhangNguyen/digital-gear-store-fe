import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

// Nhận các tham số (props) từ Component cha truyền xuống
export default function ProductCard({ id, name, price, oldPrice, imageUrl }) {
  const { addToCart } = useContext(CartContext);

  // Hàm định dạng tiền VNĐ
  const formatPrice = (amount) => {
    if (!amount) return "";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="product">
      <div className="product-img">
        {/* Render ảnh từ Cloudinary, dùng objectFit để ảnh không bị méo */}
        <img 
          src={imageUrl || "https://placehold.co/400x400/f8f9fa/adb5bd?text=No+Image"} 
          alt={name} 
          style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/f8f9fa/adb5bd?text=No+Image"; }}
        />
        <div className="product-label">
          {oldPrice && <span className="sale">-30%</span>}
        </div>
      </div>

      <div className="product-body">
        {/* TODO: Có thể nhận thêm categoryName từ props sau này */}
        <p className="product-category">Category</p>

        <h3 className="product-name" style={{ height: '40px', marginBottom: '10px' }}>
          {/* Link sang trang Chi tiết sản phẩm, dùng CSS line-clamp để ép luôn hiện 2 dòng */}
          <a 
            href={`/product/${id}`} 
            title={name} 
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', lineHeight: '20px' }}
          >
            {name || "Product Name"}
          </a>
        </h3>

        <h4 className="product-price">
          {formatPrice(price) || "$980.00"}
          {oldPrice && <del className="product-old-price" style={{ marginLeft: '8px' }}>{formatPrice(oldPrice)}</del>}
        </h4>

        <div className="product-rating">
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>

        <div className="product-btns">
          <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">add to wishlist</span></button>
          <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
          <button className="quick-view" onClick={() => window.location.href = `/product/${id}`}><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
        </div>
      </div>

      <div className="add-to-cart">
        <button className="add-to-cart-btn" onClick={() => addToCart(id, 1)}>
          <i className="fa fa-shopping-cart"></i> Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}