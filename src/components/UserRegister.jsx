import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  DocumentIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  PhotoIcon,
  IdentificationIcon,
  CakeIcon
} from '@heroicons/react/24/outline';
import { userRegister } from '../services/api';

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    contact: '',
    address: '',
    status: 'Active',
    profile: null
  });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files[0]) {
      setFormData({
        ...formData,
        profile: files[0]
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 18) {
        newErrors.dob = 'You must be at least 18 years old';
      }
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.contact) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Please enter your complete address';
    }
    
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleNextStep = () => {
    let stepErrors = {};
    
    if (step === 1) {
      stepErrors = validateStep1();
    } else if (step === 2) {
      stepErrors = validateStep2();
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate current step
    const step3Errors = validateStep3();
    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors);
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData object for multipart/form-data
      const registerFormData = new FormData();
      registerFormData.append('name', formData.name);
      registerFormData.append('email', formData.email);
      registerFormData.append('password', formData.password);
      registerFormData.append('dob', formData.dob);
      registerFormData.append('gender', formData.gender);
      registerFormData.append('contact', formData.contact);
      registerFormData.append('address', formData.address);
      registerFormData.append('status', formData.status);
      
      // Append profile photo if selected
      if (formData.profile) {
        registerFormData.append('profile', formData.profile);
      }
      
      const response = await userRegister(registerFormData);
      
      if (response.data) {
        // Show success and redirect to login
        navigate('/user/login', { 
          state: { 
            message: 'Registration successful! Please login with your credentials.' 
          } 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Registration failed. Please check all fields and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Registration Form */}
      <div className="relative z-10 w-full lg:w-3/5 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-2xl py-8">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VHSS
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join EVHSS for secure cloud computing</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 1 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
              }`}>
                <span className="text-sm font-semibold text-white">1</span>
              </div>
              <div className={`flex-1 h-1 mx-2 transition-all ${
                step >= 2 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
              }`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 2 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
              }`}>
                <span className="text-sm font-semibold text-white">2</span>
              </div>
              <div className={`flex-1 h-1 mx-2 transition-all ${
                step >= 3 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
              }`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 3 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
              }`}>
                <span className="text-sm font-semibold text-white">3</span>
              </div>
            </div>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{apiError}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${
                        errors.name ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${
                        errors.email ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CakeIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${
                        errors.dob ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                    />
                  </div>
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-400">{errors.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdentificationIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${
                        errors.gender ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none`}
                    >
                      <option value="" className="bg-gray-800">Select Gender</option>
                      <option value="Male" className="bg-gray-800">Male</option>
                      <option value="Female" className="bg-gray-800">Female</option>
                      <option value="Other" className="bg-gray-800">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-400">{errors.gender}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
                
                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${
                        errors.contact ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength="10"
                    />
                  </div>
                  {errors.contact && (
                    <p className="mt-1 text-sm text-red-400">{errors.contact}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${
                        errors.address ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-400">{errors.address}</p>
                  )}
                </div>

                {/* Profile Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-20 h-20 rounded-xl object-cover border-2 border-purple-500"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <PhotoIcon className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="file"
                          name="profile"
                          onChange={handleChange}
                          accept="image/*"
                          className="hidden"
                          id="profile-upload"
                        />
                        <label
                          htmlFor="profile-upload"
                          className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all cursor-pointer"
                        >
                          <PhotoIcon className="w-5 h-5 mr-2" />
                          Choose Photo
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status (Hidden - Auto set to Active) */}
                <input type="hidden" name="status" value="Active" />
              </div>
            )}

            {/* Step 3: Security */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-white mb-4">Security</h3>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-3 bg-white/5 border ${
                        errors.password ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-3 bg-white/5 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400 mb-2">Password strength:</p>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className={`h-2 rounded-full transition-all ${
                        formData.password.length < 6 ? 'w-1/3 bg-red-500' :
                        formData.password.length < 8 ? 'w-2/3 bg-yellow-500' :
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password) ? 'w-full bg-green-500' : 'w-2/3 bg-yellow-500'
                      }`}></div>
                    </div>
                    <ul className="space-y-1">
                      <li className="flex items-center text-xs text-gray-400">
                        <CheckBadgeIcon className={`w-4 h-4 mr-2 ${
                          formData.password.length >= 6 ? 'text-green-500' : 'text-gray-500'
                        }`} />
                        At least 6 characters
                      </li>
                      <li className="flex items-center text-xs text-gray-400">
                        <CheckBadgeIcon className={`w-4 h-4 mr-2 ${
                          /[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'
                        }`} />
                        Contains uppercase letter
                      </li>
                      <li className="flex items-center text-xs text-gray-400">
                        <CheckBadgeIcon className={`w-4 h-4 mr-2 ${
                          /[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'
                        }`} />
                        Contains lowercase letter
                      </li>
                      <li className="flex items-center text-xs text-gray-400">
                        <CheckBadgeIcon className={`w-4 h-4 mr-2 ${
                          /\d/.test(formData.password) ? 'text-green-500' : 'text-gray-500'
                        }`} />
                        Contains number
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 bg-white/10 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
                >
                  Continue
                  <ArrowRightIcon className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRightIcon className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/user/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual Content */}
      <div className="hidden lg:block lg:w-2/5 relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative">
            {/* Floating Elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
            
            {/* Benefits Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md">
              <h3 className="text-2xl font-bold text-white mb-6">Why Join EVHSS?</h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <ShieldCheckIcon className="w-6 h-6" />,
                    title: 'Military-Grade Security',
                    description: 'Your data is protected with homomorphic encryption'
                  },
                  {
                    icon: <DocumentIcon className="w-6 h-6" />,
                    title: '10GB Free Storage',
                    description: 'Get started with 10GB of secure cloud storage'
                  },
                  {
                    icon: <CheckBadgeIcon className="w-6 h-6" />,
                    title: 'Verifiable Computations',
                    description: 'Verify every operation performed on your data'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Active Users</span>
                  <span className="text-sm text-green-400">+2,500 this week</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div className="w-3/4 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserRegister;