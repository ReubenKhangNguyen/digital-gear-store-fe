import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Overview</h2>
        <p style={{ color: '#8D99AE' }}>Welcome back to your store administration.</p>
      </div>

      {/* STAT CARDS */}
      <div className="row">
        <div className="col-md-3">
          <div className="admin-card stat-card">
            <div className="stat-icon"><i className="fa fa-dollar"></i></div>
            <div className="stat-details">
              <h3>$12,450</h3>
              <span>Total Revenue</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="admin-card stat-card">
            <div className="stat-icon"><i className="fa fa-shopping-bag"></i></div>
            <div className="stat-details">
              <h3>245</h3>
              <span>Total Orders</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="admin-card stat-card">
            <div className="stat-icon"><i className="fa fa-users"></i></div>
            <div className="stat-details">
              <h3>1,254</h3>
              <span>Customers</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="admin-card stat-card">
            <div className="stat-icon"><i className="fa fa-box"></i></div>
            <div className="stat-details">
              <h3>45</h3>
              <span>Low Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS (MOCKUP) */}
      <div className="row">
        <div className="col-md-8">
          <div className="admin-card" style={{ minHeight: '350px' }}>
            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Sales Analytics</h4>
            <div style={{ height: '250px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', border: '1px dashed #ccc' }}>
              <span style={{ color: '#8D99AE' }}><i className="fa fa-bar-chart"></i> Chart Area Placeholder</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-card" style={{ minHeight: '350px' }}>
            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Recent Activity</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f1f1' }}>
                <strong style={{ color: '#C026D3' }}>Khang</strong> just placed an order.
                <div style={{ fontSize: '12px', color: '#999' }}>2 mins ago</div>
              </li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f1f1' }}>
                <strong style={{ color: '#C026D3' }}>Admin</strong> updated product "Macbook Pro".
                <div style={{ fontSize: '12px', color: '#999' }}>1 hour ago</div>
              </li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f1f1' }}>
                <strong style={{ color: '#C026D3' }}>Thao</strong> registered a new account.
                <div style={{ fontSize: '12px', color: '#999' }}>3 hours ago</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="admin-card">
        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Recent Orders</h4>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-001</td>
                <td>Nguyen Phuc Khang</td>
                <td>2026-04-19</td>
                <td><span className="badge-success">Completed</span></td>
                <td>$1,299.00</td>
                <td><button className="action-btn edit"><i className="fa fa-eye"></i></button></td>
              </tr>
              <tr>
                <td>#ORD-002</td>
                <td>Tran Thi B</td>
                <td>2026-04-18</td>
                <td><span className="badge-danger">Pending</span></td>
                <td>$45.00</td>
                <td><button className="action-btn edit"><i className="fa fa-eye"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
