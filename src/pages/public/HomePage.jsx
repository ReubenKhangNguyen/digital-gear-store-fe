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
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img"><img src="/img/shop01.png" alt="" /></div>
                <div className="shop-body">
                  <h3>Laptop<br/>Collection</h3>
                  <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img"><img src="/img/shop03.png" alt="" /></div>
                <div className="shop-body">
                  <h3>Accessories<br/>Collection</h3>
                  <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img"><img src="/img/shop02.png" alt="" /></div>
                <div className="shop-body">
                  <h3>Cameras<br/>Collection</h3>
                  <a href="#" className="cta-btn">Shop now <i className="fa fa-arrow-circle-right"></i></a>
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
