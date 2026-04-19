import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

export default function ProductListPage() {
  const navigate = useNavigate();
  // -----------------------------------------------------------------------------
  // STATE LƯU TRỮ SẢN PHẨM Ở COMPONENT
  // - Khi API lấy được danh sách `ProductListResponseDTO.java`, nó sẽ được nạp vào
  //   biến `products` này để render ra lưới Table phía dưới.
  // -----------------------------------------------------------------------------
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect: Chạy đúng 1 lần khi màn hình này vừa bật lên (Nhờ có mảng [] ở cuối)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        const data = response.result || response;
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý Sản phẩm</h2>
          <p style={{ color: '#8D99AE' }}>Danh sách sản phẩm trong kho của bạn.</p>
        </div>
        <button className="primary-btn" onClick={() => navigate('/admin/products/create')}>
          <i className="fa fa-plus"></i> Thêm Sản phẩm mới
        </button>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ width: '300px' }}>
            <input type="text" className="input" placeholder="Search products..." />
          </div>
          <div>
            <select className="input" style={{ width: '200px' }}>
              <option value="">Lọc theo danh mục...</option>
              <option value="Laptop">Laptop</option>
              <option value="Smartphone">Smartphone</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}><input type="checkbox" /></th>
                  <th style={{ width: '80px' }}>Hình ảnh</th>
                  <th>Tên Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá gốc</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const mainImage = product.thumbnailUrl;
                  return (
                    <tr key={product.id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        {mainImage ? (
                          <img src={mainImage} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'contain', backgroundColor: '#f4f4f4', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#eaeaea', borderRadius: '4px', textAlign:'center', lineHeight: '50px', fontSize:'12px'}}>No Img</div>
                        )}
                      </td>
                      <td style={{ fontWeight: '600' }}>{product.name}</td>
                      <td>{product.categoryName || '--'}</td>
                      <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                      <td>{product.stockQuantity || '--'}</td>
                      <td>
                        {product.status === 'ACTIVE' && <span className="badge-success">Active</span>}
                        {product.status === 'OUT_OF_STOCK' && <span className="badge-danger" style={{backgroundColor: '#f39c12'}}>Out of Stock</span>}
                        {product.status === 'DISCONTINUED' && <span className="badge-danger">Discontinued</span>}
                        {!product.status && (
                          <span className={product.stockQuantity > 0 || product.stockQuantity === undefined ? "badge-success" : "badge-danger"}>
                            {product.stockQuantity > 0 || product.stockQuantity === undefined ? "In Stock" : "Out of Stock"}
                          </span>
                        )}
                      </td>
                      <td>
                        <button className="action-btn edit" title="Edit"><i className="fa fa-edit"></i></button>
                        <button className="action-btn delete" title="Delete"><i className="fa fa-trash"></i></button>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr><td colSpan="8" style={{ textAlign: 'center' }}>Chưa có sản phẩm nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination mock */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <ul className="store-pagination" style={{ margin: 0 }}>
            <li className="active">1</li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#"><i className="fa fa-angle-right"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
