import React, { useState, useEffect } from "react";
import { useTokenValidation } from "../../hooks/validateToken";

export default function UserMyplant() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  useTokenValidation();
  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    // Filter plants based on search term and active filter
    let filtered = plants.filter(
      (plant) =>
        plant.plant_nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.plant_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Apply filter based on activeFilter
    if (activeFilter !== "all") {
      filtered = applyFilter(filtered, activeFilter);
    }

    setFilteredPlants(filtered);
  }, [plants, searchTerm, activeFilter]);

  // Helper function to calculate days since plant was created
  const calculateDaysSinceCreated = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to calculate time left until next reminder (only comparing hour and minute)
  const calculateTimeLeft = (timeReminder) => {
    if (!timeReminder) return "No reminder set";

    try {
      const reminderTime = new Date(timeReminder);
      const now = new Date();

      // Check if the date is valid
      if (isNaN(reminderTime.getTime())) return "Invalid date";

      // Extract only hours and minutes
      const reminderHours = reminderTime.getHours();
      const reminderMinutes = reminderTime.getMinutes();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Calculate the time difference in minutes
      const reminderTotalMinutes = reminderHours * 60 + reminderMinutes;
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      // Calculate the difference in minutes
      let diffMinutes = reminderTotalMinutes - currentTotalMinutes;

      // Handle if the reminder is overdue
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Add 24 hours worth of minutes to account for the next day
      }

      // Calculate the difference in hours and minutes
      const diffHours = Math.floor(diffMinutes / 60);
      const diffMinutesLeft = diffMinutes % 60;

      // Output the result based on the difference
      if (diffMinutes === 0) {
        return "Soon";
      }

      return `${diffHours}h ${diffMinutesLeft}m`;
    } catch (error) {
      console.error("Error calculating time left:", error);
      return "Error";
    }
  };

  // Helper function to get time left in minutes for sorting
  const getTimeLeftInMinutes = (timeReminder) => {
    if (!timeReminder) return Infinity;

    try {
      const reminderTime = new Date(timeReminder);
      const now = new Date();

      if (isNaN(reminderTime.getTime())) return Infinity;

      const reminderHours = reminderTime.getHours();
      const reminderMinutes = reminderTime.getMinutes();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const reminderTotalMinutes = reminderHours * 60 + reminderMinutes;
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      let diffMinutes = reminderTotalMinutes - currentTotalMinutes;

      if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
      }

      return diffMinutes;
    } catch (error) {
      return Infinity;
    }
  };

  // Apply filter function
  const applyFilter = (plantsToFilter, filterType) => {
    switch (filterType) {
      case "newest":
        return [...plantsToFilter].sort(
          (a, b) =>
            calculateDaysSinceCreated(a.createdAt) -
            calculateDaysSinceCreated(b.createdAt),
        );
      case "oldest":
        return [...plantsToFilter].sort(
          (a, b) =>
            calculateDaysSinceCreated(b.createdAt) -
            calculateDaysSinceCreated(a.createdAt),
        );
      case "reminder_soon":
        return [...plantsToFilter].sort(
          (a, b) =>
            getTimeLeftInMinutes(a.time_reminder) -
            getTimeLeftInMinutes(b.time_reminder),
        );
      case "reminder_later":
        return [...plantsToFilter].sort(
          (a, b) =>
            getTimeLeftInMinutes(b.time_reminder) -
            getTimeLeftInMinutes(a.time_reminder),
        );
      case "status_alive":
        return plantsToFilter.filter((plant) => plant.status === "ALIVE");
      case "status_dead":
        return plantsToFilter.filter((plant) => plant.status !== "ALIVE");
      default:
        return plantsToFilter;
    }
  };

  const fetchPlants = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
      setLoading(true);
      setError(null);
      console.log(userId);
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

      console.log(data);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddPlant = () => {
    // Implement navigation to add plant page
    console.log("Navigate to add plant page");
  };

  const handlePlantOptions = (plantId) => {
    // Implement plant options menu
    console.log("Show options for plant:", plantId);
  };

  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterSelect = (filterType) => {
    setActiveFilter(filterType);
    setShowFilterDropdown(false);
  };

  const getFilterLabel = (filterType) => {
    const labels = {
      all: "All Plants",
      newest: "Newest First",
      oldest: "Oldest First",
      reminder_soon: "Reminder Soon",
      reminder_later: "Reminder Later",
      status_alive: "Alive Only",
      status_dead: "Dead Only",
    };
    return labels[filterType] || "All Plants";
  };

  if (loading) {
    return (
      <div className="pr-5 pb-5 pl-5 md:pt-13 lg:pt-13 flex-1 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E5D1E]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pr-5 pb-5 pl-5 md:pt-13 lg:pt-13 flex-1 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPlants}
              className="bg-[#1E5D1E] text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pr-5 pb-5 pl-5 md:pt-13 lg:pt-13 flex-1 bg-white">
      {/* Breadcrumb */}
      <div className="items-center text-lg text-[#53675E] mb-5 hidden md:flex">
        <span className="text-[20px] font-bold">My Plants</span>
      </div>

      {/* main wrapper */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        {/* search + filter */}
        <div className="flex w-full lg:flex-1">
          {/* Search */}
          <div className="relative flex-1 mr-2 text-[12px]">
            <input
              type="text"
              placeholder="Search your plant!"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-3 px-10 rounded-[15px] bg-[#F4F3F3] focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 absolute left-4 top-3 text-[#9D9191]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          {/* Filter icon with dropdown */}
          <div className="relative">
            <button
              onClick={handleFilterClick}
              className={`p-1 rounded-[15px] flex-shrink-0 min-w-[40px] ${activeFilter !== "all"
                  ? "text-[#1E5D1E] bg-green-50"
                  : "text-[#9D9191]"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                <div className="py-2">
                  <button
                    onClick={() => handleFilterSelect("all")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${activeFilter === "all"
                        ? "bg-green-50 text-[#1E5D1E]"
                        : "text-[#53675E]"
                      }`}
                  >
                    All Plants
                  </button>
                  <hr className="my-1" />
                  <div className="px-3 py-1 text-xs font-semibold text-[#9D9191] uppercase">
                    Sort by Age
                  </div>
                  <button
                    onClick={() => handleFilterSelect("newest")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${activeFilter === "newest"
                        ? "bg-green-50 text-[#1E5D1E]"
                        : "text-[#53675E]"
                      }`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => handleFilterSelect("oldest")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${activeFilter === "oldest"
                        ? "bg-green-50 text-[#1E5D1E]"
                        : "text-[#53675E]"
                      }`}
                  >
                    Oldest First
                  </button>
                  <hr className="my-1" />
                  <div className="px-3 py-1 text-xs font-semibold text-[#9D9191] uppercase">
                    Sort by Reminder
                  </div>
                  <button
                    onClick={() => handleFilterSelect("reminder_soon")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${activeFilter === "reminder_soon"
                        ? "bg-green-50 text-[#1E5D1E]"
                        : "text-[#53675E]"
                      }`}
                  >
                    Reminder Soon
                  </button>
                  <button
                    onClick={() => handleFilterSelect("reminder_later")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${activeFilter === "reminder_later"
                        ? "bg-green-50 text-[#1E5D1E]"
                        : "text-[#53675E]"
                      }`}
                  >
                    Reminder Later
                  </button>
                  <hr className="my-1" />
                  <div className="px-3 py-1 text-xs font-semibold text-[#9D9191] uppercase">
                    Filter by Status
                  </div>
                  <button
                    onClick={() => handleFilterSelect("status_alive")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${activeFilter === "status_alive"
                        ? "bg-green-50 text-[#1E5D1E]"
                        : "text-[#53675E]"
                      }`}
                  >
                    Alive Only
                  </button>
                  <button
                    onClick={() => handleFilterSelect("status_dead")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${activeFilter === "status_dead"
                        ? "bg-green-50 text-[#1E5D1E]"
                        : "text-[#53675E]"
                      }`}
                  >
                    Dead Only
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* + new plants (mobile) */}
        <div className="lg:hidden flex justify-end">
          <button
            onClick={handleAddPlant}
            className="bg-[#1E5D1E] text-white px-3 py-1 rounded-[24px] flex items-center"
          >
            <span className="font-bold text-[14px] tracking-wide">
              {" "}
              + new plants
            </span>
          </button>
        </div>

        {/* + new plants (desktop) */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={handleAddPlant}
            className="bg-[#1E5D1E] text-white px-4 py-1.5 rounded-[24px] flex items-center"
          >
            <span className="font-bold text-[20px] tracking-wide">
              + new plants
            </span>
          </button>
        </div>
      </div>

      {/* Active filter indicator */}
      {activeFilter !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-[#53675E]">Filtered by:</span>
          <span className="bg-[#1E5D1E] text-white px-3 py-1 rounded-full text-xs">
            {getFilterLabel(activeFilter)}
          </span>
          <button
            onClick={() => handleFilterSelect("all")}
            className="text-xs text-[#9D9191] hover:text-[#1E5D1E]"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* No plants message */}
      {filteredPlants.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-[#53675E] text-lg mb-4">
            {searchTerm || activeFilter !== "all"
              ? "No plants found matching your criteria."
              : "No plants found. Add your first plant!"}
          </p>
          {!searchTerm && activeFilter === "all" && (
            <button
              onClick={handleAddPlant}
              className="bg-[#1E5D1E] text-white px-6 py-2 rounded-[24px]"
            >
              + Add Plant
            </button>
          )}
        </div>
      )}

      {/* plant cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-[#F4F3F3] rounded-[15px] shadow-sm overflow-hidden"
          >
            {/* For mobile view */}
            <div className="block md:hidden">
              <div className="p-4 pb-2">
                <div className="flex">
                  <div className="w-32 h-32 mr-4">
                    <img
                      src={
                        plant.plant_img ||
                        "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2"
                      }
                      alt={plant.plant_name}
                      className="w-full h-full rounded-[15px] object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-[16px] font-semibold text-[#53675E]">
                            {plant.plant_nickname}
                          </h3>
                          <span
                            className={`ml-2 px-2 py-0.5 font-extrabold tracking-wider text-white text-[10px] rounded-full ${plant.status === "ALIVE"
                                ? "bg-[#5AA67E]"
                                : "bg-red-500"
                              }`}
                          >
                            {plant.status}
                          </span>
                        </div>
                        <p className="font-regular mt-1 text-[12px] text-[#53675E]">
                          {plant.plant_name}
                        </p>
                        <p className="text-sm text-[#53675E]">
                          {calculateDaysSinceCreated(plant.createdAt)} days
                        </p>
                      </div>
                      <button
                        onClick={() => handlePlantOptions(plant.id)}
                        className="text-[#9D9191]"
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative mt-2">
                  <div className="absolute bottom-0 left-36 text-[#7C968A] text-[12px]">
                    Timeleft: {calculateTimeLeft(plant.time_reminder)}
                  </div>

                  <div className="absolute bottom-0 right-0 flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-300 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                    </svg>
                    <span className="font-regular text-[12px] text-[#53675E]">
                      {calculateDaysSinceCreated(plant.createdAt)} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* For desktop view */}
            <div className="hidden md:flex h-48">
              {/* plant pic - fixed width with spacing */}
              <div className="w-48 flex items-center justify-center pl-4">
                <div className="w-40 h-40">
                  <img
                    src={
                      plant.plant_img ||
                      "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2"
                    }
                    alt={plant.plant_name}
                    className="object-cover h-40 w-40 rounded-[15px]"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2";
                    }}
                  />
                </div>
              </div>

              {/* plant detail */}
              <div className="flex-1 p-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-[16px] font-semibold text-[#53675E]">
                        {plant.plant_nickname}
                      </h3>
                      <span
                        className={`ml-2 px-2 py-0.5 font-extrabold tracking-wider text-white text-[10px] rounded-full ${plant.status === "ALIVE"
                            ? "bg-[#5AA67E]"
                            : "bg-red-500"
                          }`}
                      >
                        {plant.status}
                      </span>
                    </div>
                    <p className="font-regular mt-1 text-[12px] text-[#53675E]">
                      {plant.plant_name}
                    </p>
                    <p className="text-sm text-[#53675E]">
                      {calculateDaysSinceCreated(plant.createdAt)} days
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlantOptions(plant.id)}
                    className="text-[#9D9191]"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>

                {/* remaining time */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="font-regular text-[#7C968A] text-[12px]">
                    Timeleft: {calculateTimeLeft(plant.time_reminder)}
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-300 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                    </svg>
                    <span className="font-regular text-[12px] text-[#53675E]">
                      {calculateDaysSinceCreated(plant.createdAt)} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Click outside to close dropdown */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
}
