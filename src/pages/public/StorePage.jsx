import React, { useState, useEffect } from "react";
import ProductCard from "../../components/common/ProductCard";

// Import service gọi API Spring Boot
import categoryService from "../../services/categoryService"; 
import brandService from "../../services/brandService"; 
import productService from "../../services/productService"; 


const SidebarCategoryItem = ({ category, selectedIds, onToggleCheck }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.categoryChild && category.categoryChild.length > 0;

  return (
    <div style={{ marginLeft: '15px', marginTop: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
        {hasChildren ? (
          <i 
            className={`fa ${isOpen ? 'fa-minus-square-o' : 'fa-plus-square-o'}`} 
            style={{ 
              cursor: 'pointer', 
              marginRight: '10px', 
              color: isOpen ? '#C026D3' : '#475569', 
              fontSize: '16px', 
              transform: 'translateY(-2px)' 
            }}
            onClick={() => setIsOpen(!isOpen)}
          ></i>
        ) : (
          <span style={{ width: '22px', marginRight: '10px' }}></span> 
        )}

        <div className="input-checkbox" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            id={`cat-filter-${category.id}`} 
            checked={selectedIds.includes(category.id)}
            onChange={() => onToggleCheck(category.id)}
          />
          <label 
            htmlFor={`cat-filter-${category.id}`} 
            style={{ fontWeight: isOpen ? 'bold' : 'normal', cursor: 'pointer', marginBottom: 0 }}
          >
            <span></span>
            {category.name}
          </label>
        </div>
      </div>

      {/* Đệ quy nhánh con */}
      {hasChildren && isOpen && (
        <div className="category-children" style={{ borderLeft: '1px dashed #CBD5E1', marginLeft: '6px', paddingTop: '5px' }}>
          {category.categoryChild.map(child => (
            <SidebarCategoryItem 
              key={child.id} 
              category={child} 
              selectedIds={selectedIds} 
              onToggleCheck={onToggleCheck} 
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default function StorePage() {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const [brands, setBrands] = useState([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await categoryService.getCategoryTree();
        setCategoriesTree(response.data ? response.data : response);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await brandService.getAllBrands();
        setBrands(response.data ? response.data : response);
      } catch (error) {
        console.error("Lỗi lấy thương hiệu:", error);
      }
    };

    fetchTree();
    fetchBrands();
  }, []);

  const handleToggleCheck = (categoryId) => {
    setSelectedCategoryIds((prevIds) => {
      if (prevIds.includes(categoryId)) {
        return prevIds.filter(id => id !== categoryId);
      } else {
        return [...prevIds, categoryId];
      }
    });
  };

  const handleToggleBrand = (brandId) => {
    setSelectedBrandIds((prevIds) => {
      if (prevIds.includes(brandId)) {
        return prevIds.filter(id => id !== brandId);
      } else {
        return [...prevIds, brandId];
      }
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const params = {};
        if (selectedCategoryIds.length > 0) params.categoryIds = selectedCategoryIds.join(',');
        if (selectedBrandIds.length > 0) params.brandIds = selectedBrandIds.join(',');

        const response = await productService.getProducts(params);
        const productData = response.data ? response.data : response;
        setProducts(productData);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryIds, selectedBrandIds]);

  return (
    <>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li><a href="#">Home</a></li>
                <li><a href="#">All Categories</a></li>
                <li><a href="#">Accessories</a></li>
                <li className="active">Headphones (227,490 Results)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div id="aside" className="col-md-3">
              
              <div className="aside">
                <h3 className="aside-title">Categories</h3>
                <div className="checkbox-filter" style={{ marginLeft: '-15px' }}>
                  {categoriesTree.length > 0 ? (
                    categoriesTree.map(cat => (
                      <SidebarCategoryItem 
                        key={cat.id} 
                        category={cat} 
                        selectedIds={selectedCategoryIds}
                        onToggleCheck={handleToggleCheck}
                      />
                    ))
                  ) : (
                    <p style={{ marginLeft: '15px' }}>Đang tải danh mục...</p>
                  )}
                </div>
              </div>

              <div className="aside">
                <h3 className="aside-title">Price</h3>
                <div className="price-filter">
                  <div id="price-slider"></div>
                  <div className="input-number price-min"><input id="price-min" type="number" /><span className="qty-up">+</span><span className="qty-down">-</span></div>
                  <span>-</span>
                  <div className="input-number price-max"><input id="price-max" type="number" /><span className="qty-up">+</span><span className="qty-down">-</span></div>
                </div>
              </div>

              <div className="aside">
                <h3 className="aside-title">Brand</h3>
                <div className="checkbox-filter">
                  {brands.length > 0 ? (
                    brands.map(brand => (
                      <div className="input-checkbox" key={brand.id}>
                        <input 
                          type="checkbox" 
                          id={`brand-filter-${brand.id}`} 
                          checked={selectedBrandIds.includes(brand.id)}
                          onChange={() => handleToggleBrand(brand.id)}
                        />
                        <label htmlFor={`brand-filter-${brand.id}`} style={{ cursor: 'pointer' }}>
                          <span></span>
                          {brand.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Đang tải thương hiệu...</p>
                  )}
                </div>
              </div>

              <div className="aside">
                <h3 className="aside-title">Top selling</h3>
                <div className="product-widget">
                  <div className="product-img"><img src="/img/product01.png" alt="" /></div>
                  <div className="product-body"><p className="product-category">Category</p><h3 className="product-name"><a href="#">product name goes here</a></h3><h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4></div>
                </div>
              </div>
            </div>

            <div id="store" className="col-md-9">
              <div className="store-filter clearfix">
                <div className="store-sort">
                  <label>Sort By:
                    <select className="input-select"><option value="0">Popular</option><option value="1">Position</option></select>
                  </label>
                  <label>Show:
                    <select className="input-select"><option value="0">20</option><option value="1">50</option></select>
                  </label>
                </div>
                <ul className="store-grid"><li className="active"><i className="fa fa-th"></i></li><li><a href="#"><i className="fa fa-th-list"></i></a></li></ul>
              </div>

              <div className="row">
                {isLoadingProducts ? (
                  <div className="col-md-12 text-center"><p>Đang tải sản phẩm...</p></div>
                ) : products.length > 0 ? (
                  products.map((prod) => (
                    <div key={prod.id} className="col-md-4 col-xs-6">
                      <ProductCard 
                        id={prod.id}
                        name={prod.name}
                        price={prod.price}
                        imageUrl={prod.thumbnailUrl} // Map đúng tên key từ JSON của em
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-md-12 text-center"><p>Không tìm thấy sản phẩm nào.</p></div>
                )}
              </div>

              <div className="store-filter clearfix">
                <span className="store-qty">Showing 20-100 products</span>
                <ul className="store-pagination"><li className="active">1</li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#"><i className="fa fa-angle-right"></i></a></li></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}