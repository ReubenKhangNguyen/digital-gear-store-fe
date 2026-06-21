import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

import categoryService from '../../services/categoryService';

export default function ProductListPage() {
  const navigate = useNavigate();
  // -----------------------------------------------------------------------------
  // STATE LƯU TRỮ SẢN PHẨM Ở COMPONENT
  // -----------------------------------------------------------------------------
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Search States
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoriesTree, setCategoriesTree] = useState([]);

  // Hàm đệ quy lấy tất cả ID con của một danh mục
  const getAllDescendantCategoryIds = (catId, tree) => {
    let result = new Set();
    if (!catId) return [];
    result.add(Number(catId));
    const findChildren = (cats) => {
      cats.forEach(cat => {
        if (result.has(cat.id) || result.has(cat.parentId)) {
          result.add(cat.id);
          if (cat.categoryChild) findChildren(cat.categoryChild);
        } else {
          if (cat.categoryChild) findChildren(cat.categoryChild);
        }
      });
    };
    findChildren(tree);
    findChildren(tree); // 2 lần để đảm bảo lấy hết cấp sâu hơn
    return Array.from(result);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        size,
        keyword: keyword || undefined
      };
      
      if (categoryId) {
        const expandedIds = getAllDescendantCategoryIds(categoryId, categoriesTree);
        params.categoryIds = expandedIds.join(',');
      }

      const response = await productService.searchProducts(params);
      if (response.result && response.result.content) {
        setProducts(response.result.content);
        setTotalPages(response.result.totalPages);
      } else {
        setProducts([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategoryTree();
      if (res.result) setCategoriesTree(res.result);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [keyword, categoryId, page, size, categoriesTree]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn ngừng kinh doanh (Xóa mềm) sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        alert('Đã xóa sản phẩm thành công!');
        fetchProducts();
      } catch (error) {
        console.error("Lỗi khi xóa Product:", error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa!');
      }
    }
  };

  // Render Category Options (chỉ lấy level 1 và 2 cho ngắn gọn)
  const renderCategoryOptions = () => {
    const options = [];
    categoriesTree.forEach(cat => {
      options.push(<option key={cat.id} value={cat.id}>{cat.name}</option>);
      if (cat.categoryChild) {
        cat.categoryChild.forEach(child => {
          options.push(<option key={child.id} value={child.id}>-- {child.name}</option>);
        });
      }
    });
    return options;
  };

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
            <input 
              type="text" 
              className="input" 
              placeholder="Search products..." 
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setPage(0); }}
            />
          </div>
          <div>
            <select 
              className="input" 
              style={{ width: '200px' }}
              value={categoryId}
              onChange={e => { setCategoryId(e.target.value); setPage(0); }}
            >
              <option value="">Lọc theo danh mục...</option>
              {renderCategoryOptions()}
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
                        <button className="action-btn edit" title="Edit" onClick={() => navigate(`/admin/products/update/${product.id}`)}><i className="fa fa-edit"></i></button>
                        <button className="action-btn delete" title="Delete" onClick={() => handleDelete(product.id)}><i className="fa fa-trash"></i></button>
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
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <ul className="store-pagination" style={{ margin: 0 }}>
              {page > 0 && (
                <li><a href="#" onClick={(e) => { e.preventDefault(); setPage(page - 1); }}><i className="fa fa-angle-left"></i></a></li>
              )}
              {Array.from({ length: totalPages }).map((_, i) => (
                <li key={i} className={page === i ? "active" : ""}>
                  {page === i ? (
                    i + 1
                  ) : (
                    <a href="#" onClick={(e) => { e.preventDefault(); setPage(i); }}>{i + 1}</a>
                  )}
                </li>
              ))}
              {page < totalPages - 1 && (
                <li><a href="#" onClick={(e) => { e.preventDefault(); setPage(page + 1); }}><i className="fa fa-angle-right"></i></a></li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
