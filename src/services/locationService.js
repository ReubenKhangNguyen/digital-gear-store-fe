import axios from 'axios';

const BASE_URL = 'https://provinces.open-api.vn/api';

const locationService = {
  getProvinces: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/p/`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách tỉnh thành:", error);
      return [];
    }
  },

  getDistrictsByProvinceId: async (provinceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/p/${provinceId}?depth=2`);
      return response.data.districts || [];
    } catch (error) {
      console.error("Lỗi lấy danh sách quận huyện:", error);
      return [];
    }
  },

  getWardsByDistrictId: async (districtId) => {
    try {
      const response = await axios.get(`${BASE_URL}/d/${districtId}?depth=2`);
      return response.data.wards || [];
    } catch (error) {
      console.error("Lỗi lấy danh sách phường xã:", error);
      return [];
    }
  }
};

export default locationService;
