import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
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
            style={{ cursor: 'pointer', marginRight: '10px', color: isOpen ? '#C026D3' : '#475569', fontSize: '16px', transform: 'translateY(-2px)' }}
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
          <label htmlFor={`cat-filter-${category.id}`} style={{ fontWeight: isOpen ? 'bold' : 'normal', cursor: 'pointer', marginBottom: 0 }}>
            <span></span>
            {category.name}
          </label>
        </div>
      </div>
      {hasChildren && isOpen && (
        <div className="category-children" style={{ borderLeft: '1px dashed #CBD5E1', marginLeft: '6px', paddingTop: '5px' }}>
          {category.categoryChild.map(child => (
            <SidebarCategoryItem key={child.id} category={child} selectedIds={selectedIds} onToggleCheck={onToggleCheck} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters State
  const keyword = searchParams.get("keyword") || "";
  const urlCatIds = searchParams.get("categoryIds");
  const urlCatId = searchParams.get("categoryId");
  let initialCategoryIds = [];
  if (urlCatIds) initialCategoryIds = urlCatIds.split(",").map(Number);
  else if (urlCatId) initialCategoryIds = [Number(urlCatId)];
  
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(initialCategoryIds);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(3);
  const [sortOption, setSortOption] = useState("createdAt-desc");

  // Sync URL changes to Category State (if navigated from Header)
  useEffect(() => {
    const urlCatIds = searchParams.get("categoryIds");
    const urlCatId = searchParams.get("categoryId");
    if (urlCatIds) {
      setSelectedCategoryIds(urlCatIds.split(",").map(Number));
    } else if (urlCatId) {
      setSelectedCategoryIds([Number(urlCatId)]);
    } else {
      setSelectedCategoryIds([]);
    }
    // When keyword or category from URL changes, reset page to 0
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await categoryService.getCategoryTree();
        setCategoriesTree(Array.isArray(response.result) ? response.result : []);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    const fetchBrands = async () => {
      try {
        const response = await brandService.getAllBrands();
        setBrands(Array.isArray(response.result) ? response.result : []);
      } catch (error) {
        console.error("Lỗi lấy thương hiệu:", error);
      }
    };
    fetchTree();
    fetchBrands();
  }, []);

  const handleToggleCheck = (categoryId) => {
    setSelectedCategoryIds((prevIds) => {
      const newIds = prevIds.includes(categoryId) ? prevIds.filter(id => id !== categoryId) : [...prevIds, categoryId];
      const params = Object.fromEntries(searchParams);
      if (newIds.length > 0) params.categoryIds = newIds.join(',');
      else delete params.categoryIds;
      setSearchParams(params, { replace: true });
      return newIds;
    });
    setPage(0);
  };

  const handleToggleBrand = (brandId) => {
    setSelectedBrandIds((prevIds) => {
      const newIds = prevIds.includes(brandId) ? prevIds.filter(id => id !== brandId) : [...prevIds, brandId];
      const params = Object.fromEntries(searchParams);
      if (newIds.length > 0) params.brandIds = newIds.join(',');
      else delete params.brandIds;
      setSearchParams(params, { replace: true });
      return newIds;
    });
    setPage(0);
  };

  const handleApplyPrice = () => {
    setAppliedMinPrice(minPriceInput);
    setAppliedMaxPrice(maxPriceInput);
    const params = Object.fromEntries(searchParams);
    if (minPriceInput) params.minPrice = minPriceInput; else delete params.minPrice;
    if (maxPriceInput) params.maxPrice = maxPriceInput; else delete params.maxPrice;
    setSearchParams(params, { replace: true });
    setPage(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const [sortBy, direction] = sortOption.split("-");
        const params = {
          keyword: keyword || undefined,
          page,
          size,
          sortBy,
          direction
        };
        
        // --- CỰC KỲ QUAN TRỌNG: Gộp cả các thư mục con vào tìm kiếm ---
        let expandedCategoryIds = [...selectedCategoryIds];
        const expandChildren = (cats) => {
          cats.forEach(cat => {
            // Nếu thư mục cha đang được chọn, tự động thêm các thư mục con vào list tìm kiếm
            if (expandedCategoryIds.includes(cat.id) || expandedCategoryIds.includes(cat.parentId)) {
              if (!expandedCategoryIds.includes(cat.id)) expandedCategoryIds.push(cat.id);
              if (cat.categoryChild) expandChildren(cat.categoryChild);
            } else {
              if (cat.categoryChild) expandChildren(cat.categoryChild);
            }
          });
        };
        // Phải chạy đệ quy 2 lần để bao quát hết (trong trường hợp chọn thư mục gốc có 3 cấp)
        expandChildren(categoriesTree);
        expandChildren(categoriesTree);

        if (expandedCategoryIds.length > 0) params.categoryIds = Array.from(new Set(expandedCategoryIds)).join(',');
        if (selectedBrandIds.length > 0) params.brandIds = selectedBrandIds.join(',');
        if (appliedMinPrice) params.minPrice = appliedMinPrice;
        if (appliedMaxPrice) params.maxPrice = appliedMaxPrice;

        const response = await productService.searchProducts(params);
        if (response.result && response.result.content) {
          setProducts(response.result.content);
          setTotalPages(response.result.totalPages);
          setTotalElements(response.result.totalElements);
        } else {
          setProducts([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [keyword, selectedCategoryIds, selectedBrandIds, appliedMinPrice, appliedMaxPrice, page, size, sortOption]);

  // Sinh danh sách trang
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <li key={i} className={page === i ? "active" : ""}>
          {page === i ? (
            i + 1
          ) : (
            <a href="#" onClick={(e) => { e.preventDefault(); setPage(i); }}>{i + 1}</a>
          )}
        </li>
      );
    }
    return (
      <ul className="store-pagination">
        {page > 0 && (
          <li><a href="#" onClick={(e) => { e.preventDefault(); setPage(page - 1); }}><i className="fa fa-angle-left"></i></a></li>
        )}
        {pages}
        {page < totalPages - 1 && (
          <li><a href="#" onClick={(e) => { e.preventDefault(); setPage(page + 1); }}><i className="fa fa-angle-right"></i></a></li>
        )}
      </ul>
    );
  };

  return (
    <>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li><a href="/">Home</a></li>
                <li className="active">Store ({totalElements} Results)</li>
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
                  <div className="input-number price-min" style={{ width: '45%' }}>
                    <input id="price-min" type="number" placeholder="Min" value={minPriceInput} onChange={e => setMinPriceInput(e.target.value)} />
                  </div>
                  <span style={{ padding: '0 5px' }}>-</span>
                  <div className="input-number price-max" style={{ width: '45%' }}>
                    <input id="price-max" type="number" placeholder="Max" value={maxPriceInput} onChange={e => setMaxPriceInput(e.target.value)} />
                  </div>
                  <button 
                    onClick={handleApplyPrice} 
                    style={{ marginTop: '10px', width: '100%', padding: '5px', backgroundColor: '#D10024', color: 'white', border: 'none', borderRadius: '40px', fontWeight: 'bold' }}
                  >
                    Áp dụng
                  </button>
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
                    <select className="input-select" value={sortOption} onChange={(e) => { setSortOption(e.target.value); setPage(0); }}>
                      <option value="createdAt-desc">Mới nhất</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                      <option value="name-asc">Tên: A-Z</option>
                    </select>
                  </label>
                  <label>Show:
                    <select className="input-select" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                    </select>
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
                        imageUrl={prod.thumbnailUrl}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-md-12 text-center"><p>Không tìm thấy sản phẩm nào.</p></div>
                )}
              </div>

              <div className="store-filter clearfix">
                <span className="store-qty">Showing {totalElements === 0 ? 0 : page * size + 1}-{Math.min((page + 1) * size, totalElements)} of {totalElements} products</span>
                {renderPagination()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
