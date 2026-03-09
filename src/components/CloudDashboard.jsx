import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  XCircleIcon,
  UserGroupIcon,
  DocumentIcon,
  ChartBarIcon,
  CloudIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  IdentificationIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  FolderIcon,
  DocumentTextIcon,
  ClockIcon,
  LockClosedIcon,
  LockOpenIcon,
  ArrowDownTrayIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { viewAllUsers, authorizeUser, unauthorizeUser, viewAllFiles } from '../services/api';

const CloudDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'files'
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    authorizedUsers: 0,
    totalFiles: 0,
    encryptedFiles: 0
  });
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchFiles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contact?.includes(searchTerm) ||
        user.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    if (fileSearchTerm.trim() === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file =>
        file.filename?.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
        file.file_extension?.toLowerCase().includes(fileSearchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [fileSearchTerm, files]);

  const fetchUsers = async () => {
    setLoading(true);
    setApiError('');
    try {
      const response = await viewAllUsers();
      console.log('Users response:', response.data);

      let usersData = [];
      if (response.data && response.data.users) {
        usersData = response.data.users;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data && response.data.data) {
        usersData = response.data.data;
      }

      // Ensure each user has a status field
      usersData = usersData.map(user => ({
        ...user,
        status: user.status || 'pending'
      }));

      setUsers(usersData);
      setFilteredUsers(usersData);
      calculateStats(usersData, files);
    } catch (error) {
      console.error('Error fetching users:', error);
      setApiError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await viewAllFiles();
      console.log('Files response:', response.data);

      let filesData = [];
      if (response.data && response.data.files) {
        filesData = response.data.files;
      } else if (Array.isArray(response.data)) {
        filesData = response.data;
      }

      setFiles(filesData);
      setFilteredFiles(filesData);
      calculateStats(users, filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
      setApiError('Failed to load files. Please try again.');
    } finally {
      setFilesLoading(false);
    }
  };

  const calculateStats = (usersData, filesData) => {
    const total = usersData.length;
    const active = usersData.filter(u => u.status === 'Active' || u.status === 'active' || u.status === 'Authorized').length;
    const pending = usersData.filter(u => u.status === 'Pending' || u.status === 'pending').length;
    const authorized = usersData.filter(u => u.status === 'Authorized').length;

    setStats({
      totalUsers: total,
      activeUsers: active,
      pendingUsers: pending,
      authorizedUsers: authorized,
      totalFiles: filesData.length,
      encryptedFiles: filesData.length // All files are encrypted initially
    });
  };

  const handleAuthorize = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: 'authorize' }));
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await authorizeUser(userId);
      console.log('Authorize response:', response.data);

      if (response.data && response.data.message) {
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, status: 'Authorized' } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        calculateStats(updatedUsers, files);
        setSuccessMessage(response.data.message || 'User authorized successfully');
      } else {
        setApiError('Failed to authorize user: Unexpected response');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error authorizing user:', error);
      setApiError(error.response?.data?.message || 'Failed to authorize user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const handleUnauthorize = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: 'unauthorize' }));
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await unauthorizeUser(userId);
      console.log('Unauthorize response:', response.data);

      if (response.data && response.data.message) {
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, status: 'Un Authorized' } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        calculateStats(updatedUsers, files);
        setSuccessMessage(response.data.message || 'User unauthorized successfully');
      } else {
        setApiError('Failed to unauthorize user: Unexpected response');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error unauthorizing user:', error);
      setApiError(error.response?.data?.message || 'Failed to unauthorize user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/cloud/login');
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const viewFileDetails = (file) => {
    setSelectedFile(file);
    setShowFileModal(true);
  };

  const downloadFile = (file) => {
    // Create a download link for the file
    const link = document.createElement('a');
    link.href = file.file_url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (user) => {
    const status = user.status?.toLowerCase();

    if (status === 'authorized') {
      return (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center w-fit">
          <CheckBadgeIcon className="w-4 h-4 mr-1" />
          Authorized
        </span>
      );
    } else if (status === 'active') {
      return (
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold flex items-center w-fit">
          <UserIcon className="w-4 h-4 mr-1" />
          Active
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center w-fit">
          <ArrowPathIcon className="w-4 h-4 mr-1" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold flex items-center w-fit">
          <XCircleIcon className="w-4 h-4 mr-1" />
          {user.status === 'Un Authorized' ? 'Unauthorized' : 'Inactive'}
        </span>
      );
    }
  };

  const formatFileSize = (data) => {
    // Approximate file size based on data length
    const sizeInBytes = data.length / 2; // Hex data approximation
    if (sizeInBytes < 1024) return `${sizeInBytes.toFixed(2)} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (extension) => {
    switch (extension) {
      case '.txt':
        return <DocumentTextIcon className="w-5 h-5 text-blue-400" />;
      case '.pdf':
        return <DocumentTextIcon className="w-5 h-5 text-red-400" />;
      case '.jpg':
      case '.jpeg':
      case '.png':
        return <DocumentTextIcon className="w-5 h-5 text-green-400" />;
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
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
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CloudIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Cloud Provider
                  </span>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    fetchUsers();
                    fetchFiles();
                  }}
                  className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Refresh"
                >
                  <ArrowPathIcon className={`w-5 h-5 ${loading || filesLoading ? 'animate-spin' : ''}`} />
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Total Users',
                value: stats.totalUsers,
                icon: <UserGroupIcon className="w-8 h-8" />,
                gradient: 'from-blue-500 to-cyan-500',
                change: 'Registered users'
              },
              {
                label: 'Authorized Users',
                value: stats.authorizedUsers,
                icon: <ShieldCheckIcon className="w-8 h-8" />,
                gradient: 'from-green-500 to-emerald-500',
                change: `${Math.round((stats.authorizedUsers / stats.totalUsers) * 100 || 0)}% of total`
              },
              {
                label: 'Total Files',
                value: stats.totalFiles,
                icon: <FolderIcon className="w-8 h-8" />,
                gradient: 'from-purple-500 to-pink-500',
                change: 'Encrypted files'
              },
              {
                label: 'Pending Users',
                value: stats.pendingUsers,
                icon: <ArrowPathIcon className="w-8 h-8" />,
                gradient: 'from-yellow-500 to-orange-500',
                change: 'Awaiting approval'
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
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-white/10">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-3 px-1 text-sm font-medium transition-all relative ${
                  activeTab === 'users'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-4 h-4" />
                  <span>Users Management</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`pb-3 px-1 text-sm font-medium transition-all relative ${
                  activeTab === 'files'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FolderIcon className="w-4 h-4" />
                  <span>Files Management</span>
                </div>
              </button>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              {/* Search Bar for Users */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name, email, phone..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <UsersIcon className="w-5 h-5" />
                  <span>{filteredUsers.length} users found</span>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-20">
                    <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No users found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Contact</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Authorization</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{user.name || 'N/A'}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="text-gray-300 text-sm flex items-center">
                                  <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                                  {user.contact || 'N/A'}
                                </p>
                                <p className="text-gray-300 text-sm flex items-center">
                                  <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                                  {user.address ? user.address.substring(0, 30) + '...' : 'N/A'}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(user)}
                            </td>
                            <td className="px-6 py-4">
                              {user.status === 'Authorized' ? (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                                  Authorized
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                                  {user.status === 'Un Authorized' ? 'Unauthorized' : 'Not Authorized'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end space-x-2">
                                {user.status === 'Authorized' ? (
                                  <button
                                    onClick={() => handleUnauthorize(user.id)}
                                    disabled={actionLoading[user.id] === 'unauthorize'}
                                    className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Unauthorize User"
                                  >
                                    {actionLoading[user.id] === 'unauthorize' ? (
                                      <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <ShieldExclamationIcon className="w-5 h-5" />
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAuthorize(user.id)}
                                    disabled={actionLoading[user.id] === 'authorize'}
                                    className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Authorize User"
                                  >
                                    {actionLoading[user.id] === 'authorize' ? (
                                      <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <ShieldCheckIcon className="w-5 h-5" />
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
            </>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <>
              {/* Search Bar for Files */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={fileSearchTerm}
                    onChange={(e) => setFileSearchTerm(e.target.value)}
                    placeholder="Search files by name..."
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
                {filesLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="text-center py-20">
                    <FolderIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No files found</p>
                    <p className="text-gray-500 text-sm mt-2">Files will appear here once uploaded</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">File Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Size</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                          {/* <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th> */}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredFiles.map((file, index) => (
                          <tr key={index} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                  {getFileIcon(file.file_extension)}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{file.filename}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date().toLocaleDateString()} {/* You can add actual date if available */}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-300 text-sm">
                                {file.file_extension || '.txt'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-300 text-sm">
                                {formatFileSize(file.filedata)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center w-fit">
                                <LockClosedIcon className="w-3 h-3 mr-1" />
                                Encrypted
                              </span>
                            </td>
                            {/* <td className="px-6 py-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => downloadFile(file)}
                                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                  title="Download File"
                                >
                                  <ArrowDownTrayIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Quick Stats Footer */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Authorization Rate</span>
                <span className="text-white font-semibold">
                  {Math.round((stats.authorizedUsers / stats.totalUsers) * 100 || 0)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${(stats.authorizedUsers / stats.totalUsers) * 100 || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Users</span>
                <span className="text-white font-semibold">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100 || 0)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100 || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Encrypted Files</span>
                <span className="text-white font-semibold">{stats.totalFiles}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUserModal(false)}></div>

          <div className="relative bg-[#0B1120] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B1120] border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                  {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedUser.name || 'N/A'}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(selectedUser)}
                    {selectedUser.status === 'Authorized' ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        Authorized
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                        {selectedUser.status === 'Un Authorized' ? 'Unauthorized' : 'Not Authorized'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <IdentificationIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">User ID</span>
                  </div>
                  <p className="text-white font-mono">{selectedUser.id}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="text-white">{selectedUser.email}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">Contact</span>
                  </div>
                  <p className="text-white">{selectedUser.contact || 'N/A'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">Date of Birth</span>
                  </div>
                  <p className="text-white">{selectedUser.dob || 'N/A'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <UserIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">Gender</span>
                  </div>
                  <p className="text-white">{selectedUser.gender || 'N/A'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">Status</span>
                  </div>
                  <p className="text-white capitalize">{selectedUser.status || 'N/A'}</p>
                </div>
              </div>

              {/* Address */}
              <div className="mt-4 bg-white/5 rounded-xl p-4">
                <div className="flex items-center text-gray-400 mb-2">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span className="text-sm">Address</span>
                </div>
                <p className="text-white">{selectedUser.address || 'N/A'}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                {selectedUser.status === 'Authorized' ? (
                  <button
                    onClick={() => {
                      handleUnauthorize(selectedUser.id);
                      setShowUserModal(false);
                    }}
                    className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-500/20 transition-all flex items-center justify-center"
                  >
                    <ShieldExclamationIcon className="w-5 h-5 mr-2" />
                    Unauthorize User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleAuthorize(selectedUser.id);
                      setShowUserModal(false);
                    }}
                    className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 py-3 rounded-xl font-semibold hover:bg-green-500/20 transition-all flex items-center justify-center"
                  >
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Authorize User
                  </button>
                )}
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {showFileModal && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowFileModal(false)}></div>

          <div className="relative bg-[#0B1120] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B1120] border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">File Details</h2>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* File Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  {getFileIcon(selectedFile.file_extension)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedFile.filename}</h3>
                  <p className="text-gray-400">{selectedFile.file_extension || '.txt'}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center">
                      <LockClosedIcon className="w-3 h-3 mr-1" />
                      Encrypted
                    </span>
                  </div>
                </div>
              </div>

              {/* File Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">File Name</span>
                  </div>
                  <p className="text-white">{selectedFile.filename}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">File Type</span>
                  </div>
                  <p className="text-white">{selectedFile.file_extension || '.txt'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <FolderIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">File Size</span>
                  </div>
                  <p className="text-white">{formatFileSize(selectedFile.filedata)}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center text-gray-400 mb-2">
                    <LockClosedIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">Encryption Status</span>
                  </div>
                  <p className="text-white">AES Encrypted</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 md:col-span-2">
                  <div className="flex items-center text-gray-400 mb-2">
                    <span className="text-sm">File URL</span>
                  </div>
                  <p className="text-white text-sm break-all">{selectedFile.file_url}</p>
                </div>
              </div>

              {/* File Data Preview */}
              <div className="mt-4 bg-white/5 rounded-xl p-4">
                <div className="flex items-center text-gray-400 mb-2">
                  <span className="text-sm">Encrypted Data Preview</span>
                </div>
                <p className="text-gray-300 text-xs font-mono break-all">
                  {selectedFile.filedata?.substring(0, 200)}
                  {selectedFile.filedata?.length > 200 && '...'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    downloadFile(selectedFile);
                    setShowFileModal(false);
                  }}
                  className="flex-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 py-3 rounded-xl font-semibold hover:bg-purple-500/20 transition-all flex items-center justify-center"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Download File
                </button>
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
    </div>
  );
};

export default CloudDashboard;