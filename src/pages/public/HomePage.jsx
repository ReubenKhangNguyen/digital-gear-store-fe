import React from "react";
import ProductCard from "../../components/common/ProductCard";

// TODO (Backend): Gọi API GET /api/v1/products?sort=newest và GET /api/v1/products?sort=top_selling
// Sử dụng Axios trong useEffect để lấy List<ProductResponseDTO> và truyền xuống ProductCard
export default function HomePage() {
  const newProducts = [
    { id: 1, imageUrl: "/img/product01.png" },
    { id: 2, imageUrl: "/img/product02.png" },
    { id: 3, imageUrl: "/img/product03.png" },
    { id: 4, imageUrl: "/img/product04.png" }
  ];

  const topSelling = [
    { id: 5, imageUrl: "/img/product06.png" },
    { id: 6, imageUrl: "/img/product07.png" },
    { id: 7, imageUrl: "/img/product08.png" },
    { id: 8, imageUrl: "/img/product09.png" }
  ];

  return (
    <>
      <div id="hero-banner" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="hero-flex-layout">
                <div className="hero-content">
                  <h1>Trải Nghiệm<br />Công Nghệ Thế Hệ Mới</h1>
                  <p>Khám phá bộ sưu tập laptop, điện thoại và máy ảnh chuyên nghiệp mới nhất. Nâng tầm phong cách sống của bạn ngay hôm nay.</p>
                  <a href="#" className="btn-premium">Mua Sắm Ngay</a>
                </div>
                <div className="hero-image">
                  <img src="/img/product01.png" alt="Premium Headphone" />
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
              <div className="section-title"><h3 className="title">New Products</h3></div>
            </div>

            <div className="col-md-12">
              <div className="row">
                {/* // TODO (Backend): Gọi API GET /api/v1/products?sort=newest - Module Catalog */}
                {newProducts.map(p => (
                  <div key={p.id} className="col-md-3 col-xs-6">
                    <ProductCard id={p.id} imageUrl={p.imageUrl} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="hot-deal" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="hot-deal">
                <ul className="hot-deal-countdown">
                  <li><div><h3>02</h3><span>Days</span></div></li>
                  <li><div><h3>10</h3><span>Hours</span></div></li>
                  <li><div><h3>34</h3><span>Mins</span></div></li>
                  <li><div><h3>60</h3><span>Secs</span></div></li>
                </ul>
                <h2 className="text-uppercase">hot deal this week</h2>
                <p>New Collection Up to 50% OFF</p>
                <a className="primary-btn cta-btn" href="#">Shop now</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title"><h3 className="title">Top selling</h3></div>
            </div>
            <div className="col-md-12">
              <div className="row">
                {/* // TODO (Backend): Gọi API GET /api/v1/products?sort=top_selling - Module Catalog */}
                {topSelling.map(p => (
                  <div key={p.id} className="col-md-3 col-xs-6">
                    <ProductCard id={p.id} imageUrl={p.imageUrl} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
