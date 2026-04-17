import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

import productService from "../../services/productService";




const specTranslations = {
  os: "Hệ điều hành",
  series: "Dòng sản phẩm",
  color: "Màu sắc",
  ram_capacity: "Dung lượng RAM",
  storage_capacity: "Dung lượng lưu trữ",
  screen_size: "Kích thước màn hình",

  // 1. Xử lý & Hiệu năng
  cpu_type: "Loại CPU / Chip",
  cpu_detail: "Chi tiết CPU / Chip xử lý",
  gpu: "Card đồ họa (GPU)",
  ram_detail: "Chi tiết RAM",
  storage_detail: "Chi tiết ổ cứng",

  // 2. Màn hình & Camera
  screen_detail: "Chi tiết màn hình",
  screen_tech: "Công nghệ màn hình",
  camera_rear: "Camera sau",
  camera_front: "Camera trước",
  webcam: "Webcam",

  // 3. Kết nối & Âm thanh
  sim: "Thẻ SIM & Mạng",
  wireless: "Kết nối không dây",
  ports: "Cổng kết nối",
  charging_port: "Cổng sạc",
  audio: "Âm thanh",

  // 4. Thiết kế & Năng lượng
  battery: "Pin & Sạc",             // Dành cho Laptop
  battery_detail: "Thông số Pin",   // Dành cho Điện thoại
  material: "Chất liệu",
  dimensions: "Kích thước",
  weight: "Trọng lượng",
  dimensions_weight: "Kích thước & Trọng lượng", // Dành cho Điện thoại

  // 5. Tính năng khác
  security: "Bảo mật",
  features: "Tính năng nổi bật"
};

const MainPrev = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <i className="fa fa-angle-left"></i>
  </button>
);

const MainNext = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <i className="fa fa-angle-right"></i>
  </button>
);

const ThumbPrev = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <i className="fa fa-angle-up"></i>
  </button>
);

const ThumbNext = ({ className, onClick }) => (
  <button className={className} onClick={onClick}>
    <i className="fa fa-angle-down"></i>
  </button>
);

