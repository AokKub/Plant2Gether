
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
            className="w-full py-3 px-10 rounded-[15px] bg-[#F4F3F3] focus:outline-none"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 absolute left-4 top-3 text-[#9D9191]">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>

        {/* Filter icon  */}
        <button className="p-1 text-[#9D9191] rounded-[15px] flex-shrink-0 min-w-[40px]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-9 ">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>

        </button>
      </div>

      {/* + new plants (mobile ) */}
      <div className="lg:hidden flex justify-end">
      <button className="bg-[#1E5D1E] text-white px-3 py-1 rounded-[24px] flex items-center">
        <span className="font-bold text-[14px] tracking-wide"> + new plants</span>
      </button>
      </div>

      {/* + new plants (desktop) */}
      <div className="hidden lg:flex items-center">
        <button className="bg-[#1E5D1E] text-white px-4 py-1.5 rounded-[24px] flex items-center">
          <span className="font-bold text-[20px] tracking-wide">+ new plants</span>
        </button>
      </div>
      </div>

      {/* plant card */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {plants.map((plant) => (
          <div key={plant.id} className="bg-[#F4F3F3] rounded-[15px] shadow-sm overflow-hidden">

            {/* For mobile view */}
            <div className="block md:hidden">
              <div className="p-4 pb-2">
                <div className="flex">
                  <div className="w-32 h-32 mr-4">
                    <img
                      src="https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2"
                      alt={plant.name}
                      className="w-full h-full rounded-[15px]"
                    />
                  </div>
                  <div className="flex-1">
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
                  </div>
                </div>
                
                <div className="relative mt-2">
                  <div className="absolute bottom-0 left-36 text-[#7C968A] text-[12px]">
                    Timeleft: {plant.timeLeft}
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
                    <span className="font-regular text-[12px] text-[#53675E]">{plant.days} days</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For desktop view */}
            <div className="hidden md:flex h-48">
              {/* plant pic - fixed width with spacing */}
              <div className="w-48 flex items-center justify-center pl-4">
                <div className="w-40 h-40 ">
                  <img
                    src="https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2"
                    alt={plant.name}
                    className="object-cover h-40 w-40 rounded-[15px]"
                  />
                </div>
              </div>
            
              {/* plant detail */}
              <div className="flex-1 p-4 relative">
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
                
                {/* remaining time */}
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
       