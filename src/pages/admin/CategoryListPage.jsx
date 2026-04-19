import React, { useEffect, useState } from 'react';
import categoryService from '../../services/categoryService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Định nghĩa Zod Schema cho dữ liệu tạo Category
const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").max(100, "Tên quá dài (tối đa 100 ký tự)"),
  description: z.string().optional(),
  parentId: z.string().optional() // Lấy ID dạng string từ ô select
});

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Setup React Hook Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(categorySchema)
  });

  const toggleExpand = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategoryTree();
      const data = response.result || response;
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Làm phẳng Data cây để bỏ vào ô Dropdown Chọn Menu Cha với tiền tố "--"
  const flattenCategoriesForSelect = (cats, level = 0, flatList = []) => {
    cats.forEach(c => {
      flatList.push({ ...c, indentString: '-'.repeat(level * 2) });
      if (c.categoryChild && c.categoryChild.length > 0) {
        flattenCategoriesForSelect(c.categoryChild, level + 1, flatList);
      }
    });
    return flatList;
  };

  const flatCategoryOptions = flattenCategoriesForSelect(categories || []);

  const openDrawer = () => {
    reset(); // Xóa sạch rác
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const onSubmit = async (data) => {
    // Ép sang định dạng DTO cho Spring Boot
    const payload = {
      name: data.name,
      description: data.description || null,
      parentId: data.parentId ? parseInt(data.parentId) : null
    };

    console.log("Submit Create Category:", payload);
    // TODO: await categoryService.createCategory(payload);
    
    alert('Thêm Danh Mục thành công! Hãy xem Console để check Payload.');
    closeDrawer();
    fetchCategories();
  };

  // Đệ quy render danh mục với chức năng Expand/Collapse và Guide Line
  const renderCategoryRow = (category, level = 0) => {
    const hasChildren = category.categoryChild && category.categoryChild.length > 0;
    const isExpanded = !!expandedRows[category.id];

    const rowContent = (
      <div style={{
          display: 'flex', 
          alignItems: 'center', 
          marginLeft: level > 0 ? `${level * 25}px` : '0',
          paddingLeft: level > 0 ? '15px' : '0',
          borderLeft: level > 0 ? '1px dashed #ccc' : 'none'
      }}>
        {/* Toggle Icon */}
        <span 
          onClick={() => hasChildren ? toggleExpand(category.id) : null}
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px', 
            height: '24px', 
            marginRight: '8px',
            cursor: hasChildren ? 'pointer' : 'default',
            color: hasChildren ? '#C026D3' : '#transparent'
          }}
        >
          {hasChildren ? (
            <i className={`fa ${isExpanded ? 'fa-angle-down' : 'fa-angle-right'}`} style={{ fontSize: '18px', fontWeight: 'bold' }}></i>
          ) : (
             <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e0e0e0', display: 'inline-block' }}></span>
          )}
        </span>
        <span style={{ fontWeight: level === 0 ? '600' : '400', fontSize: level === 0 ? '15px' : '14px' }}>
          {category.name}
        </span>
      </div>
    );

    let rows = [
      <tr key={`cat-${category.id}`}>
        <td><input type="checkbox" /></td>
        <td style={{ color: '#888' }}>#{category.id}</td>
        <td>{rowContent}</td>
        <td style={{ color: '#8D99AE' }}>{category.description || 'Không có mô tả'}</td>
        <td>
          {category.categoryStatus === 'ACTIVE' && <span className="badge-success">Active</span>}
          {category.categoryStatus === 'INACTIVE' && <span className="badge-danger" style={{backgroundColor: '#f39c12'}}>Inactive</span>}
          {category.categoryStatus === 'DELETED' && <span className="badge-danger">Deleted</span>}
        </td>
        <td>
          <button className="action-btn edit" title="Edit"><i className="fa fa-edit"></i></button>
          <button className="action-btn delete" title="Delete"><i className="fa fa-trash"></i></button>
        </td>
      </tr>
    ];

    if (isExpanded && hasChildren) {
      category.categoryChild.forEach(child => {
        rows = rows.concat(renderCategoryRow(child, level + 1));
      });
    }
    return rows;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý Danh mục</h2>
          <p style={{ color: '#8D99AE' }}>Quản lý cây danh mục sản phẩm của hệ thống.</p>
        </div>
        <button className="primary-btn" onClick={openDrawer}>
          <i className="fa fa-plus"></i> Thêm Danh Mục
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
                  <th>Tên Danh mục</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => renderCategoryRow(cat))}
                {categories.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không có danh mục nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          Khung Trượt (Drawer) THÊM DANH MỤC 
          ======================================================== */}
      {isDrawerOpen && (
        <div className="admin-drawer-overlay" onClick={closeDrawer}></div>
      )}
      <div className={`admin-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="admin-drawer-header">
          <h3>Thêm Danh Mục Mới</h3>
          <button className="admin-drawer-close" onClick={closeDrawer}><i className="fa fa-times"></i></button>
        </div>
        
        <div className="admin-drawer-body">
          <form id="categoryForm" onSubmit={handleSubmit(onSubmit)}>
            
            {/* 1. Tên danh mục */}
            <div className="form-group form-group-admin">
              <label>Tên danh mục <span style={{color: '#D10024'}}>*</span></label>
              <input 
                {...register('name')}
                className="input" 
                type="text" 
                placeholder="Nhập tên..." 
                style={{ borderColor: errors.name ? '#D10024' : '' }}
              />
              {errors.name && <span style={{ color: '#D10024', fontSize: '12px', marginTop: '5px', display: 'block' }}>{errors.name.message}</span>}
            </div>

            {/* 2. Danh mục Cha */}
            <div className="form-group form-group-admin">
              <label>Danh mục cha (Trực thuộc)</label>
              <select {...register('parentId')} className="input">
                <option value="">-- Không có (Danh mục gốc) --</option>
                {flatCategoryOptions.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.indentString && c.indentString + " "} {c.name}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Để mặc định sẽ trở thành danh mục cấp 1.</p>
            </div>

            {/* 3. Mô tả */}
            <div className="form-group form-group-admin">
              <label>Mô tả chi tiết</label>
              <textarea 
                {...register('description')}
                className="input" 
                placeholder="Ví dụ: Thiết bị nhiếp ảnh..." 
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
          <button className="primary-btn" type="submit" form="categoryForm">
            Lưu Danh Mục
          </button>
        </div>
      </div>

    </div>
  );
}
