import React, { useEffect, useState } from 'react';
import brandService from '../../services/brandService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Định nghĩa Zod Schema cho dữ liệu tạo Brand
const brandSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu không được để trống").max(100, "Tên quá dài (tối đa 100 ký tự)"),
  description: z.string().optional(),
  logo: z.string().optional()
});

export default function BrandListPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Setup React Hook Form
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(brandSchema)
  });
  
  const logoWatch = watch('logo'); // Nghe theo dõi thay đổi của input logo để làm preview

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await brandService.getAllBrands();
      const data = response.result || response;
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDrawer = () => {
    reset(); // Xóa sạch input rác của lần trước
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const onSubmit = async (data) => {
    console.log("Submit Create Brand:", data);
    // TODO: Tích hợp API tạo Brand thực tế ở đây
    // vd: await brandService.createBrand(data);
    
    // Tạm giả lập thành công
    alert('Thêm Brand thành công! Hãy xem Console để check Data.');
    closeDrawer();
    fetchBrands();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý Thương hiệu</h2>
          <p style={{ color: '#8D99AE' }}>Danh sách các hãng / nhà sản xuất (Apple, Samsung...).</p>
        </div>
        <button className="primary-btn" onClick={openDrawer}>
          <i className="fa fa-plus"></i> Thêm Thương hiệu
        </button>
      </div>

      <div className="admin-card">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}><input type="checkbox" /></th>
                  <th style={{ width: '80px' }}>ID</th>
                  <th style={{ width: '100px' }}>Logo</th>
                  <th>Tên Thương hiệu</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(brand => (
                  <tr key={brand.id}>
                    <td><input type="checkbox" /></td>
                    <td>#{brand.id}</td>
                    <td>
                      {brand.logo ? (
                         <img src={brand.logo} alt={brand.name} style={{ width: '60px', height: '40px', objectFit: 'contain' }} />
                      ) : (
                         <span style={{color:'#ccc'}}>No URL</span>
                      )}
                    </td>
                    <td style={{ fontWeight: '600' }}>{brand.name}</td>
                    <td style={{ color: '#8D99AE', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {brand.description || 'Không có mô tả'}
                    </td>
                    <td>
                      {brand.status === 'ACTIVE' && <span className="badge-success">Active</span>}
                      {brand.status === 'INACTIVE' && <span className="badge-danger" style={{backgroundColor: '#f39c12'}}>Inactive</span>}
                    </td>
                    <td>
                      <button className="action-btn edit" title="Edit"><i className="fa fa-edit"></i></button>
                      <button className="action-btn delete" title="Delete"><i className="fa fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
                {brands.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không có thương hiệu nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          Khung Trượt (Drawer) THÊM BRAND 
          ======================================================== */}
      {isDrawerOpen && (
        <div className="admin-drawer-overlay" onClick={closeDrawer}></div>
      )}
      <div className={`admin-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="admin-drawer-header">
          <h3>Thêm Thương hiệu Mới</h3>
          <button className="admin-drawer-close" onClick={closeDrawer}><i className="fa fa-times"></i></button>
        </div>
        
        <div className="admin-drawer-body">
          <form id="brandForm" onSubmit={handleSubmit(onSubmit)}>
            
            {/* 1. Preview Logo Area */}
            <div className="form-group form-group-admin" style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div 
                className="admin-upload-box" 
                style={{ 
                  padding: logoWatch ? '10px' : '40px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                 }}
              >
                {logoWatch ? (
                  <img src={logoWatch} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }} />
                ) : (
                  <div>
                    <i className="fa fa-cloud-upload" style={{ fontSize: '30px', marginBottom: '10px' }}></i>
                    <p style={{ margin: 0 }}>Dán Link (URL) logo vào khung dưới chờ Preview</p>
                  </div>
                )}
              </div>
              <input 
                {...register('logo')}
                className="input" 
                type="text" 
                placeholder="https://..." 
                style={{ marginTop: '10px', textAlign: 'center' }} 
              />
            </div>

            {/* 2. Tên thương hiệu */}
            <div className="form-group form-group-admin">
              <label>Tên thương hiệu <span style={{color: '#D10024'}}>*</span></label>
              <input 
                {...register('name')}
                className="input" 
                type="text" 
                placeholder="Nhập tên..." 
                style={{ borderColor: errors.name ? '#D10024' : '' }}
              />
              {errors.name && <span style={{ color: '#D10024', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.name.message}</span>}
            </div>

            {/* 3. Mô tả */}
            <div className="form-group form-group-admin">
              <label>Mô tả (Tùy chọn)</label>
              <textarea 
                {...register('description')}
                className="input" 
                placeholder="Nhập mô tả..." 
                rows="4" 
                style={{ height: 'auto' }}
              />
            </div>
            
          </form>
        </div>

        <div className="admin-drawer-footer">
          <button className="primary-btn" style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ccc' }} onClick={closeDrawer}>
            Hủy bỏ
          </button>
          <button className="primary-btn" type="submit" form="brandForm">
            Lưu Thương Hiệu
          </button>
        </div>
      </div>

    </div>
  );
}
