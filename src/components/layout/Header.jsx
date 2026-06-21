import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../../services/categoryService";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";


// =========================================================
// HÀM TẠO MENU (KHÓA ĐỆ QUY TỐI ĐA 2 CẤP)
// =========================================================
const MenuItem = ({ category, depth = 1 }) => {
  // Chỉ cho phép hiển thị dropdown nếu đang ở Cấp 1 VÀ có danh mục con
  const isLevel1 = depth === 1;
  const hasChildren = category.categoryChild && category.categoryChild.length > 0;
  const showDropdown = isLevel1 && hasChildren;

  return (
    <li className={showDropdown ? "dropdown" : ""}>
      <a
        href={`/store?categoryId=${category.id}`}
        className={showDropdown ? "dropdown-toggle" : ""}
        data-toggle={showDropdown ? "dropdown" : ""}
        aria-expanded="false"
      >
        {category.name}

        {/* CHỈ hiện mũi tên nếu là danh mục Cấp 1 có chứa menu con */}
        {showDropdown && <i className="fa fa-angle-down" style={{ marginLeft: '5px' }}></i>}
      </a>

      {/* NẾU đủ điều kiện (Cấp 1 có con), thì mới render menu Cấp 2 */}
      {showDropdown && (
        <ul className="dropdown-menu" style={{ minWidth: '200px', backgroundColor: '#fff', border: '1px solid #ddd', padding: '10px 0' }}>
          {category.categoryChild.map((child) => (
            // Gọi lại MenuItem cho Cấp 2, truyền depth + 1 (tức là depth = 2)
            <MenuItem key={child.id} category={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

// =========================================================
// MAIN HEADER COMPONENT
// =========================================================
export default function Header() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const { isAuthenticated, user, logout, isLoading } = useContext(AuthContext);
  const { cartItems, totalQuantity, totalPrice, removeCartItem } = useContext(CartContext);

  const formatPrice = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategoryTree();
        const categoryData = response.result || response;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);

        // --- FALLBACK MOCK DATA (Phòng khi Backend chết, UI vẫn có cái để xem) ---
        // setCategories([...cục JSON em vừa đưa anh copy vào đây...]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <header>
        <div id="top-header">
          {/* ... (Giữ nguyên cấu trúc Top Header của em) ... */}
          <div className="container">
            <ul className="header-links pull-left">
              <li><a href="#"><i className="fa fa-phone"></i> +021-95-51-84</a></li>
              <li><a href="#"><i className="fa fa-envelope-o"></i> email@email.com</a></li>
            </ul>
            <ul className="header-links pull-right">
              {
                isLoading ? (
                  <li><a href="#"><i className="fa fa-spinner fa-spin"></i> Đang tải...</a></li>
                ) : isAuthenticated ? (
                  <>
                    {/* Chỉ render dòng <li> này nếu user là ADMIN */}
                    {user?.roles?.includes('ADMIN') && (
                      <li>
                        <Link to="/admin">
                          <i className="fa fa-cog"></i> Trang Quản Trị
                        </Link>
                      </li>
                    )}
                    <li><Link to="/profile"><i className="fa fa-user-o"></i> {user?.fullName}</Link></li>
                    <li><Link to="/my-orders"><i className="fa fa-shopping-bag"></i> Đơn hàng của tôi</Link></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); }}><i className="fa fa-sign-out"></i> Đăng xuất</a></li>
                  </>
                ) : (
                  <>
                    <li><a href="/login"><i className="fa fa-user-o"></i> Đăng nhập</a></li>
                    <li><a href="/register"><i className="fa fa-user-plus"></i> Đăng ký</a></li>
                  </>
                )}
            </ul>
          </div>
        </div>

        <div id="header">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="header-logo">
                  
                  <a href="/" className="logo"><img src="/img/logo.png" alt="KhangTrí Tech" /></a>
                </div>
              </div>

              <div className="col-md-6">
                <div className="header-search">
                  <form style={{ display: 'flex' }} onSubmit={(e) => {
                    e.preventDefault();
                    let url = `/store?keyword=${encodeURIComponent(searchKeyword.trim())}`;
                    if (searchCategory) url += `&categoryIds=${searchCategory}`;
                    navigate(url);
                  }}>
                    <select className="input-select" value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    <input className="input" placeholder="Search here" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
                    <button className="search-btn" type="submit">Search</button>
                  </form>
                </div>
              </div>

              <div className="col-md-3 clearfix">
                <div className="header-ctn">

                  {/* TODO (Backend - Module Recommendation): Cải tạo thành Gợi ý thông minh
                      - Đổi icon fa-heart-o thành tia sét (fa-magic hoặc fa-bolt).
                      - Đổi chữ "Your Wishlist" thành "Gợi ý cho bạn".
                      - Ẩn thẻ <div className="qty"> đi.
                      - Khi click: Gửi JWT Token gọi GET /api/v1/recommendations/personalized để mở popup hoặc chuyển sang trang Gợi ý.
                  */}
                  <div>
                    <a href="#">
                      <i className="fa fa-heart-o"></i>
                      <span>Your Wishlist</span>
                      <div className="qty">2</div>
                    </a>
                  </div>

                  <div className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" href="#">
                      <i className="fa fa-shopping-cart"></i>
                      <span>Giỏ Hàng</span>
                      <div className="qty">{totalQuantity}</div>
                    </a>

                    <div className="cart-dropdown">
                      <div className="cart-list">
                        {cartItems.slice(0, 5).map((item) => (
                          <div className="product-widget" key={item.id}>
                            <div className="product-img">
                              <img src={item.thumbnailUrl || "/img/product01.png"} alt={item.productName} />
                            </div>
                            <div className="product-body">
                              <h3 className="product-name"><Link to={`/product/${item.productId}`}>{item.productName}</Link></h3>
                              <h4 className="product-price"><span className="qty">{item.quantity}x</span>{formatPrice(item.price)}</h4>
                            </div>
                            <button className="delete" onClick={() => removeCartItem(item.id)}>
                              <i className="fa fa-close"></i>
                            </button>
                          </div>
                        ))}
                      </div>

                      {cartItems.length > 5 && (
                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#888' }}>
                          Và {cartItems.length - 5} sản phẩm khác trong giỏ...
                        </div>
                      )}

                      <div className="cart-summary">
                        <small>{totalQuantity} Item(s) selected</small>
                        <h5>SUBTOTAL: {formatPrice(totalPrice)}</h5>
                      </div>
                      <div className="cart-btns">
                        <Link to="/cart">Xem Giỏ Hàng</Link>
                        <Link to="/checkout">Checkout  <i className="fa fa-arrow-circle-right"></i></Link>
                      </div>
                    </div>
                  </div>

                  <div className="menu-toggle">
                    <a href="#">
                      <i className="fa fa-bars"></i>
                      <span>Menu</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* THANH MENU ĐỘNG LẤY TỪ SPRING BOOT */}
      <nav id="navigation">
        <div className="container">
          <div id="responsive-nav">
            <ul className="main-nav nav navbar-nav">
              <li className="active"><a href="/">Trang chủ</a></li>

              {/* Truyền dữ liệu vào Hàm đệ quy */}
              {categories.map((cat) => (
                <MenuItem key={cat.id} category={cat} />
              ))}

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}