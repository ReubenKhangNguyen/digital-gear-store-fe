import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import brandService from '../../services/brandService';
import categoryService from '../../services/categoryService';

// ==========================================
// MỘT SỐ TỪ ĐIỂN TEMPLATE TĨNH CHO LOẠI SP 
// (Giả lập logic nhận diện categoryId map tới specs nào đó)
// Ví dụ: ID:5 (Máy ảnh), ID:9 (DSLR), ...
// ==========================================
// Tạm map string để dễ demo (vì DB tùy ý người dùng nhập)
const SPEC_TEMPLATES = {
  // Thay the String type bang nhung ID that sau nay (vd: 'dslr', 'laptop')
  camera: [
    { key: "type", label: "Loại máy", type: "text" },
    { key: "sensor", label: "Cảm biến", type: "text" },
    { key: "lens_mount", label: "Ngàm ống kính", type: "text" },
  ],
  laptop: [
    { key: "cpu_detail", label: "Chi tiết CPU", type: "text" },
    { key: "ram_capacity", label: "Dung lượng RAM", type: "text" },
    { key: "vga", label: "Card đồ họa", type: "text" },
  ],
  mobile: [
    { key: "os", label: "Hệ điều hành", type: "text" },
    { key: "camera_rear", label: "Camera sau", type: "text" },
    { key: "battery_detail", label: "Dung lượng Pin", type: "text" },
  ]
};

