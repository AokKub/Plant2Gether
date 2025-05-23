import React, { useState } from "react";
import { Cloud, ChevronRight, Clock } from "lucide-react";
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

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlantImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      // Reset form
      setPlantName("");
      setPlantNickname("");
      setTimeReminder("");
      setPlantImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message || "An error occurred while adding the plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 flex items-center text-sm text-gray-500">
          <a href="#" className="hover:text-green-600">
            Home
          </a>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-[#53675E] font-bold">Add Plant</span>
        </div>

        {/* Content Area */}
        <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Add New Plant
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Image upload */}
              <div className="w-full lg:w-64 flex justify-center lg:justify-start">
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-64 lg:h-64 bg-gray-300 rounded flex flex-col items-center justify-center overflow-hidden relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Plant preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Cloud size={40} className="text-gray-500" />
                  )}
                  <input
                    type="file"
                    id="plant-image"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="plant-image"
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 text-sm cursor-pointer hover:bg-opacity-60 transition-colors"
                  >
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </div>

              {/* Form inputs */}
              <div className="flex-1 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Plant's Nickname"
                    className="w-full p-3 rounded border border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                    value={plantNickname}
                    onChange={(e) => setPlantNickname(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Plant name"
                    className="w-full p-3 rounded border border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="flex items-center w-full p-3 rounded border border-gray-200 text-left text-gray-500 hover:border-green-500 focus:border-green-500 focus:outline-none transition-colors"
                    onClick={() => setShowReminder(!showReminder)}
                  >
                    <Clock size={18} className="mr-2 flex-shrink-0" />
                    <span className="flex-1">Time reminder</span>
                    <ChevronRight
                      size={18}
                      className={`ml-2 transition-transform ${
                        showReminder ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showReminder && (
                    <div className="p-3 mt-2 border border-gray-200 rounded bg-white">
                      <label className="block text-sm text-gray-700 mb-1">
                        Set reminder time:
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-200 rounded focus:border-green-500 focus:outline-none transition-colors"
                        value={timeReminder}
                        onChange={(e) => setTimeReminder(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-center sm:justify-end pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded disabled:bg-green-300 transition-colors min-w-32"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Plant"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
