import React, { useState, useEffect, useRef } from "react";
import { Edit3, X } from "lucide-react";

export default function UserEditAcc() {
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!userData || !userData.id || !token) {
          throw new Error("User not authenticated");
        }

        const response = await fetch(
          `http://localhost:3000/api/get-user/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const result = await response.json();
        if (!result.status) {
          throw new Error(result.msg || "Failed to fetch user data");
        }

        const user = result.user.user; // Based on your backend structure
        const newFormData = {
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          username: user.username || "",
          email: user.email || "",
        };
        setFormData(newFormData);
        setInitialFormData(newFormData);
        setProfileImage(user.user_img || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors({
          general:
            error.message || "Failed to load user data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ image: "Please select image files only (PNG, JPG)." });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: "Image size must be less than 5MB." });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Open file input
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // Validation rules
  const validateForm = (data) => {
    const errors = {};

    if (!data.firstname) {
      errors.firstname = "First name is required";
    } else if (data.firstname.length > 50) {
      errors.firstname = "First name must be 50 characters or less";
    }

    if (!data.lastname) {
      errors.lastname = "Last name is required";
    } else if (data.lastname.length > 50) {
      errors.lastname = "Last name must be 50 characters or less";
    }

    if (!data.username) {
      errors.username = "Username is required";
    } else if (data.username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    } else if (data.username.length > 30) {
      errors.username = "Username must be 30 characters or less";
    }

    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    return errors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSave = async () => {
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!userData || !userData.id || !token) {
        throw new Error("User not authenticated");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstname);
      formDataToSend.append("lastName", formData.lastname);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      if (imageFile) {
        formDataToSend.append("profileImage", imageFile);
      }

      const response = await fetch(
        `http://localhost:3000/api/update-user/${userData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update account");
      }

      const result = await response.json();
      if (!result.status) {
        throw new Error(result.msg || "Failed to update account");
      }

      const updatedUser = result.updatedUser;

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id,
          username: updatedUser.username,
          email: updatedUser.email,
          img_url: updatedUser.user_img,
        }),
      );

      // Update form state
      const newFormData = {
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        username: updatedUser.username,
        email: updatedUser.email,
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setProfileImage(updatedUser.user_img);
      setImageFile(null);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving account:", error);
      setErrors({
        general: error.message || "Failed to update account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (initialFormData) {
      setFormData(initialFormData);
      // Reset to original image if we had one
      const userData = JSON.parse(localStorage.getItem("user"));
      setProfileImage(userData?.img_url || null);
    }
    setImageFile(null);
    setErrors({});
    setSuccessMessage("");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Dismiss success message
  const dismissSuccess = () => {
    setSuccessMessage("");
  };

  // Dismiss error message
  const dismissError = () => {
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex-col min-h-screen bg-[#E3E7E0] md:ml-60 ml-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-7 w-full max-w-5xl animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex md:flex-row flex-col items-start md:gap-12 gap-6">
            <div className="flex-shrink-0 md:mx-0 mx-auto">
              <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mt-2 mx-auto"></div>
            </div>
            <div className="flex-1 space-y-5 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col min-h-screen bg-[#E3E7E0] md:ml-60 ml-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-7 w-full max-w-5xl transition-all duration-300">
        <h1 className="md:ml-5 ml-0 text-center md:text-left text-[35px] font-bold text-[#53675E] mb-8">
          Edit Profile
        </h1>

        {errors.general && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center animate-slide-in">
            <span>{errors.general}</span>
            <button onClick={dismissError} aria-label="Dismiss error">
              <X size={20} className="text-red-700 hover:text-red-900" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center animate-slide-in">
            <span>{successMessage}</span>
            <button
              onClick={dismissSuccess}
              aria-label="Dismiss success message"
            >
              <X size={20} className="text-green-700 hover:text-green-900" />
            </button>
          </div>
        )}

        <div className="flex md:flex-row flex-col items-start md:gap-12 gap-8">
          {/* Profile Picture Section */}
          <div className="flex-shrink-0 md:mx-0 mx-auto">
            <div className="relative group">
              <div className="w-48 h-48 bg-[#F4F3F3] rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:ring-2 group-hover:ring-[#5AA67E]">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover transition-opacity duration-200"
                  />
                ) : (
                  <div className="text-[#53675E] text-center">
                    <div className="font-light text-[14px]">No Image</div>
                  </div>
                )}
              </div>
              <button
                onClick={handleEditClick}
                className="absolute bottom-3 right-3 bg-[#5AA67E] hover:bg-green-700 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5AA67E]"
                aria-label="Edit profile picture"
              >
                <Edit3 size={18} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageUpload}
                className="hidden"
                aria-hidden="true"
              />
            </div>
            <div className="text-center font-light text-[14px] mt-2 text-sm text-[#9D9191]">
              <p>Click to upload (PNG, JPG, max 5MB)</p>
              {errors.image && (
                <p className="text-[#D37070] text-sm mt-1 animate-fade-in">
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-6 w-full">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstname"
                className="block text-[#53675E] text-sm font-medium mb-1"
              >
                First Name
              </label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                placeholder="Enter first name"
                value={formData.firstname}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 font-light text-[16px] bg-[#F4F3F3] rounded-[8px] border-none focus:outline-none focus:ring-2 transition-all duration-200 ${errors.firstname
                    ? "ring-2 ring-[#D37070]"
                    : "focus:ring-[#5AA67E]"
                  }`}
                aria-invalid={errors.firstname ? "true" : "false"}
                aria-describedby={
                  errors.firstname ? "firstname-error" : undefined
                }
              />
              {errors.firstname && (
                <p
                  id="firstname-error"
                  className="text-[#D37070] text-sm mt-1 px-1 animate-fade-in"
                >
                  {errors.firstname}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastname"
                className="block text-[#53675E] text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                placeholder="Enter last name"
                value={formData.lastname}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 font-light text-[16px] bg-[#F4F3F3] rounded-[8px] border-none focus:outline-none focus:ring-2 transition-all duration-200 ${errors.lastname
                    ? "ring-2 ring-[#D37070]"
                    : "focus:ring-[#5AA67E]"
                  }`}
                aria-invalid={errors.lastname ? "true" : "false"}
                aria-describedby={
                  errors.lastname ? "lastname-error" : undefined
                }
              />
              {errors.lastname && (
                <p
                  id="lastname-error"
                  className="text-[#D37070] text-sm mt-1 px-1 animate-fade-in"
                >
                  {errors.lastname}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-[#53675E] text-sm font-medium mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 font-light text-[16px] bg-[#F4F3F3] rounded-[8px] border-none focus:outline-none focus:ring-2 transition-all duration-200 ${errors.username
                    ? "ring-2 ring-[#D37070]"
                    : "focus:ring-[#5AA67E]"
                  }`}
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
              />
              {errors.username && (
                <p
                  id="username-error"
                  className="text-[#D37070] text-sm mt-1 px-1 animate-fade-in"
                >
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[#53675E] text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 font-light text-[16px] bg-[#F4F3F3] rounded-[8px] border-none focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                    ? "ring-2 ring-[#D37070]"
                    : "focus:ring-[#5AA67E]"
                  }`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-[#D37070] text-sm mt-1 px-1 animate-fade-in"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`font-medium px-7 py-2 rounded-full border border-[#53675E] text-[#53675E] hover:bg-[#F4F3F3] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53675E] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                aria-label="Cancel changes"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`font-medium px-7 py-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5AA67E] ${isSubmitting
                    ? "bg-[#5AA67E] text-white cursor-not-allowed opacity-50"
                    : "bg-[#5AA67E] hover:bg-green-700 text-white"
                  }`}
                aria-label="Save changes"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.653z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="block md:hidden underline text-[14px] font-medium text-[#C45153] mt-10 text-center hover:text-[#D37070] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C45153]"
        aria-label="Log out"
      >
        Log out
      </button>
    </div>
  );
}
