import React, { useState, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Droplets,
  Clock,
  Calendar,
  Camera,
  Upload,
  Droplet,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

// Modal Component
const Modal = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-xl max-w-md w-full ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

// Success Toast Component
const SuccessToast = ({ isVisible, message, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top-2">
      <Check size={20} />
      <span>{message}</span>
    </div>
  );
};

const PlantDetailPage = () => {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const { plantId } = useParams("plantId");
  const [lastWatered, setLastWatered] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWateredModal, setShowWateredModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch plant details from API
  useEffect(() => {
    fetchPlantDetail();
  }, [plantId]);

  const showToast = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
  };

  const fetchPlantDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/plant/${plantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const response2 = await fetch(
        `http://localhost:3000/api/latest-watered/${plantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch plant details");
      if (!response2.ok) setLastWatered(null);
      const data = await response.json();
      const data2 = await response2.json();
      setPlant(data.getPlants[0]);
      console.log(data2);
      setLastWatered(data2.watered);
    } catch (err) {
      setError(err.message);
      // Mock data for demo purposes
      setPlant({
        id: 1,
        plant_name: "Dieffenbachia",
        plant_nickname: "Keaw Kachee",
        plant_img:
          "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
        status: "ALIVE",
        time_reminder: "2025-05-26T10:00:00Z",
        createdAt: "2025-05-20T00:00:00Z",
        last_notified_at: "2025-05-23T00:00:00Z",
      });
    } finally {
      setLoading(false);
    }
  };

  function calculateNMDaysAgo(dateString) {
    // Handle null or undefined dates
    if (!dateString) return 0;

    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(date.getTime())) return 0;

    // Set both dates to start of day for accurate day calculation
    const dateStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = nowStart - dateStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Return 0 if negative (future date) or the calculated days
    return Math.max(0, diffDays);
  }

  const calculateDaysAgo = (dateString) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const now = new Date();
    if (isNaN(date.getTime())) return 0;
    const dateStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = nowStart - dateStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formatReminderTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatTimeLeft = (reminderTime) => {
    const now = new Date();
    const reminderDate = new Date(reminderTime);
    const reminderHours = reminderDate.getUTCHours();
    const reminderMinutes = reminderDate.getUTCMinutes();
    const today = new Date();
    const todayWithReminderTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      reminderHours,
      reminderMinutes,
      0,
      0,
    );
    let diffTime = todayWithReminderTime - now;
    if (diffTime <= 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowWithReminderTime = new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        reminderHours,
        reminderMinutes,
        0,
        0,
      );
      diffTime = tomorrowWithReminderTime - now;
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
        return `${hours}h ${minutes}m (tomorrow)`;
      }
      return `${minutes}m (tomorrow)`;
    }
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    const reminderTime = new Date(plant.time_reminder);
    const hours = reminderTime.getUTCHours().toString().padStart(2, "0");
    const minutes = reminderTime.getUTCMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    setEditForm({
      plant_nickname: plant.plant_nickname,
      plant_name: plant.plant_name,
      time_reminder: timeString,
      status: plant.status,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
      formData.append("plant_nickname", editForm.plant_nickname);
      formData.append("plant_name", editForm.plant_name);
      formData.append("time_reminder", editForm.time_reminder);
      formData.append("status", editForm.status);
      formData.append("userId", userId);
      if (imageFile) {
        formData.append("plant_img", imageFile);
      }
      const response = await fetch(
        `http://localhost:3000/api/update-plant/${plant.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
          body: formData,
        },
      );
      if (!response.ok) throw new Error("Failed to update plant");
      const updatedPlant = await response.json();
      setPlant((prev) => ({ ...prev, ...updatedPlant }));
      setIsEditing(false);
      setEditForm({});
      setImageFile(null);
      setImagePreview(null);
      showToast("Plant details updated successfully!");
    } catch (err) {
      const [hours, minutes] = editForm.time_reminder.split(":");
      const today = new Date();
      const reminderDateTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours),
        parseInt(minutes),
      );
      setPlant((prev) => ({
        ...prev,
        ...editForm,
        time_reminder: reminderDateTime.toISOString(),
        plant_img: imagePreview || prev.plant_img,
      }));
      setIsEditing(false);
      setEditForm({});
      setImageFile(null);
      setImagePreview(null);
      showToast("Plant details updated successfully!");
    } finally {
      setSaving(false);
      window.location.reload();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWatered = async () => {
    try {
      setSaving(true);
      setShowWateredModal(false);
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          plantId: plant.id,
        }),
      });
      if (!response.ok) throw new Error("Failed to log watering");
      const updatedPlant = await response.json();
      console.log(updatedPlant);
      setPlant((prev) => ({
        ...prev,
        last_notified_at: new Date().toISOString(),
      }));
      showToast("Plant watered successfully! 💧");
    } catch (err) {
      setError(err.message);
      // Update local state for demo purposes
      setPlant((prev) => ({
        ...prev,
        last_notified_at: new Date().toISOString(),
      }));
      showToast("Plant watered successfully! 💧");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      setShowDeleteModal(false);
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/deletePlant`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          plantId: plant.id,
        }),
      });
      if (!response.ok) throw new Error("Failed to delete plant");
      showToast("Plant deleted successfully");
      // Redirect to the plant list or home page after deletion
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="h-80 bg-gray-200 rounded-xl mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Plant not found
          </h2>
          <p className="text-gray-500">
            The plant you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/">
              <span className="hover:text-green-600 cursor-pointer">
                My Plants
              </span>
            </Link>
            <span className="mx-2">{">"}</span>
            <span className="text-gray-800 font-medium">
              {plant.plant_nickname}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              Error: {error}. Showing demo data instead.
            </div>
          )}

          {/* Plant Detail Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Plant Image Section */}
            <div className="relative">
              <img
                src={imagePreview || plant.plant_img}
                alt={plant.plant_nickname}
                className="w-full h-80 object-cover"
              />
              {/* Status Badge */}
              <div className="absolute top-6 left-6">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    plant.status === "ALIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {plant.status}
                </span>
              </div>
              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="absolute top-6 right-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
                >
                  <Edit3 size={20} className="text-gray-600" />
                </button>
              )}
              {/* Image Upload in Edit Mode */}
              {isEditing && (
                <div className="absolute bottom-6 right-6">
                  <label className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg cursor-pointer transition-all hover:scale-105 flex items-center justify-center">
                    <Camera size={20} className="text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Plant Details Section */}
            <div className="p-8">
              {isEditing ? (
                /* Edit Mode */
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plant Nickname
                    </label>
                    <input
                      type="text"
                      value={editForm.plant_nickname}
                      onChange={(e) =>
                        handleFormChange("plant_nickname", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                      placeholder="Give your plant a nickname"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plant Type
                    </label>
                    <input
                      type="text"
                      value={editForm.plant_name}
                      onChange={(e) =>
                        handleFormChange("plant_name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Dieffenbachia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Watering Reminder Time
                    </label>
                    <input
                      type="time"
                      value={editForm.time_reminder}
                      onChange={(e) =>
                        handleFormChange("time_reminder", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plant Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        handleFormChange("status", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="ALIVE">Alive & Healthy</option>
                      <option value="DEAD">Dead</option>
                    </select>
                  </div>
                  {imageFile && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Upload size={16} className="text-green-600 mr-2" />
                        <span className="text-sm text-green-800">
                          New image selected: {imageFile.name}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg font-medium"
                    >
                      <Save size={20} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg font-medium"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {plant.plant_nickname}
                    </h1>
                    <p className="text-lg text-gray-600">{plant.plant_name}</p>
                  </div>
                  {/* Plant Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Droplets className="text-blue-600 mr-2" size={20} />
                        <span className="font-semibold text-blue-900">
                          Last Watered
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {lastWatered == null
                          ? "0"
                          : calculateNMDaysAgo(lastWatered.createdAt)}{" "}
                        days ago
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="text-green-600 mr-2" size={20} />
                        <span className="font-semibold text-green-900">
                          Plant Age
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateNMDaysAgo(plant.createdAt)} days
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="text-orange-600 mr-2" size={20} />
                        <span className="font-semibold text-orange-900">
                          Next Reminder
                        </span>
                      </div>
                      <p className="text-lg font-bold text-orange-600">
                        {formatReminderTime(plant.time_reminder)}
                      </p>
                      <p className="text-sm text-orange-500 mt-1">
                        {formatTimeLeft(plant.time_reminder)}
                      </p>
                    </div>
                  </div>
                  {/* Care Notes */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Care Notes
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Your plant is feeling a bit thirsty. Make sure to water it
                      regularly and keep it in a well-lit area. Monitor the soil
                      moisture and adjust watering schedule as needed.
                    </p>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowWateredModal(true)}
                      disabled={saving || loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg font-medium"
                    >
                      <Droplet size={20} />
                      Mark as Watered
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      disabled={saving || loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg font-medium"
                    >
                      <Trash2 size={20} />
                      Delete Plant
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Watered Confirmation Modal */}
      <Modal
        isOpen={showWateredModal}
        onClose={() => setShowWateredModal(false)}
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
            <Droplet className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Mark as Watered?
          </h3>
          <p className="text-gray-600 text-center mb-6">
            This will log that you watered{" "}
            <strong>{plant.plant_nickname}</strong> today and reset the watering
            tracker.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowWateredModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWatered}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {saving ? "Logging..." : "Yes, Watered!"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Delete Plant?
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete{" "}
            <strong>{plant.plant_nickname}</strong>? This action cannot be
            undone and all plant data will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
            >
              {saving ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
};

export default PlantDetailPage;