export default function ProductDetailPage() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  
  const [reviews, _setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState("tab1");
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("X");
  const [selectedColor, setSelectedColor] = useState("Red");

  const Slick = Slider && Slider.default ? Slider.default : Slider;

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProductById(id);
        const data = response.data ? response.data : response;
        setProduct(data);
        
        setRelated([
          { id: 1, name: "Tai nghe Marshall", price: 2800000, oldPrice: 3000000, imageUrl: "/img/product01.png" },
          { id: 2, name: "Ốp lưng tai nghe", price: 200000, oldPrice: 250000, imageUrl: "/img/product02.png" },
        ]);

      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProductDetail();
  }, [id]);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleAddToCart = () => {
    const payload = {
      productId: product.id,
      quantity: quantity,
      options: { size: selectedSize, color: selectedColor } // Tạm thời gửi options tĩnh
    };
    console.log("Dữ liệu chuẩn bị gửi xuống Spring Boot:", payload);
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ!`);
  };

  if (isLoading) return <div className="text-center" style={{ padding: '100px' }}><h3>Đang tải dữ liệu sản phẩm...</h3></div>;
  if (!product) return <div className="text-center" style={{ padding: '100px' }}><h3>Không tìm thấy sản phẩm!</h3></div>;

  return (
    <>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li><a href="/">Home</a></li>
                <li><a href={`/store?categoryId=${product.category?.id}`}>{product.category?.name || "Danh mục"}</a></li>
                <li className="active">{product.name}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            
            <div className="col-md-5 col-md-push-2">
              <div id="product-main-img" style={{ position: "relative" }}>
                <Slick
                  asNavFor={nav2}
                  ref={(slider1) => setNav1(slider1)}
                  arrows={true}
                  slidesToShow={1}
                  fade={true}
                  prevArrow={<MainPrev />}
                  nextArrow={<MainNext />}
                >
                  {product.images?.map((img) => (
                    <div className="product-preview" key={img.id}>
                      <img src={img.imageUrl} alt={product.name} style={{ width: "100%", height: '400px', objectFit: "contain", transition: "transform .3s ease" }} />
                    </div>
                  ))}
                </Slick>
              </div>
            </div>

            <div className="col-md-2 col-md-pull-5">
              <div id="product-imgs">
                <Slick
                  asNavFor={nav1}
                  ref={(slider2) => setNav2(slider2)}
                  vertical={true}
                  verticalSwiping={true}
                  focusOnSelect={true}
                  slidesToShow={Math.min(3, product.images?.length || 1)} 
                  centerMode={true}
                  prevArrow={<ThumbPrev />}
                  nextArrow={<ThumbNext />}
                >
                  {product.images?.map((img) => (
                    <div className="product-preview" key={`thumb-${img.id}`}>
                      <img src={img.imageUrl} alt="thumb" style={{ width: "100%", height: '100px', objectFit: 'cover', cursor: "pointer" }} />
                    </div>
                  ))}
                </Slick>
              </div>
            </div>

            <div className="col-md-5">
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                
                <div>
                  <h3 className="product-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </h3>
                  <span className="product-available" style={{ color: product.stockQuantity > 0 ? '#D10024' : '#999' }}>
                    {product.stockQuantity > 0 ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </div>

                <p>{product.brand?.description}</p>

                <div className="product-options">
                  <label> Size
                    <select className="input-select" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      <option value="X">X</option>
                      <option value="XL">XL</option>
                    </select>
                  </label>
                  <label> Color
                    <select className="input-select" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                      <option value="Red">Red</option>
                      <option value="Black">Black</option>
                    </select>
                  </label>
                </div>

                <div className="add-to-cart">
                  <div className="qty-label"> Qty
                    <div className="input-number">
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                      />
                      <span className="qty-up" onClick={() => setQuantity(q => q + 1)}>+</span>
                      <span className="qty-down" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</span>
                    </div>
                  </div>
                  <button className="add-to-cart-btn" type="button" onClick={handleAddToCart} disabled={product.stockQuantity <= 0}>
                    <i className="fa fa-shopping-cart"></i> add to cart
                  </button>
                </div>
                
                <ul className="product-btns">
                  <li><a href="#"><i className="fa fa-heart-o"></i> add to wishlist</a></li>
                  <li><a href="#"><i className="fa fa-exchange"></i> add to compare</a></li>
                </ul>

                <ul className="product-links">
                  <li>Category:</li>
                  <li><a href={`/store?categoryId=${product.category?.id}`}>{product.category?.name?.toUpperCase()}</a></li>
                </ul>

                <ul className="product-links">
                  <li>Brand:</li>
                  <li><a href={`/store?brandId=${product.brand?.id}`}>{product.brand?.name?.toUpperCase()}</a></li>
                </ul>

                <ul className="product-links">
                  <li>Share:</li>
                  <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                  <li><a href="#"><i className="fa fa-envelope"></i></a></li>
                </ul>
                
              </div>
            </div>

            <div className="col-md-12">
              <div id="product-tab">
                <ul className="tab-nav">
                  <li className={activeTab === "tab1" ? "active" : ""}><a href="#tab1" onClick={(e)=>{e.preventDefault(); handleTabClick("tab1");}}>Description</a></li>
                  <li className={activeTab === "tab2" ? "active" : ""}><a href="#tab2" onClick={(e)=>{e.preventDefault(); handleTabClick("tab2");}}>Details</a></li>
                  <li className={activeTab === "tab3" ? "active" : ""}><a href="#tab3" onClick={(e)=>{e.preventDefault(); handleTabClick("tab3");}}>Reviews ({reviews.length})</a></li>
                </ul>

                <div className="tab-content">
                  <div className={`tab-pane fade in ${activeTab==="tab1"?"active":""}`}>
                    <div className="row">
                      <div className="col-md-12">
                        <p>{product.brand?.description} - Sản phẩm có mã SKU: <strong>{product.sku}</strong></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`tab-pane fade in ${activeTab==="tab2"?"active":""}`}>
                    <div className="row">
                      <div className="col-md-8 col-md-offset-2">
                        <table className="table table-striped" style={{ border: '1px solid #E4E7ED' }}>
                          <tbody>
                            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                              <tr key={key}>
                                <th style={{ width: '30%', padding: '12px', color: '#333' }}>
                                  {specTranslations[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </th>
                                <td style={{ padding: '12px', color: '#666' }}>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`tab-pane fade in ${activeTab==="tab3"?"active":""}`}>
                    <div className="row">
                      <div className="col-md-12">
                        <p>Chức năng đánh giá đang được cập nhật...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center"><h3 className="title">Related Products</h3></div>
            </div>
            {related.map((p, i) => (
              <div className="col-md-3 col-xs-6" key={i}>
                <ProductCard id={p.id} name={p.name} price={p.price} oldPrice={p.oldPrice} imageUrl={p.imageUrl} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}