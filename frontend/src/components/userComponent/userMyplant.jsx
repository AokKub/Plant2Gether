import React from 'react';

export default function UserMyplant() {
  const plants = [
    {
      id: 1,
      name: "TungTang",
      species: "Dieffenbachia",
      days: 3,
      status: "ALIVE",
      timeLeft: "1 hrs. 14 mins.",
      image: "/plant-image.jpg" 
    },
    {
      id: 2,
      name: "TungTang",
      species: "Dieffenbachia",
      days: 3,
      status: "ALIVE",
      timeLeft: "1 hrs. 14 mins.",
      image: "/plant-image.jpg" 
    },

    
    
  ];

  return (
    <div className="ml-64 p-8 pt-15 flex-1 bg-white">
      {/* Breadcrumb */}
      <div className="flex items-center text-lg text-[#53675E] mb-6">
        <span className="text-[20px] font-bold">My Plants</span>
      </div>
      
      {/* add and serch*/}
      <div className="flex items-center justify-between mb-8">
        <div className="relative flex-1 mr-4 text-[12px]">
          <input
            type="text"
            placeholder="Search your plant!"
            className="w-full py-3 px-10 rounded-[15px] bg-[#F4F3F3] focus:outline-none"
          />
          <svg 
            className="absolute left-4 top-3.5 text-[#9D9191] w-3 h-3"
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex items-center">
          <button className="p-2 mr-4">
            <svg 
              className="w-6 h-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="bg-[#1E5D1E] text-white px-4 py-1.5 rounded-[24px] flex items-center">
            <span className="font-bold text-[20px] tracking-wide">+ new plants</span>
          </button>
        </div>
      </div>
      
      {/* tree card */}
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plants.map((plant) => (
            <div key={plant.id} className="bg-[#F4F3F3] rounded-[15px] shadow-sm overflow-hidden h-48">
              <div className="flex h-full">
                {/* plant pic */}
                <div className="w-1/3 flex items-center justify-center pl-4 ">
                  <img
                    src="https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2"
                    alt={plant.name}
                    className="object-cover h-40 w-40 rounded-[15px]"
                  />
                </div>
              
              {/* tree detail */}
              <div className="w-2/3 p-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-[16px] font-semibold text-[#53675E]">{plant.name}</h3>
                      <span className="ml-2 px-2 py-0.5 bg-[#5AA67E] font-extrabold tracking-wider text-white text-[10px] rounded-full">
                        {plant.status}
                      </span>
                    </div>
                    <p className="font-regular mt-1 text-[12px] text-[#53675E]">{plant.species}</p>
                    <p className="text-sm text-[#53675E]">{plant.days} days</p>
                  </div>
                  
                  <button className="text-[#9D9191]">
                    <svg 
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                
                {/* เวลาที่เหลือและไอคอนน้ำ */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="font-regular text-[#7C968A] text-[12px]">
                    Timeleft: {plant.timeLeft}
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
                    <span className="font-regular text-[12px] text-[#53675E]">{plant.days} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}