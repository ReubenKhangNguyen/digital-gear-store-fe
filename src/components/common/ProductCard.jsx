import React from 'react';

// Nhận các tham số (props) từ Component cha truyền xuống
export default function ProductCard({ id, name, price, oldPrice, imageUrl }) {
  
  // Hàm định dạng tiền VNĐ
  const formatPrice = (amount) => {
    if (!amount) return "";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="product">
      <div className="product-img">
        {/* Render ảnh từ Cloudinary, dùng objectFit để ảnh không bị méo */}
        <img src={imageUrl} alt={name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
        <div className="product-label">
          {oldPrice && <span className="sale">-30%</span>}
        </div>
      </div>
      
      <div className="product-body">
        {/* TODO: Có thể nhận thêm categoryName từ props sau này */}
        <p className="product-category">Category</p> 
        
        <h3 className="product-name">
          {/* Link sang trang Chi tiết sản phẩm, cắt chữ nếu quá dài */}
          <a href={`/product/${id}`} title={name}>
            {name ? (name.length > 50 ? name.substring(0, 47) + "..." : name) : "Product Name"}
          </a>
        </h3>
        
        <h4 className="product-price">
          {formatPrice(price) || "$980.00"} 
          {oldPrice && <del className="product-old-price" style={{marginLeft: '8px'}}>{formatPrice(oldPrice)}</del>}
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
          <button className="quick-view" onClick={() => window.location.href=`/product/${id}`}><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
        </div>
      </div>
      
      <div className="add-to-cart">
        {/* TODO (Module Order): Bắt sự kiện onClick thêm thẳng vào giỏ hàng */}
        <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
      </div>
    </div>
  );
}