import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserEditPlantDetailPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "Keaw Kachee",
    species: "Dieffenbachia",
    notificationTime: "08:00",
    image: "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Plant Info:", formData);
    alert("Plant details updated!");

    navigate("/plant-detail");
  };

  return (
    <div className="w-full max-w-sm md:max-w-4xl mx-auto my-4 md:my-8 px-4 pb-16 overflow-x-hidden">
      <div className="bg-[#F4F3F3] rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-xl font-medium text-gray-700 text-center mb-4 md:hidden">
          Edit Plant
        </h2>

        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 md:h-64">
            <img
              src={formData.image}
              className="w-full h-full max-w-full object-cover rounded-lg"
              alt="Plant"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5AA67E] file:text-white hover:file:bg-green-600"
            />
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 md:flex-1 text-center md:text-left">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#53675E] font-medium mb-1 text-left" htmlFor="name">
                  Plant Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AA67E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#53675E] font-medium mb-1 text-left" htmlFor="species">
                  Species
                </label>
                <input
                  type="text"
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AA67E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#53675E] font-medium mb-1 text-left" htmlFor="notificationTime">
                  Notification Time
                </label>
                <input
                  type="time"
                  id="notificationTime"
                  name="notificationTime"
                  value={formData.notificationTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AA67E]"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#5AA67E] text-white font-semibold py-2 px-4 rounded-full hover:bg-green-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
