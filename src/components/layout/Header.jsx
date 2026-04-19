import React, { useEffect, useState, useContext } from "react";
import categoryService from "../../services/categoryService";
import { AuthContext } from "../../context/AuthContext";


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
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

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
              {isAuthenticated ? (
                <>
                  <li><a href="#"><i className="fa fa-user-o"></i>{user?.fullName}</a></li>
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
                  <form>
                    {/* TODO (Backend - Module Catalog): Tích hợp API Danh mục
                        - Gọi GET /api/v1/categories.
                        - Dùng hàm .map() duyệt mảng JSON trả về để tự động render ra các thẻ <option>.
                    */}
                    <select className="input-select">
                      <option value="0">All Categories</option>
                      <option value="1">Category 01</option>
                      <option value="1">Category 02</option>
                    </select>

                    {/* TODO (Backend - Module Catalog): Tích hợp Thanh tìm kiếm thông minh
                        - Bắt sự kiện onChange của input này.
                        - Áp dụng kỹ thuật Debounce (đợi 500ms sau khi ngừng gõ) rồi mới gọi API:
                          GET /api/v1/products?keyword={giá_trị_nhập}.
                        - Render một khối dropdown kết quả gợi ý ngay bên dưới ô tìm kiếm.
                    */}
                    <input className="input" placeholder="Search here" />
                    <button className="search-btn" type="button">Search</button>
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
                      <span>Your Cart</span>
                      {/* TODO (Backend - Module Order): Số lượng giỏ hàng
                          - Thay số '3' cứng bằng biến state {cartTotalItems}.
                          - Lấy data từ API GET /api/v1/orders/cart (cần có JWT Token).
                      */}
                      <div className="qty">3</div>
                    </a>

                    {/* TODO (Backend - Module Order): Chi tiết giỏ hàng thu nhỏ
                        - Khi hover/click mở dropdown này, dùng .map() duyệt qua mảng cart.items để render các <div className="product-widget">.
                        - Lấy hình ảnh (ProductImage), tên (ProductName), giá (Price) và số lượng (Quantity) đổ vào đây.
                        - Thay số $2940.00 bằng biến {cartTotalPrice} tính toán từ Backend trả về.
                    */}
                    <div className="cart-dropdown">
                      <div className="cart-list">
                        <div className="product-widget">
                          <div className="product-img">
                            <img src="/img/product01.png" alt="" />
                          </div>
                          <div className="product-body">
                            <h3 className="product-name"><a href="#">product name goes here</a></h3>
                            <h4 className="product-price"><span className="qty">1x</span>$980.00</h4>
                          </div>
                          <button className="delete"><i className="fa fa-close"></i></button>
                        </div>
                      </div>

                      <div className="cart-summary">
                        <small>3 Item(s) selected</small>
                        <h5>SUBTOTAL: $2940.00</h5>
                      </div>
                      <div className="cart-btns">
                        <a href="#">View Cart</a>
                        <a href="#">Checkout  <i className="fa fa-arrow-circle-right"></i></a>
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