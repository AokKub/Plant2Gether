import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

export default function UserMyplant() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const navigate = useNavigate();
  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3000/api/get-plants/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (data.status) {
        setPlants(data.getPlants);
      } else {
        setError(data.message || "Failed to fetch plants");
      }
    } catch (err) {
      setError("Failed to fetch plants. Please try again later.");
      console.error("Error fetching plants:", err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filter and sort function
  const filterAndSortPlants = useCallback(
    debounce((search, plants, status, sort) => {
      let filtered = plants.filter((plant) => {
        const nickname = plant.plant_nickname || "";
        const name = plant.plant_name || "";
        const matchesSearch =
          nickname.toLowerCase().includes(search.toLowerCase()) ||
          name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "ALL" || plant.status === status;
        return matchesSearch && matchesStatus;
      });

      // Sort plants
      filtered.sort((a, b) => {
        switch (sort) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "name":
            return (a.plant_nickname || "").localeCompare(
              b.plant_nickname || "",
            );
          case "reminder":
            const aReminder = a.time_reminder
              ? new Date(a.time_reminder)
              : null;
            const bReminder = b.time_reminder
              ? new Date(b.time_reminder)
              : null;
            if (!aReminder && !bReminder) return 0;
            if (!aReminder) return 1;
            if (!bReminder) return -1;
            return aReminder - bReminder;
          default:
            return 0;
        }
      });

      setFilteredPlants(filtered);
    }, 300),
    [],
  );

  useEffect(() => {
    filterAndSortPlants(searchTerm, plants, statusFilter, sortBy);
  }, [searchTerm, plants, statusFilter, sortBy, filterAndSortPlants]);

  const calculateDaysSinceCreated = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  // Updated calculateTimeLeft function
  const calculateTimeLeft = (timeReminder) => {
    if (!timeReminder) return "No reminder";

    try {
      const reminderDate = new Date(timeReminder);
      const now = new Date();

      // Extract hours and minutes from the stored reminder (ignoring the 1970 date part)
      const reminderHours = reminderDate.getUTCHours(); // Use UTC since you stored it in UTC
      const reminderMinutes = reminderDate.getUTCMinutes();

      // Get current local time
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Convert to total minutes for easier comparison
      const reminderTotalMinutes = reminderHours * 60 + reminderMinutes;
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      let diffMinutes = reminderTotalMinutes - currentTotalMinutes;

      // If the reminder time has passed today, it's for tomorrow
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Add 24 hours worth of minutes
      }

      if (diffMinutes === 0) {
        return "Now";
      }

      const diffHours = Math.floor(diffMinutes / 60);
      const diffMinutesLeft = diffMinutes % 60;

      if (diffHours === 0) {
        return `${diffMinutesLeft}m`;
      }

      return `${diffHours}h ${diffMinutesLeft}m`;
    } catch (error) {
      console.error("Error calculating time left:", error);
      return "Error";
    }
  };

  // Updated getUrgencyColor function
  const getUrgencyColor = (timeReminder) => {
    if (!timeReminder) return "text-gray-400";

    try {
      const reminderDate = new Date(timeReminder);
      const now = new Date();

      // Extract hours and minutes from the stored reminder (using UTC)
      const reminderHours = reminderDate.getUTCHours();
      const reminderMinutes = reminderDate.getUTCMinutes();

      // Get current local time
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const reminderTotalMinutes = reminderHours * 60 + reminderMinutes;
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      let diffMinutes = reminderTotalMinutes - currentTotalMinutes;

      // If negative, add 24 hours (next day)
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
      }

      if (diffMinutes === 0) return "text-green-500 font-semibold"; // It's time
      if (diffMinutes <= 30) return "text-red-500 font-semibold"; // Less than 30 minutes
      if (diffMinutes <= 120) return "text-orange-500 font-semibold"; // Less than 2 hours
      if (diffMinutes <= 360) return "text-yellow-600"; // Less than 6 hours
      return "text-[#7C968A]"; // Normal
    } catch (error) {
      return "text-gray-400";
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setShowFilterDropdown(false);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
    setShowSortDropdown(false);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSortBy("newest");
  };

  const handleAddPlant = () => {
    console.log("Navigate to add plant page");
  };

  const handlePlantClick = (plantId) => {
    navigate(`/plant-detail/${plantId}`);
  };

  const handleQuickWater = async (plantId, e) => {
    e.stopPropagation();
    console.log("Quick water plant:", plantId);
    // Update last watered time
    try {
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
          plantId: plantId,
        }),
      });
      if (!response.ok) throw new Error("Failed to log watering");
      const updatedPlant = await response.json();
      console.log(updatedPlant);
      navigate("/community");
      setPlants((prev) => ({
        ...prev,
        last_notified_at: new Date().toISOString(),
      }));
    } catch (err) {
      setError(err.message);
      // Update local state for demo purposes
      setPlants((prev) => ({
        ...prev,
        last_notified_at: new Date().toISOString(),
      }));
    }
  };

  if (loading) {
    return (
      <div className="pr-5 pb-5 pl-5 md:pt-13 lg:pt-13 flex-1 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E5D1E] mx-auto mb-4"></div>
            <p className="text-[#53675E]">Loading your plants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pr-5 pb-5 pl-5 md:pt-13 lg:pt-13 flex-1 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center bg-red-50 p-6 rounded-lg">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="font-semibold">{error}</p>
            </div>
            <button
              onClick={fetchPlants}
              className="bg-[#1E5D1E] text-white px-4 py-2 rounded-lg hover:bg-[#164A16] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeFiltersCount =
    (searchTerm ? 1 : 0) + (statusFilter !== "ALL" ? 1 : 0);

  return (
    <div className="pr-5 pb-5 pl-5 md:pt-13 lg:pt-13 flex-1 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="items-center text-lg text-[#53675E] hidden md:flex">
          <span className="text-[24px] font-bold">My Plants</span>
          <span className="ml-3 bg-[#1E5D1E] text-white px-3 py-1 rounded-full text-sm font-semibold">
            {filteredPlants.length}
          </span>
        </div>
        <div className="md:hidden">
          <span className="text-[20px] font-bold text-[#53675E]">
            My Plants
          </span>
          <span className="ml-2 bg-[#1E5D1E] text-white px-2 py-1 rounded-full text-xs font-semibold">
            {filteredPlants.length}
          </span>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex w-full lg:flex-1 gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search your plants..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-3 px-10 rounded-[15px] bg-[#F4F3F3] focus:outline-none focus:ring-2 focus:ring-[#1E5D1E] focus:bg-white transition-all text-[14px]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 absolute left-4 top-3.5 text-[#9D9191]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3.5 text-[#9D9191] hover:text-[#53675E] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`p-3 rounded-[15px] flex-shrink-0 min-w-[48px] transition-all ${showFilterDropdown || statusFilter !== "ALL"
                  ? "bg-[#1E5D1E] text-white"
                  : "bg-[#F4F3F3] text-[#9D9191] hover:bg-[#E8E7E7]"
                }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
              {statusFilter !== "ALL" && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
                <div className="p-2">
                  <p className="text-xs font-semibold text-[#53675E] mb-2">
                    Filter by Status
                  </p>
                  {["ALL", "ALIVE", "DEAD"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-[#F4F3F3] transition-colors ${statusFilter === status
                          ? "bg-[#F4F3F3] font-semibold"
                          : ""
                        }`}
                    >
                      {status === "ALL"
                        ? "All Plants"
                        : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={`p-3 rounded-[15px] flex-shrink-0 min-w-[48px] transition-all ${showSortDropdown
                  ? "bg-[#1E5D1E] text-white"
                  : "bg-[#F4F3F3] text-[#9D9191] hover:bg-[#E8E7E7]"
                }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5v4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 5v4"
                />
              </svg>
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
                <div className="p-2">
                  <p className="text-xs font-semibold text-[#53675E] mb-2">
                    Sort by
                  </p>
                  {[
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "name", label: "Name A-Z" },
                    { value: "reminder", label: "Next Reminder" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSort(option.value)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-[#F4F3F3] transition-colors ${sortBy === option.value
                          ? "bg-[#F4F3F3] font-semibold"
                          : ""
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="hidden lg:flex bg-[#F4F3F3] rounded-[15px] p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-[12px] transition-all ${viewMode === "grid"
                  ? "bg-white shadow-sm"
                  : "hover:bg-[#E8E7E7]"
                }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-[12px] transition-all ${viewMode === "list"
                  ? "bg-white shadow-sm"
                  : "hover:bg-[#E8E7E7]"
                }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Clear Filters & Add Plant */}
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[#9D9191] hover:text-[#53675E] text-sm font-medium transition-colors"
            >
              Clear all ({activeFiltersCount})
            </button>
          )}

          <button
            onClick={handleAddPlant}
            className="bg-[#1E5D1E] hover:bg-[#164A16] text-white px-4 py-2 rounded-[20px] flex items-center transition-all transform hover:scale-105 shadow-lg"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="font-semibold text-sm lg:text-base">
              Add Plant
            </span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredPlants.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 002 2h4a2 2 0 012 2v8a4 4 0 01-4 4H7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#53675E] mb-2">
            {searchTerm || statusFilter !== "ALL"
              ? "No plants found"
              : "No plants yet"}
          </h3>
          <p className="text-[#9D9191] mb-6 max-w-md mx-auto">
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Start your plant journey by adding your first green companion!"}
          </p>
          {!searchTerm && statusFilter === "ALL" && (
            <button
              onClick={handleAddPlant}
              className="bg-[#1E5D1E] hover:bg-[#164A16] text-white px-6 py-3 rounded-[24px] font-semibold transition-all transform hover:scale-105"
            >
              + Add Your First Plant
            </button>
          )}
        </div>
      )}

      {/* Plants Grid/List */}
      {filteredPlants.length > 0 && (
        <div
          className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1"
            }`}
        >
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => handlePlantClick(plant.id)}
              className="bg-[#F4F3F3] rounded-[20px] shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] group"
            >
              <div
                className={`${viewMode === "list" ? "flex" : "block md:flex"} h-auto md:h-52`}
              >
                {/* Image Section */}
                <div
                  className={`${viewMode === "list" ? "w-52" : "w-full md:w-52"} flex items-center justify-center p-4`}
                >
                  <div className="w-40 h-40 relative">
                    <img
                      src={plant.plant_img}
                      alt={plant.plant_name || "Plant"}
                      className="object-cover h-full w-full rounded-[16px] group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400";
                      }}
                    />
                    {/* Quick Water Button */}
                    <button
                      onClick={(e) => handleQuickWater(plant.id, e)}
                      className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                      title="Quick Water"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7.5 13.5C7.5 17.64 10.86 21 15 21s7.5-3.36 7.5-7.5c0-4.14-3.36-7.5-7.5-7.5s-7.5 3.36-7.5 7.5z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="text-lg font-bold text-[#53675E] group-hover:text-[#1E5D1E] transition-colors">
                          {plant.plant_nickname || "Unnamed"}
                        </h3>
                        <span
                          className={`ml-3 px-3 py-1 font-bold text-white text-xs rounded-full ${plant.status === "ALIVE"
                              ? "bg-[#5AA67E]"
                              : "bg-red-500"
                            }`}
                        >
                          {plant.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#7C968A] mb-1">
                        {plant.plant_name}
                      </p>
                      <div className="flex items-center text-xs text-[#9D9191] space-x-4">
                        <span>
                          Age: {calculateDaysSinceCreated(plant.createdAt)} days
                        </span>
                        {plant.care_level && (
                          <span>Care: {plant.care_level}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div
                      className={`text-sm ${getUrgencyColor(plant.time_reminder)}`}
                    >
                      Next: {calculateTimeLeft(plant.time_reminder)}
                    </div>
                    <div className="flex items-center text-xs text-[#7C968A]">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                      </svg>
                      {plant.last_watered ? (
                        <span>
                          Last watered:{" "}
                          {new Date(plant.last_watered).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>
                          {calculateDaysSinceCreated(plant.createdAt)} days old
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click outside handlers */}
      {(showFilterDropdown || showSortDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowFilterDropdown(false);
            setShowSortDropdown(false);
          }}
        />
      )}
    </div>
  );
}
