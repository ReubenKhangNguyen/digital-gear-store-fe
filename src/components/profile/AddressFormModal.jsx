import React, { useState, useEffect } from 'react';
import locationService from '../../services/locationService';

export default function AddressFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedWardCode, setSelectedWardCode] = useState('');

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
    fontSize: '15px',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
  };
  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'block',
    color: '#333',
    fontSize: '14px'
  };

  // Lấy danh sách Tỉnh khi mở Modal
  useEffect(() => {
    if (isOpen) {
      locationService.getProvinces().then(data => setProvinces(data));
      
      // Load initial data nếu có (Mode Edit)
      if (initialData) {
        setReceiverName(initialData.receiverName || '');
        setReceiverPhone(initialData.receiverPhone || '');
        setSpecificAddress(initialData.specificAddress || '');
        setIsDefault(initialData.isDefault || false);
        
        setSelectedProvinceId(initialData.provinceId || '');
        if (initialData.provinceId) {
          locationService.getDistrictsByProvinceId(initialData.provinceId).then(data => {
            setDistricts(data);
            setSelectedDistrictId(initialData.districtId || '');
          });
        }
        if (initialData.districtId) {
          locationService.getWardsByDistrictId(initialData.districtId).then(data => {
            setWards(data);
            setSelectedWardCode(initialData.wardCode || '');
          });
        }
      } else {
        // Mode Create
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setReceiverName('');
    setReceiverPhone('');
    setSpecificAddress('');
    setIsDefault(false);
    setSelectedProvinceId('');
    setSelectedDistrictId('');
    setSelectedWardCode('');
    setDistricts([]);
    setWards([]);
  };

  const handleProvinceChange = async (e) => {
    const pId = e.target.value;
    setSelectedProvinceId(pId);
    setSelectedDistrictId('');
    setSelectedWardCode('');
    setWards([]);
    if (pId) {
      const data = await locationService.getDistrictsByProvinceId(pId);
      setDistricts(data);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const dId = e.target.value;
    setSelectedDistrictId(dId);
    setSelectedWardCode('');
    if (dId) {
      const data = await locationService.getWardsByDistrictId(dId);
      setWards(data);
    } else {
      setWards([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProvinceId || !selectedDistrictId || !selectedWardCode) {
      alert("Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã");
      return;
    }

    const p = provinces.find(x => x.code.toString() === selectedProvinceId.toString());
    const d = districts.find(x => x.code.toString() === selectedDistrictId.toString());
    const w = wards.find(x => x.code.toString() === selectedWardCode.toString());

    const data = {
      receiverName,
      receiverPhone,
      specificAddress,
      isDefault,
      provinceId: parseInt(selectedProvinceId),
      provinceName: p ? p.name : '',
      districtId: parseInt(selectedDistrictId),
      districtName: d ? d.name : '',
      wardCode: selectedWardCode,
      wardName: w ? w.name : ''
    };

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '40px', borderRadius: '16px',
        width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>{initialData ? 'Cập Nhật Địa Chỉ' : 'Thêm Địa Chỉ Mới'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-md-6 form-group">
              <label style={labelStyle}>Họ và tên</label>
              <input style={inputStyle} type="text" value={receiverName} onChange={e => setReceiverName(e.target.value)} required placeholder="Nhập họ và tên người nhận" />
            </div>
            <div className="col-md-6 form-group">
              <label style={labelStyle}>Số điện thoại</label>
              <input style={inputStyle} type="text" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} required placeholder="Nhập số điện thoại liên hệ" />
            </div>
          </div>

          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-md-4 form-group">
              <label style={labelStyle}>Tỉnh/Thành Phố</label>
              <select style={inputStyle} value={selectedProvinceId} onChange={handleProvinceChange} required>
                <option value="">Chọn Tỉnh/Thành</option>
                {provinces.map(p => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 form-group">
              <label style={labelStyle}>Quận/Huyện</label>
              <select style={{ ...inputStyle, backgroundColor: selectedProvinceId ? '#fdfdfd' : '#eee', cursor: selectedProvinceId ? 'pointer' : 'not-allowed' }} value={selectedDistrictId} onChange={handleDistrictChange} required disabled={!selectedProvinceId}>
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(d => (
                  <option key={d.code} value={d.code}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 form-group">
              <label style={labelStyle}>Phường/Xã</label>
              <select style={{ ...inputStyle, backgroundColor: selectedDistrictId ? '#fdfdfd' : '#eee', cursor: selectedDistrictId ? 'pointer' : 'not-allowed' }} value={selectedWardCode} onChange={e => setSelectedWardCode(e.target.value)} required disabled={!selectedDistrictId}>
                <option value="">Chọn Phường/Xã</option>
                {wards.map(w => (
                  <option key={w.code} value={w.code}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={labelStyle}>Địa chỉ cụ thể (Số nhà, Tên đường...)</label>
            <input style={inputStyle} type="text" value={specificAddress} onChange={e => setSpecificAddress(e.target.value)} required placeholder="VD: 448/65/20b, Phan Huy Ích" />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="isDefault" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} />
            <label htmlFor="isDefault" style={{ margin: 0, fontWeight: 'normal' }}>Đặt làm địa chỉ mặc định</label>
          </div>

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button type="button" className="btn" onClick={onClose} style={{ marginRight: '10px', backgroundColor: '#f4f4f4' }}>Trở Lại</button>
            <button type="submit" className="primary-btn">Hoàn Thành</button>
          </div>
        </form>
      </div>
    </div>
  );
}
