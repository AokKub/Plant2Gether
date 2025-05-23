import React, { useState } from "react";
import { Cloud, ChevronRight, Clock } from "lucide-react";
import { subscribeToPush } from "../../services/notification";

export default function UserAddPlant() {
  const [plantNickname, setPlantNickname] = useState("");
  const [plantName, setPlantName] = useState("");
  const [timeReminder, setTimeReminder] = useState("");
  const [plantImage, setPlantImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlantImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!plantName.trim()) return setError("Plant name is required");
    if (!plantNickname.trim()) return setError("Plant nickname is required");
    if (!timeReminder) return setError("Time reminder is required");
    if (!plantImage) return setError("Please upload a plant image");

    const formData = new FormData();
    formData.append("plantName", plantName);
    formData.append("plantNickName", plantNickname);
    formData.append("timeReminder", timeReminder);
    formData.append("image", plantImage);

    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
      const sub = await subscribeToPush();
      formData.append("userId", userId);
      formData.append("subscription", JSON.stringify(sub));

      const response = await fetch("http://localhost:3000/api/add-plant", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add plant");
      }

      await response.json();

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
        <div className="mb-6 flex items-center text-lg text-[#88AE9D]">
          <a href="/" className="hover:text-[#1E5D1E] font-bold">
            My Plants
          </a>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-[#53675E] font-bold">Add Plant</span>
        </div>

        {/* Content Area */}
        <div className="bg-[#F4F3F3] rounded-[15px] p-6">
          <h2 className="text-[20px] text-[#53675E] font-semibold mb-6">
            Add New Plant
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Image Upload */}
              <div className="w-full lg:w-64 flex justify-center lg:justify-start">
                <div className="w-64 h-64 sm:w-72 sm:h-72 bg-gray-300 rounded flex flex-col items-center justify-center overflow-hidden relative">
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
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 text-sm cursor-pointer hover:bg-opacity-60"
                  >
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="Plant's Nickname"
                  className="w-full rounded-[4px] p-3 font-light text-[14px] bg-[#FFFFFF]"
                  value={plantNickname}
                  onChange={(e) => setPlantNickname(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Plant name"
                  className="w-full rounded-[4px] p-3 font-light text-[14px] bg-[#FFFFFF]"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                />
                <div>
                  <button
                    type="button"
                    className="flex items-center w-full p-3 rounded-[4px] text-[14px] font-light text-left bg-white"
                    onClick={() => setShowReminder(!showReminder)}
                  >
                    <Clock size={18} className="mr-2" />
                    <span className="flex-1">Time reminder</span>
                    <ChevronRight
                      size={18}
                      className={`ml-2 transition-transform ${showReminder ? "rotate-90" : ""}`}
                    />
                  </button>
                  {showReminder && (
                    <div className="p-3 mt-2 bg-white rounded-[4px]">
                      <label className="block font-light text-[14px] text-gray-700 mb-1">
                        Set reminder time:
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border border-[#53675E] rounded-[4px] font-light text-[14px]"
                        value={timeReminder}
                        onChange={(e) => setTimeReminder(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="bg-[#5AA67E] hover:bg-green-600 text-[20px] font-regular text-white px-6 py-2 rounded-[50px] disabled:bg-[#1E5D1E]"
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
