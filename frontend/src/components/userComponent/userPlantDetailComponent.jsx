import React, { useState } from "react";

export default function PlantCard() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [plantData, setPlantData] = useState({
    name: "Keaw Kachee",
    species: "Dieffenbachia",
    addedDate: "5/5/2025",
    streak: 3,
    time: "1 hour 14 minutes",
    word: "Your plant is feeling a bit thirsty",
    isAlive: true,
  });

  const handleWaterClick = () => {
    setShowConfirm(true);
  };

  const confirmWater = () => {
    setShowConfirm(false);
    setPlantData({
      ...plantData,
      word: "Just watered!"
    });
  };

  const cancelWater = () => {
    setShowConfirm(false);
  };

  const svgIcons = {
    streak: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    ),
    timer: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    edit: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
      </svg>
    ),
  };

  return (
    <div className="w-full max-w-sm md:max-w-4xl mx-auto my-4 md:my-8 px-4 pb-16 overflow-x-hidden">
      <div className="bg-[#F4F3F3] rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-xl font-medium text-gray-700 text-center md:hidden mb-2">
          {plantData.name}
        </h2>

        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 md:h-64">
            <img
              src="https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2"
              className="w-full h-full max-w-full object-cover rounded-lg"
              alt="Plant"
            />
            {plantData.isAlive && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#5AA67E] text-white px-3 py-1 rounded-full text-xs font-bold">
                ALIVE
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 md:flex-1 text-center md:text-left flex flex-col justify-between min-h-[220px]">
            <div className="flex-grow">
              <div className="hidden md:flex justify-between items-center mb-2">
                <h2 className="text-2xl font-medium text-[#53675E]">
                  {plantData.name}
                </h2>
                <button className="text-[#1E5D1E] cursor-pointer flex items-center underline">
                  <span className="ml-1">edit</span>
                </button>
              </div>

              <p className="text-[#53675E] mb-1">{plantData.species}</p>
              <p className="text-[#53675E] text-sm md:text-base mb-2 md:mb-4">
                {plantData.streak} days since {plantData.addedDate}
              </p>

              <div className="flex justify-center md:justify-start items-center my-3 md:mb-6">
                <span className="w-4 h-4 flex items-center justify-center text-blue-500">
                  {svgIcons.streak}
                </span>
                <span className="ml-2 text-[#53675E]">
                  {plantData.streak} days
                </span>
              </div>
            </div>

            <div className="flex flex-col mb-5 md:flex-row md:items-center md:justify-between mt-4 space-y-2 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-[#7C968A] text-sm md:text-base">
                  {plantData.time} left
                </p>
                <p className="text-[#5AA67E] text-sm md:text-base hidden md:block">
                  {plantData.word}
                </p>
              </div>

              <button
                onClick={handleWaterClick}
                className="hidden sm:block bg-[#5AA67E] cursor-pointer text-white p-3 rounded-full hover:bg-green-600 mx-auto md:mx-0"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {svgIcons.streak}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* watering mb */}
      <div className="sm:hidden relative md:hidden">
        <button
          onClick={handleWaterClick}
          className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-[#5AA67E] cursor-pointer text-white p-3 rounded-full hover:bg-green-600 z-40"
        >
          <span className="w-6 h-6 flex items-center justify-center">
            {svgIcons.streak}
          </span>
        </button>
      </div>

      <p className="text-[#5AA67E] text-sm text-center mt-10 md:hidden">
        {plantData.word}
      </p>

      <div className="mt-4 text-center md:hidden">
        <button className="text-[#1E5D1E] cursor-pointer text-sm underline">
          edit
        </button>
      </div>

      {/* Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-transparent bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg md:px-15 px-8 py-6 max-w-md text-center">
            <h3 className="text-xl font-bold text-[#53675E] mb-4">
              Confirm watering?
            </h3>
            <div className=" flex justify-center md:gap-10 gap-4">
              <button
                onClick={cancelWater}
                className="bg-[#D37070] hover:bg-red-500 text-white font-semibold md:px-8 px-4 py-2 rounded-full"
              >
                Not now
              </button>
              <button
                onClick={confirmWater}
                className="bg-[#5AA67E] hover:bg-[#56A287] text-white font-semibold md:px-8 px-4 py-2 rounded-full"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
