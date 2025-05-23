import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Edit3 } from 'lucide-react';

export default function UserEditAcc() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

//upload pic
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // img file?
      if (!file.type.startsWith('image/')) {
        alert('Please select image files only.');
        return;
      }
    
      // url for preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

//open input file 
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // Validation rules
  const validateForm = (data) => {
    const errors = {};

    if (!data.username) {
      errors.username = 'Username is required';
    } else if (data.username.length < 6) {
      errors.username = 'Username must be at least 6 characters';
    }

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving account data:', formData);
      console.log('Profile image:', profileImage);
      alert('Account updated successfully!');
      setErrors({});
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to update account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    //responsive
    <div className=" flex-col min-h-screen bg-[#E3E7E0] md:ml-60 ml-0 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-3xl shadow-lg p-7 w-full max-w-5xl">
        <h1 className="md:ml-5 ml-0 text-center md:text-left text-[35px] font-bold text-[#53675E] mb-8">Account</h1>
        
        <div className="flex md:flex-row flex-col items-start md:gap-12 gap-6">
          {/* Profile Picture Section */}
          <div className="flex-shrink-0 md:mx-0 mx-auto">
            <div className="relative">
              {/* Profile image*/}
              <div className="w-48 h-48 bg-[#F4F3F3] rounded-full overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[#53675E] text-center">
                    <div className="font-light text-[14px]">No Image</div>
                  </div>
                )}
              </div>
              
              {/* edit */}
              <button
                onClick={handleEditClick}
                className="absolute bottom-3 right-3 bg-gray-300 hover:bg-gray-500 rounded-full p-2 transition-colors duration-200"
              >
                <Edit3 size={18} className="text-white" />
              </button>
              
              {/* Input for select file*/}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            

            <div className="text-center font-light text-[14px] mt-2 text-sm text-[#9D9191]">
              <p>Click edit to upload</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-5 w-full md:w-auto">
            {/* Username Field */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 font-light text-[16px] bg-[#F4F3F3] rounded-[4px] border-none focus:outline-none focus:ring-2${
                  errors.username ? 'focus:ring-[#D37070] ring-2 ring-[#D37070]' : 'focus:ring-gray-400'
                }`}
              />
              {errors.username && (
                <p className="text-[#D37070] text-sm mt-1 px-1">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#F4F3F3] font-light text-[16px] rounded-[4px] border-none focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-[#D37070] ring-2 ring-[#D37070]' : 'focus:ring-gray-400'
                }`}
              />
              {errors.email && (
                <p className="text-[#D37070] text-[14px] mt-1 px-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#F4F3F3] font-light text-[16px] rounded-[4px] border-none focus:outline-none focus:ring-2 placeholder-gray-500 pr-12 ${
                  errors.password ? 'focus:ring-[#D37070] ring-2 ring-[#D37070]' : 'focus:ring-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-[#D37070] text-[14px] mt-1 px-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#F4F3F3] font-light text-[16px] rounded-[4px] border-none focus:outline-none focus:ring-2 placeholder-gray-500 pr-12 ${
                  errors.confirmPassword ? 'focus:ring-[#D37070] ring-2 ring-[#D37070]' : 'focus:ring-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-[#D37070] text-[14px] mt-1 px-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`font-medium px-7 py-2 rounded-full transition-colors duration-200 ${
                  isSubmitting 
                    ? 'bg-[#5AA67E] text-white cursor-not-allowed' 
                    : 'bg-[#5AA67E] hover:bg-green-700 text-[18px] font-medium text-white tracking-wide'
                }`}
              >
                {isSubmitting ? 'saving...' : 'save'}
              </button>
            </div>
          </div>
        </div>
      </div>
        <a href="/login" className="block md:hidden underline text-[14px] font-regular text-[#C45153] mt-10 text-center">
          logout
        </a>
    </div>
  );
}