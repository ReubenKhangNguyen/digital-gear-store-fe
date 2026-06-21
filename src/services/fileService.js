import axiosClient from '../utils/axiosClient';

const fileService = {
  uploadMultiple: (files) => {
    const formData = new FormData();
    // Appends each file to the 'files' parameter expected by the backend
    files.forEach(file => {
      formData.append('files', file);
    });

    return axiosClient.post('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default fileService;
