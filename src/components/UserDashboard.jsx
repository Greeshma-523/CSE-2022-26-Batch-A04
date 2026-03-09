import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CheckBadgeIcon,
  FolderIcon,
  PhotoIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  viewFiles,
  uploadFile,
  decryptFile,
  viewDecryptedFiles,
  downloadFile
} from '../services/api';

const email = localStorage.getItem("email");
console.log(email);
const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [decryptedFiles, setDecryptedFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState({});
  const [downloadLoading, setDownloadLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDecryptedModal, setShowDecryptedModal] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    filename: '',
    file: null
  });
  const [uploadErrors, setUploadErrors] = useState({});

  // Stats
  const [stats, setStats] = useState({
    totalFiles: 0,
    encryptedFiles: 0,
    decryptedFiles: 0,
    totalSize: 0
  });

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/user/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error('Error parsing user data:', e);
    }

    fetchFiles();
    fetchDecryptedFiles();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file =>
        file.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.original_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.file_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, files]);

  const fetchFiles = async () => {
    setLoading(true);
    setApiError('');
    try {
      const response = await viewFiles(email); // Make sure email is correct
      let filesData = [];
      if (Array.isArray(response.data)) {
        filesData = response.data;
      } else if (response.data.files) {
        filesData = response.data.files;
      } else if (response.data.data) {
        filesData = response.data.data;
      }

      setFiles(filesData);
      setFilteredFiles(filesData);

      // Call calculateStats to update stats
      calculateStats(filesData, decryptedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      setApiError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDecryptedFiles = async () => {
    try {
      const response = await viewDecryptedFiles(email); // Make sure email is correct
      console.log('Full Response:', response); // Log the full response to check its structure

      // Check the structure of response.data before accessing it
      let decryptedData = [];

      if (response?.data?.decrypted_files) {
        // Assuming the decrypted files are in response.data.decrypted_files
        decryptedData = response.data.decrypted_files;
      } else if (Array.isArray(response.data)) {
        // If it's already an array
        decryptedData = response.data;
      } else if (response.data.files) {
        decryptedData = response.data.files;
      } else if (response.data.data) {
        decryptedData = response.data.data;
      }

      console.log('Decrypted Data:', decryptedData); // Log decrypted data after extraction

      setDecryptedFiles(decryptedData);

      // Call calculateStats to update stats
      calculateStats(files, decryptedData);
    } catch (error) {
      console.error('Error fetching decrypted files:', error);
    }
  };

  const calculateStats = (filesData, decryptedData) => {
    const total = filesData.length;
    const encrypted = filesData.filter(f => f.is_encrypted || f.status === 'encrypted').length;
    const decrypted = decryptedData.length;

    // Calculate total size (approximate)
    const totalSize = filesData.reduce((acc, file) => acc + (file.file_size || 0), 0);

    setStats({
      totalFiles: total,
      encryptedFiles: encrypted,
      decryptedFiles: decrypted,
      totalSize: formatFileSize(totalSize)
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadChange = (e) => {
    const { name, type, files } = e.target;

    if (type === 'file') {
      const selectedFile = files[0];
      setUploadForm({
        ...uploadForm,
        file: selectedFile,
        filename: uploadForm.filename || selectedFile.name
      });
    } else {
      setUploadForm({
        ...uploadForm,
        [name]: e.target.value
      });
    }

    // Clear error
    if (uploadErrors[name]) {
      setUploadErrors({
        ...uploadErrors,
        [name]: ''
      });
    }
  };

  const validateUpload = () => {
    const errors = {};

    if (!uploadForm.filename) {
      errors.filename = 'Filename is required';
    }

    if (!uploadForm.file) {
      errors.file = 'Please select a file to upload';
    }

    return errors;
  };
  const email = localStorage.getItem("email");
  console.log(email);

  const handleUpload = async (e) => {
    e.preventDefault();

    const errors = validateUpload();
    if (Object.keys(errors).length > 0) {
      setUploadErrors(errors);
      return;
    }

    setUploadLoading(true);
    setApiError('');

    try {
      const formData = new FormData();

      // IMPORTANT: Add the email from user object to the form data
      // This will be sent to the backend and stored in session
      if (user && user.email) {
        formData.append('email', user.email);
      }

      formData.append('filename', uploadForm.filename);
      formData.append('file', uploadForm.file);
      formData.append('email', email)
      const response = await uploadFile(formData);
      console.log('Upload response:', response.data);

      setSuccessMessage('File uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({ filename: '', file: null });
      fetchFiles();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setApiError(error.response?.data?.message || error.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDecrypt = async (fileId) => {
    setDecryptLoading(prev => ({ ...prev, [fileId]: true }));
    setApiError('');  // Reset the error message

    try {
      const response = await decryptFile(fileId);  // Call decryptFile from the API service
      console.log('Decrypt response:', response.data);

      // Update success message and refetch files
      setSuccessMessage('File decrypted successfully!');
      fetchDecryptedFiles();  // Refetch decrypted files to update the UI

      setTimeout(() => setSuccessMessage(''), 3000);  // Clear success message after 3 seconds
    } catch (error) {
      console.error('Decrypt error:', error);
      // Set the appropriate error message from the API response
      setApiError(error.response?.data?.message || 'Failed to decrypt file');
    } finally {
      // Set the decrypt loading state to false for this file
      setDecryptLoading(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const handleDownload = async (fileId, filename) => {
    setDownloadLoading(prev => ({ ...prev, [fileId]: true }));

    try {
      const response = await downloadFile(fileId);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `file-${fileId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccessMessage('File downloaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Download error:', error);
      setApiError('Failed to download file');
    } finally {
      setDownloadLoading(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/user/login');
  };

  const viewFileDetails = (file) => {
    setSelectedFile(file);
    setShowFileModal(true);
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) {
      return <PhotoIcon className="w-8 h-8 text-blue-400" />;
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
      return <VideoCameraIcon className="w-8 h-8 text-purple-400" />;
    } else if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
      return <MusicalNoteIcon className="w-8 h-8 text-green-400" />;
    } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) {
      return <DocumentTextIcon className="w-8 h-8 text-red-400" />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return <ArchiveBoxIcon className="w-8 h-8 text-yellow-400" />;
    } else {
      return <DocumentIcon className="w-8 h-8 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    EVHSS
                  </span>
                  <p className="text-xs text-gray-500">User Dashboard</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{user?.name || user?.email}</span>
                </div>

                <button
                  onClick={fetchFiles}
                  className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Refresh"
                >
                  <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Dashboard Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Messages */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
              <p className="text-red-400 text-sm">{apiError}</p>
              <button onClick={() => setApiError('')} className="text-red-400 hover:text-red-300">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
              <p className="text-green-400 text-sm flex items-center">
                <CheckBadgeIcon className="w-5 h-5 mr-2" />
                {successMessage}
              </p>
              <button onClick={() => setSuccessMessage('')} className="text-green-400 hover:text-green-300">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Welcome Banner */}
          <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-400">
              Manage your encrypted files securely with homomorphic encryption
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Total Files',
                value: stats.totalFiles,
                icon: <DocumentIcon className="w-8 h-8" />,
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                label: 'Encrypted Files',
                value: stats.encryptedFiles,
                icon: <LockClosedIcon className="w-8 h-8" />,
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                label: 'Decrypted Files',
                value: stats.decryptedFiles,
                icon: <ShieldCheckIcon className="w-8 h-8" />,
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                label: 'Total Storage',
                value: stats.totalSize,
                icon: <FolderIcon className="w-8 h-8" />,
                gradient: 'from-yellow-500 to-orange-500'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} p-2.5`}>
                    {stat.icon}
                  </div>
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                </div>
                <h3 className="text-gray-400 text-sm">{stat.label}</h3>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>Upload New File</span>
            </button>

            <button
              onClick={() => setShowDecryptedModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              <ShieldCheckIcon className="w-5 h-5" />
              <span>View Decrypted Files ({stats.decryptedFiles})</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files by name or type..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FolderIcon className="w-5 h-5" />
              <span>{filteredFiles.length} files found</span>
            </div>
          </div>

          {/* Files Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-20">
                <DocumentIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No files found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Upload your first file to get started
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Upload File
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">File</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Uploaded</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.filename || file.original_name)}
                            <div>
                              <p className="text-white font-medium">{file.filename || file.original_name}</p>
                              <p className="text-xs text-gray-500">ID: {file.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-gray-300">{formatDate(file.uploaded_at || file.time)}</span>
                        </td>
                        <td className="px-6 py-4">
                          {file.is_encrypted || file.status === 'Encrypted' ? (
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold flex items-center w-fit">
                              <LockClosedIcon className="w-3 h-3 mr-1" />
                              Encrypted
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center w-fit">
                              <ShieldCheckIcon className="w-3 h-3 mr-1" />
                              Decrypted
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleDecrypt(file.id)}
                              className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                              title="View Details"
                            >
                              Decrypt
                            </button>

                            {file.is_encrypted || file.status === 'Encrypted' ? (
                              <button
                                onClick={() => handleDecrypt(file.id)}
                                disabled={decryptLoading[file.id]}
                                className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-all disabled:opacity-50"
                                title="Decrypt File"
                              >
                                {decryptLoading[file.id] ? (
                                  <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <LockClosedIcon className="w-5 h-5" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDownload(file.id, file.filename || file.original_name)}
                                disabled={downloadLoading[file.id]}
                                className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50"
                                title="Download File"
                              >
                                {downloadLoading[file.id] ? (
                                  <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <ArrowDownTrayIcon className="w-5 h-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}></div>

          <div className="relative bg-[#0B1120] border border-white/10 rounded-2xl max-w-lg w-full">
            <div className="border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Upload File</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filename <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="filename"
                  value={uploadForm.filename}
                  onChange={handleUploadChange}
                  className={`w-full px-4 py-3 bg-white/5 border ${uploadErrors.filename ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter filename"
                />
                {uploadErrors.filename && (
                  <p className="mt-1 text-sm text-red-400">{uploadErrors.filename}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select File <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="file"
                    onChange={handleUploadChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex items-center justify-center w-full p-4 border-2 border-dashed ${uploadErrors.file ? 'border-red-500' : 'border-white/10'
                      } rounded-xl cursor-pointer hover:border-purple-500 transition-colors`}
                  >
                    {uploadForm.file ? (
                      <div className="text-center">
                        <DocumentIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-white">{uploadForm.file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(uploadForm.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CloudArrowUpIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">Click to select a file</p>
                        <p className="text-xs text-gray-500 mt-1">Any file type supported</p>
                      </div>
                    )}
                  </label>
                </div>
                {uploadErrors.file && (
                  <p className="mt-1 text-sm text-red-400">{uploadErrors.file}</p>
                )}
              </div>

              {/* Hidden email field - will be sent with the form */}
              {user && user.email && (
                <input type="hidden" name="email" value={user.email} />
              )}

              <button
                type="submit"
                disabled={uploadLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
              >
                {uploadLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload File'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {showFileModal && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowFileModal(false)}></div>

          <div className="relative bg-[#0B1120] border border-white/10 rounded-2xl max-w-2xl w-full">
            <div className="border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">File Details</h2>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  {getFileIcon(selectedFile.filename || selectedFile.original_name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedFile.filename || selectedFile.original_name}</h3>
                  <p className="text-gray-400">File ID: {selectedFile.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">File Type</p>
                  <p className="text-white font-semibold">
                    {selectedFile.file_type || (selectedFile.filename?.split('.').pop() || 'unknown').toUpperCase()}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">File Size</p>
                  <p className="text-white font-semibold">{formatFileSize(selectedFile.file_size || 0)}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Upload Date</p>
                  <p className="text-white font-semibold">{formatDate(selectedFile.uploaded_at || selectedFile.created_at)}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className="text-white font-semibold capitalize">
                    {selectedFile.is_encrypted || selectedFile.status === 'encrypted' ? 'Encrypted' : 'Decrypted'}
                  </p>
                </div>
              </div>

              {selectedFile.description && (
                <div className="mt-4 bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-white">{selectedFile.description}</p>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                {selectedFile.is_encrypted || selectedFile.status === 'encrypted' ? (
                  <button
                    onClick={() => {
                      handleDecrypt(selectedFile.id);
                      setShowFileModal(false);
                    }}
                    className="flex-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 py-3 rounded-xl font-semibold hover:bg-purple-500/20 transition-all"
                  >
                    Decrypt File
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleDownload(selectedFile.id, selectedFile.filename || selectedFile.original_name);
                      setShowFileModal(false);
                    }}
                    className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 py-3 rounded-xl font-semibold hover:bg-green-500/20 transition-all"
                  >
                    Download File
                  </button>
                )}
                <button
                  onClick={() => setShowFileModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decrypted Files Modal */}
      {showDecryptedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDecryptedModal(false)}></div>

          <div className="relative bg-[#0B1120] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B1120] border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Decrypted Files</h2>
              <button
                onClick={() => setShowDecryptedModal(false)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {decryptedFiles.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheckIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No decrypted files yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Decrypt your files to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {decryptedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        {getFileIcon(file.filename || file.original_name)}
                        <div>
                          <p className="text-white font-medium">{file.filename || file.original_name}</p>
                          <p className="text-sm text-gray-500">ID: {file.id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(file.id, file.filename || file.original_name)}
                        disabled={downloadLoading[file.id]}
                        className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition-all"
                      >
                        {downloadLoading[file.id] ? (
                          <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;