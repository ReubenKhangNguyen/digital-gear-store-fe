import React, { useState, useEffect } from 'react';
import userAddressService from '../../services/userAddressService';
import AddressFormModal from './AddressFormModal';
import { toast } from 'react-toastify';

export default function UserAddressList() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await userAddressService.getMyAddresses();
      if (response && response.result) {
        setAddresses(response.result);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách địa chỉ:", error);
      toast.error("Không thể tải sổ địa chỉ.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await userAddressService.deleteAddress(id);
      toast.success("Xóa địa chỉ thành công!");
      fetchAddresses();
    } catch (error) {
      console.error("Lỗi xóa địa chỉ:", error);
      toast.error("Xóa địa chỉ thất bại.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userAddressService.setDefaultAddress(id);
      toast.success("Đã thiết lập địa chỉ mặc định!");
      fetchAddresses();
    } catch (error) {
      console.error("Lỗi thiết lập mặc định:", error);
      toast.error("Thiết lập mặc định thất bại.");
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingAddress) {
        await userAddressService.updateAddress(editingAddress.id, data);
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await userAddressService.createAddress(data);
        toast.success("Thêm địa chỉ thành công!");
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error("Lỗi lưu địa chỉ:", error);
      toast.error(error.response?.data?.message || "Lưu địa chỉ thất bại.");
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f4f4f4', paddingBottom: '15px', marginBottom: '25px' }}>
        <h4 style={{ fontWeight: 'bold', margin: 0 }}>
          <i className="fa fa-map-marker" style={{ color: '#C846C8', marginRight: '10px' }}></i> Sổ Địa Chỉ
        </h4>
        <button onClick={handleOpenAddModal} className="primary-btn" style={{ padding: '8px 15px', borderRadius: '4px', fontSize: '14px' }}>
          <i className="fa fa-plus"></i> Thêm Địa Chỉ Mới
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Đang tải...</p>
      ) : addresses.length === 0 ? (
        <div className="text-center" style={{ padding: '30px 0', color: '#888' }}>
          <p>Bạn chưa có địa chỉ nào.</p>
        </div>
      ) : (
        <div>
          {addresses.map(addr => (
            <div key={addr.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #eee' }}>
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px', borderRight: '1px solid #ccc', paddingRight: '10px', marginRight: '10px' }}>
                    {addr.receiverName}
                  </span>
                  <span style={{ color: '#555' }}>{addr.receiverPhone}</span>
                </div>
                <div style={{ color: '#555', marginBottom: '5px' }}>
                  {addr.specificAddress}
                </div>
                <div style={{ color: '#555' }}>
                  {addr.wardName}, {addr.districtName}, {addr.provinceName}
                </div>
                {addr.isDefault && (
                  <span style={{ display: 'inline-block', border: '1px solid #C846C8', color: '#C846C8', padding: '2px 5px', fontSize: '12px', marginTop: '10px' }}>
                    Mặc định
                  </span>
                )}
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ marginBottom: '10px' }}>
                  <button onClick={() => handleOpenEditModal(addr)} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer', marginRight: '15px' }}>Cập nhật</button>
                  <button onClick={() => handleDelete(addr.id)} disabled={addr.isDefault} style={{ border: 'none', background: 'none', color: addr.isDefault ? '#ccc' : '#C846C8', cursor: addr.isDefault ? 'not-allowed' : 'pointer' }}>Xóa</button>
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} style={{ border: '1px solid #ccc', background: '#fff', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                    Thiết lập mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
      />
    </div>
  );
}
