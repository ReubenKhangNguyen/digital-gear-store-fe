import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Digital<span>Admin</span></h2>
      </div>
      <ul className="admin-nav">
        <li>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
            <i className="fa fa-dashboard"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? "active" : ""}>
            <i className="fa fa-cube"></i> Quản lý Sản phẩm
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "active" : ""}>
            <i className="fa fa-tags"></i> Quản lý Danh mục
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/brands" className={({ isActive }) => isActive ? "active" : ""}>
            <i className="fa fa-star"></i> Quản lý Thương hiệu
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "active" : ""}>
            <i className="fa fa-shopping-cart"></i> Đơn hàng (Demo)
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
            <i className="fa fa-users"></i> Người dùng (Demo)
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
