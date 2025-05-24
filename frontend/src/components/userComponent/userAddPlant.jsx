import React, { useState } from "react";
import {
  Cloud,
  ChevronRight,
  Clock,
  Upload,
  Leaf,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { subscribeToPush } from "../../services/notification";

export default function UserAddPlant() {
  // Form state
  const [plantNickname, setPlantNickname] = useState("");
  const [plantName, setPlantName] = useState("");
  const [timeReminder, setTimeReminder] = useState("");
  const [plantImage, setPlantImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  // Handle image upload
  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPlantImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  // Validation
  const getFieldError = (field) => {
    if (!error) return null;
    if (field === "plantName" && !plantName.trim() && error.includes("name"))
      return "Plant name is required";
    if (
      field === "plantNickname" &&
      !plantNickname.trim() &&
      error.includes("nickname")
    )
      return "Nickname is required";
    if (field === "timeReminder" && !timeReminder && error.includes("time"))
      return "Time reminder is required";
    if (field === "image" && !plantImage && error.includes("image"))
      return "Please upload an image";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!plantName.trim()) {
      setError("Plant name is required");
      return;
    }
    if (!plantNickname.trim()) {
      setError("Plant nickname is required");
      return;
    }
    if (!timeReminder) {
      setError("Time reminder is required");
      return;
    }
    if (!plantImage) {
      setError("Please upload a plant image");
      return;
    }

    const formData = new FormData();
    formData.append("plantName", plantName);
    formData.append("plantNickName", plantNickname);
    formData.append("timeReminder", timeReminder);
    formData.append("image", plantImage);

    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
      formData.append("userId", userId);
      const sub = await subscribeToPush();
      formData.append("subscription", JSON.stringify(sub));

      const response = await fetch("http://localhost:3000/api/add-plant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add plant");
      }

      await response.json();
      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setPlantName("");
        setPlantNickname("");
        setTimeReminder("");
        setPlantImage(null);
        setImagePreview(null);
        setShowReminder(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "An error occurred while adding the plant");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plant Added Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your new plant buddy has been added to your garden collection.
            </p>
            <div className="bg-green-50 rounded-xl p-4 inline-block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{plantNickname}</p>
                  <p className="text-sm text-gray-600">{plantName}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Bell className="w-4 h-4 mr-1" />
                    Reminder set for {timeReminder}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Breadcrumb */}
        <div className="mb-8 flex items-center">
          <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
            <a href="#" className="hover:text-green-600 transition-colors">
              Home
            </a>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-green-700 font-semibold flex items-center">
              <Leaf size={14} className="mr-1" />
              Add Plant
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Add Your New Plant
            </h1>
            <p className="text-green-100 text-lg">
              Give your green friend a home in your digital garden
            </p>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg animate-in slide-in-from-left-5">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-green-600" />
                    Plant Photo
                  </h3>

                  <div
                    className={`relative group transition-all duration-300 ${
                      dragOver ? "scale-105" : "hover:scale-102"
                    }`}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div
                      className={`w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                        dragOver
                          ? "border-green-400 bg-green-50 scale-105"
                          : imagePreview
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50"
                      } ${getFieldError("image") ? "border-red-400 bg-red-50" : ""}`}
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={imagePreview}
                            alt="Plant preview"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              Click to change photo
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                              dragOver
                                ? "bg-green-200 text-green-600 scale-110"
                                : "bg-gray-200 group-hover:bg-green-200 group-hover:text-green-600 group-hover:scale-110"
                            }`}
                          >
                            <Cloud size={32} />
                          </div>
                          <p className="text-lg font-medium mb-2">
                            {dragOver
                              ? "Drop your plant photo here!"
                              : "Upload your plant photo"}
                          </p>
                          <p className="text-sm text-gray-400">
                            Drag & drop or click to browse
                          </p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </div>
                    {getFieldError("image") && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError("image")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    Plant Details
                  </h3>

                  {/* Plant Nickname */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Plant Nickname *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., Sunny, Green Buddy, My Little Friend..."
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                          focusedField === "nickname"
                            ? "border-green-400 shadow-lg shadow-green-500/10 bg-green-50/50"
                            : "border-gray-300 hover:border-green-300 bg-white"
                        } ${getFieldError("plantNickname") ? "border-red-400" : ""}`}
                        value={plantNickname}
                        onChange={(e) => setPlantNickname(e.target.value)}
                        onFocus={() => setFocusedField("nickname")}
                        onBlur={() => setFocusedField(null)}
                      />
                      {plantNickname && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {getFieldError("plantNickname") && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError("plantNickname")}
                      </p>
                    )}
                  </div>

                  {/* Plant Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Plant Species *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., Monstera Deliciosa, Snake Plant, Pothos..."
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                          focusedField === "species"
                            ? "border-green-400 shadow-lg shadow-green-500/10 bg-green-50/50"
                            : "border-gray-300 hover:border-green-300 bg-white"
                        } ${getFieldError("plantName") ? "border-red-400" : ""}`}
                        value={plantName}
                        onChange={(e) => setPlantName(e.target.value)}
                        onFocus={() => setFocusedField("species")}
                        onBlur={() => setFocusedField(null)}
                      />
                      {plantName && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {getFieldError("plantName") && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError("plantName")}
                      </p>
                    )}
                  </div>

                  {/* Time Reminder */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Care Reminder *
                    </label>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                        showReminder
                          ? "border-green-400 bg-green-50 shadow-md"
                          : "border-gray-300 bg-white hover:bg-green-50/50"
                      } ${getFieldError("timeReminder") ? "border-red-400" : ""}`}
                      onClick={() => setShowReminder(!showReminder)}
                    >
                      <div className="flex items-center text-gray-700">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <Clock size={16} className="text-green-600" />
                        </div>
                        <span>
                          {timeReminder
                            ? `Reminder set for ${timeReminder}`
                            : "Set care reminder time"}
                        </span>
                      </div>
                      <ChevronRight
                        size={18}
                        className={`text-gray-400 transition-transform duration-300 ${
                          showReminder ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {showReminder && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-in slide-in-from-top-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What time should we remind you to care for your plant?
                        </label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white"
                          value={timeReminder}
                          onChange={(e) => setTimeReminder(e.target.value)}
                        />
                      </div>
                    )}

                    {getFieldError("timeReminder") && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError("timeReminder")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className={`px-8 py-4 rounded-2xl font-semibold text-white text-lg shadow-lg transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Adding Your Plant...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Leaf className="w-5 h-5 mr-2" />
                      Add Plant to Garden
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
