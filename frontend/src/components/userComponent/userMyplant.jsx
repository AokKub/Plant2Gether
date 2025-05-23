import React, { useState, useEffect } from "react";
import { useTokenValidation } from "../../hooks/validateToken";
import { Link } from "react-router-dom";

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
    let filtered = plants.filter(
      (plant) =>
        plant.plant_nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.plant_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (activeFilter !== "all") {
      filtered = applyFilter(filtered, activeFilter);
    }
    setFilteredPlants(filtered);
  }, [plants, searchTerm, activeFilter]);

  const calculateDaysSinceCreated = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTimeLeft = (timeReminder) => {
    if (!timeReminder) return "No reminder set";
    try {
      const reminderTime = new Date(timeReminder);
      const now = new Date();
      if (isNaN(reminderTime.getTime())) return "Invalid date";

      const reminderTotal =
        reminderTime.getHours() * 60 + reminderTime.getMinutes();
      const currentTotal = now.getHours() * 60 + now.getMinutes();

      let diff = reminderTotal - currentTotal;
      if (diff < 0) diff += 1440;

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      return diff === 0 ? "Soon" : `${hours}h ${minutes}m`;
    } catch {
      return "Error";
    }
  };

  const getTimeLeftInMinutes = (timeReminder) => {
    if (!timeReminder) return Infinity;
    try {
      const reminderTime = new Date(timeReminder);
      const now = new Date();
      if (isNaN(reminderTime.getTime())) return Infinity;

      const reminderTotal =
        reminderTime.getHours() * 60 + reminderTime.getMinutes();
      const currentTotal = now.getHours() * 60 + now.getMinutes();

      let diff = reminderTotal - currentTotal;
      if (diff < 0) diff += 1440;

      return diff;
    } catch {
      return Infinity;
    }
  };

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
    } catch {
      setError("Failed to fetch plants. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E5D1E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchPlants}
          className="bg-[#1E5D1E] text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[#53675E]">My Plants</h2>
        <Link to="/add-plant">
          <button className="bg-[#1E5D1E] text-white px-4 py-2 rounded-[24px] text-sm font-semibold">
            + new plants
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search your plant!"
          className="w-full py-2 px-4 rounded-lg border border-gray-300"
        />
      </div>

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

      {filteredPlants.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-[#53675E] text-lg mb-4">
            {searchTerm || activeFilter !== "all"
              ? "No plants found matching your criteria."
              : "No plants found. Add your first plant!"}
          </p>
          {!searchTerm && activeFilter === "all" && (
            <Link to="/add-plant">
              <button className="bg-[#1E5D1E] text-white px-6 py-2 rounded-[24px]">
                + Add Plant
              </button>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlants.map((plant) => (
          <Link to={`/plant-detail/${plant.id}`} key={plant.id}>
            <div className="bg-[#F4F3F3] p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <img
                  src={plant.image_url}
                  alt={plant.plant_name}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-[#53675E]">
                    {plant.plant_nickname}
                  </h3>
                  <p className="text-sm text-[#9D9191]">{plant.plant_name}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-[#9D9191]">
                  Added {calculateDaysSinceCreated(plant.createdAt)} days ago
                </span>
                <span className="text-xs text-[#1E5D1E] font-semibold">
                  {calculateTimeLeft(plant.time_reminder)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