export default function CreateProductPage() {
  const navigate = useNavigate();

  // --- 1. STATE CHUNG ---
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stockQuantity: '',
    brandId: null
  });

  // --- 2. STATE CATEGORIES (Cascading) ---
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [catLevel1, setCatLevel1] = useState('');
  const [catLevel2, setCatLevel2] = useState('');
  const [catLevel3, setCatLevel3] = useState('');
  
  // Xác định Category lá cuối cùng (Leaf)
  const finalCategoryId = catLevel3 || catLevel2 || catLevel1 || null;

  // --- 3. STATE BRANDS ---
  const [brandOptions, setBrandOptions] = useState([]);

  // --- 4. STATE IMAGES ---
  // Mỗi image format: { id: Date.now(), url: '', isThumbnail: false }
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // --- 5. STATE SPECIFICATIONS (Dynamic form) ---
  const [templateSpecs, setTemplateSpecs] = useState({});
  const [customSpecs, setCustomSpecs] = useState([]); // [{key: '', value: ''}]

  // GỌI API BAN ĐẦU
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        // Brands cho react-select
        const brandRes = await brandService.getAllBrands();
        const brandData = brandRes.result || brandRes;
        const bOptions = brandData.map(b => ({ value: b.id, label: b.name }));
        setBrandOptions(bOptions);

        // Category tree
        const catRes = await categoryService.getCategoryTree();
        const catData = catRes.result || catRes;
        setCategoriesTree(catData);
      } catch (err) {
        console.error("Fetch form data error", err);
      }
    };
    fetchInitData();
  }, []);

  // Cascading logic Helpers
  const selectedL1Node = useMemo(() => categoriesTree.find(c => c.id.toString() === catLevel1), [categoriesTree, catLevel1]);
  const l2Options = selectedL1Node?.categoryChild || [];
  const selectedL2Node = useMemo(() => l2Options.find(c => c.id.toString() === catLevel2), [l2Options, catLevel2]);
  const l3Options = selectedL2Node?.categoryChild || [];

  // Reset levels con nếu parent thay đổi
  const handleCatL1Change = (val) => { setCatLevel1(val); setCatLevel2(''); setCatLevel3(''); };
  const handleCatL2Change = (val) => { setCatLevel2(val); setCatLevel3(''); };

  // --- HANDLER IMAGES ---
  const handleAddImage = () => {
    if(!newImageUrl.trim()) return;
    const newImg = {
      id: Date.now(),
      imageUrl: newImageUrl,
      isThumbnail: images.length === 0 // Nếu là ảnh đầu tiên, mặc định là thumbnail
    };
    setImages([...images, newImg]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (id) => {
    const nextImages = images.filter(img => img.id !== id);
    // Nếu lỡ xoá cái là thumbnail, tự assign cái đầu tiên thành thumbnail (nếu còn)
    if(nextImages.length > 0 && !nextImages.some(i => i.isThumbnail)) {
      nextImages[0].isThumbnail = true;
    }
    setImages(nextImages);
  };

  const handleSetThumbnail = (id) => {
    setImages(images.map(img => ({
      ...img,
      isThumbnail: img.id === id
    })));
  };

  // --- HANDLER SPECS ---
  // Đoán template specs khi Category cuối cùng thay đổi
  useEffect(() => {
    if (!finalCategoryId) return;
    
    // Tạm thời hardcode keyword đoán template từ tên menu. 
    // Trong thực tế, DB có thể lưu sẵn templateType string vào table Category.
    let templateName = null;
    const nodeName = (selectedL2Node?.name || selectedL1Node?.name || "").toLowerCase();
    
    if (nodeName.includes('máy ảnh') || nodeName.includes('camera')) templateName = 'camera';
    else if (nodeName.includes('laptop') || nodeName.includes('máy tính')) templateName = 'laptop';
    else if (nodeName.includes('điện thoại') || nodeName.includes('mobile')) templateName = 'mobile';

    // Khởi tạo state rỗng cho các fields của template này
    const templateFields = SPEC_TEMPLATES[templateName] || [];
    const initObj = {};
    templateFields.forEach(f => { initObj[f.key] = ''; });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTemplateSpecs(initObj);
    
    // Reset custom specs hờ
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomSpecs([]);
  }, [finalCategoryId, selectedL1Node, selectedL2Node]); // Re-run khi leaf category đổi

  const handleAddCustomSpec = () => {
    setCustomSpecs([...customSpecs, { key: '', value: '' }]);
  };

  const handleRemoveCustomSpec = (index) => {
    const nw = [...customSpecs];
    nw.splice(index, 1);
    setCustomSpecs(nw);
  };

  const handleCustomSpecChange = (index, field, val) => {
    const nw = [...customSpecs];
    nw[index][field] = val;
    setCustomSpecs(nw);
  };

  // --- XỬ LÝ SUBMIT CHÍNH ---
  const handlePublish = () => {
    // 1. Trộn Template Specs & Custom Specs vào 1 Map duy nhất
    const mergedSpecs = { ...templateSpecs };
    customSpecs.forEach(c => {
      if (c.key.trim() && c.value.trim()) {
        // Cách tốt nhất là dùng luôn c.key nguyên bản làm property key
        mergedSpecs[c.key.trim()] = c.value.trim();
      }
    });

    // -----------------------------------------------------------------------------
    // GÓI GỌN DỮ LIỆU ĐỂ GỬI QUA BACKEND (Mapping với ProductCreateRequestDTO.java)
    // - Khi ấn Publish, tất cả các state rời rạc ở trên sẽ được trộn thành 1 cục JSON.
    // - Format này khớp 100% với các thuộc tính @NotBlank, @NotNull của DTO Java.
    // -----------------------------------------------------------------------------
    const payload = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price) || 0,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      categoryId: parseInt(finalCategoryId),
      brandId: parseInt(formData.brandId),
      // Ảnh sẽ lặp qua và gán isThumbnail = true/false
      images: images.map(img => ({ imageUrl: img.imageUrl, isThumbnail: img.isThumbnail })),
      // Map<String, Object> Specifications động
      specifications: mergedSpecs
    };

    console.log("=== THÔNG TIN BE NHẬN (ProductCreateRequestDTO) ===");
    console.log(JSON.stringify(payload, null, 2));
    alert("Vui lòng ấn F12 -> Mở Console để xem JSON đã đóng gói chuẩn xác chưa nhé!");
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Create New Product</h2>
          <p style={{ color: '#8D99AE' }}>Back to inventory <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/products'); }} style={{ color: '#C026D3' }}>Products List</a></p>
        </div>
        <div>
          <button className="primary-btn" style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', marginRight: '10px' }} onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
          <button className="primary-btn" onClick={handlePublish}>
            Publish Product
          </button>
        </div>
      </div>

      <div className="row">
        {/* ========================================================
            CỘT TRÁI: THÔNG TIN CƠ BẢN & SPECIFICATIONS (Form Động)
            ======================================================== */}
        <div className="col-md-8">
          <div className="admin-card">
            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Thông tin cơ bản</h4>
            
            <div className="form-group form-group-admin">
              <label>Tên Sản Phẩm <span style={{color: '#D10024'}}>*</span></label>
              <input className="input" type="text" placeholder="Vd: Macbook Pro 14 M3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="row">
              <div className="col-md-6 form-group form-group-admin">
                <label>SKU (Mã Định Danh)</label>
                <input className="input" type="text" placeholder="Vd: MAC-001" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}/>
              </div>
              <div className="col-md-6 form-group form-group-admin">
                <label>Giá Bán (VNĐ) <span style={{color: '#D10024'}}>*</span></label>
                <input className="input" type="number" placeholder="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}/>
              </div>
            </div>
            {/* Không có Description trong DTO nữa, chúng ta chuyển qua Specs. */}
          </div>

          {/* KHU VỰC THÔNG SỐ (SPECIFICATIONS) - Ẩn đến khi chọn được Category */}
          {finalCategoryId ? (
            <div className="admin-card">
              <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Thông Số Kỹ Thuật (Dynamic Specs)</h4>
              
              {/* Render Template Specs (Đổ từ Dictionary) */}
              <div className="row">
                {Object.keys(templateSpecs).map(key => {
                  // tìm label tương ứng
                  let templateName = 'camera';
                  const nodeName = (selectedL2Node?.name || selectedL1Node?.name || "").toLowerCase();
                  if (nodeName.includes('laptop') || nodeName.includes('máy tính')) templateName = 'laptop';
                  else if (nodeName.includes('điện thoại') || nodeName.includes('mobile')) templateName = 'mobile';
                  
                  const fDef = SPEC_TEMPLATES[templateName]?.find(x => x.key === key);
                  
                  return (
                    <div className="col-md-6 form-group form-group-admin" key={`tpl-${key}`}>
                      <label>{fDef ? fDef.label : key}</label>
                      <input 
                        className="input" 
                        type="text" 
                        placeholder="..." 
                        value={templateSpecs[key]}
                        onChange={(e) => setTemplateSpecs({...templateSpecs, [key]: e.target.value})}
                      />
                    </div>
                  );
                })}
                {Object.keys(templateSpecs).length === 0 && (
                  <div className="col-md-12"><p style={{color: '#888', fontStyle: 'italic'}}>Không có template thông số mặc định cho danh mục này. Hãy tùy biến bên dưới.</p></div>
                )}
              </div>

              {/* Render Custom Specs */}
              {customSpecs.length > 0 && <h5 style={{ marginTop: '10px', marginBottom: '15px' }}>Custom Specifications</h5>}
              {customSpecs.map((spec, index) => (
                <div className="row" key={`cs-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="col-md-5">
                    <input className="input" type="text" placeholder="Tên thông số (Key)" value={spec.key} onChange={e => handleCustomSpecChange(index, 'key', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <input className="input" type="text" placeholder="Giá trị (Value)" value={spec.value} onChange={e => handleCustomSpecChange(index, 'value', e.target.value)} />
                  </div>
                  <div className="col-md-1" style={{ textAlign: 'right' }}>
                    <button className="action-btn delete" onClick={() => handleRemoveCustomSpec(index)}><i className="fa fa-times"></i></button>
                  </div>
                </div>
              ))}

              <button className="primary-btn" style={{ marginTop: '10px', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc' }} onClick={handleAddCustomSpec}>
                <i className="fa fa-plus"></i> Add Custom Spec
              </button>
            </div>
          ) : (
            <div className="admin-card" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <i className="fa fa-info-circle" style={{fontSize: '30px', color: '#ccc', marginBottom: '10px', display: 'block'}}></i>
              Vui lòng chọn <b>Danh mục sản phẩm (Category)</b> ở cột bên phải để mở khóa form Thông số kỹ thuật.
            </div>
          )}

        </div>

        {/* ========================================================
            CỘT PHẢI: MEDIA & ORGANIZATION & STOCK
            ======================================================== */}
        <div className="col-md-4">

          {/* KHU VỰC TỔ CHỨC (Brand & Category) */}
          <div className="admin-card">
            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Phân Loại</h4>
            
            <div className="form-group form-group-admin" style={{ zIndex: 10 }}>
              <label>Thương hiệu (Brand) <span style={{color: '#D10024'}}>*</span></label>
              <Select 
                options={brandOptions} 
                isSearchable 
                placeholder="Tìm và chọn..." 
                onChange={(opt) => setFormData({...formData, brandId: opt?.value})}
              />
            </div>

            <div className="form-group form-group-admin">
              <label>Danh mục (Cascading) <span style={{color: '#D10024'}}>*</span></label>
              
              {/* Level 1 */}
              <select className="input" style={{ marginBottom: '10px' }} value={catLevel1} onChange={e => handleCatL1Change(e.target.value)}>
                <option value="">-- Chọn Danh Mục Cấp 1 --</option>
                {categoriesTree.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>

              {/* Level 2 (xuất hiện nếu có catChild) */}
              {l2Options.length > 0 && (
                <select className="input" style={{ marginBottom: '10px', borderColor: '#C026D3', borderLeftWidth: '3px' }} value={catLevel2} onChange={e => handleCatL2Change(e.target.value)}>
                  <option value="">-- Lựa chọn Cấp 2 --</option>
                  {l2Options.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              )}

              {/* Level 3 (xuất hiện nếu có catChild) */}
              {l3Options.length > 0 && (
                <select className="input" style={{ marginBottom: '10px', borderColor: '#D10024', borderLeftWidth: '3px' }} value={catLevel3} onChange={e => setCatLevel3(e.target.value)}>
                  <option value="">-- Chi tiết Cấp 3 --</option>
                  {l3Options.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              )}

              {/* Báo hiệu kết quả lá */}
              <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                ID Danh mục xuất: <strong>{finalCategoryId || '(Chưa chọn)'}</strong>
              </div>
            </div>

            <div className="form-group form-group-admin" style={{ marginTop: '20px' }}>
              <label>Số lượng Tồn kho <span style={{color: '#D10024'}}>*</span></label>
              <input className="input" type="number" placeholder="0" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} />
            </div>
          </div>

          {/* KHU VỰC HÌNH ẢNH LƯỚI (IMAGE GRID) */}
          <div className="admin-card">
            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>Hình ảnh (Media)</h4>
            
            {/* Nhập URL ảnh bằng tay */}
            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <input className="input" type="text" placeholder="Nhập Link Ảnh (URL)..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
              <button className="primary-btn" style={{ marginLeft: '5px', padding: '0 15px' }} onClick={handleAddImage}>Thêm</button>
            </div>

            {/* Khung chứa lưới (Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              
              {/* Lặp in ảnh */}
              {images.map(img => (
                <div key={img.id} style={{ 
                  position: 'relative', 
                  border: img.isThumbnail ? '2px solid #C026D3' : '1px solid #ddd', 
                  borderRadius: '6px', 
                  padding: '5px',
                  backgroundColor: '#fafafa'
                }}>
                  {/* Badge Thumbnail */}
                  {img.isThumbnail && (
                    <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#C026D3', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
                      Thumb
                    </div>
                  )}

                  {/* Nút cài làm Thumbnail (Ngôi sao) */}
                  <div 
                    title="Đánh dấu Thumbnail chính"
                    onClick={() => handleSetThumbnail(img.id)}
                    style={{ position: 'absolute', top: '5px', left: '5px', cursor: 'pointer', color: img.isThumbnail ? '#FFCC00' : '#ccc', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '2px 4px' }}
                  >
                    <i className="fa fa-star"></i>
                  </div>

                  {/* Nút Xoá Thùng rác */}
                  <div 
                    title="Xóa hình"
                    onClick={() => handleRemoveImage(img.id)}
                    style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', color: '#D10024', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '2px 5px' }}
                  >
                    <i className="fa fa-trash"></i>
                  </div>

                  {/* Vùng hiển thị ảnh */}
                  <img src={img.imageUrl} alt="preview" style={{ width: '100%', height: '100px', objectFit: 'contain' }} onError={(e) => e.target.src="https://via.placeholder.com/150?text=L%E1%BB%97i+Link"} />
                </div>
              ))}

              {images.length === 0 && (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '30px 10px', color: '#ccc', border: '1px dashed #ccc', borderRadius: '6px' }}>
                  Nhập link và nhấn "Thêm" để nạp ảnh con trống.
                </div>
              )}
            </div>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '15px' }}>* Bức ảnh nào được sáng sao vàng sẽ đóng vai trò Thumbnail (ảnh bìa).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
