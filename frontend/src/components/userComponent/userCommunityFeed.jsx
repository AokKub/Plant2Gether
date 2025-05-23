import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserCommunityFeed() {
  const posts = [
    {
      id: 1,
      image: "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2",
      author: "Author",
      profileImage: "/",
      title: "Keaw Kachee",
      plantName: "Dieffenbachia",
      days: 3,
      date: "5/5/2025",
      message: "I just gave my plant some love, Your turn!",
    },
    {
      id: 2,
      image: "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2",
      author: "Author",
      profileImage: "/",
      title: "Keaw Kachee",
      plantName: "Dieffenbachia",
      days: 3,
      date: "5/5/2025",
      message: "Splash! Keaw Kachee is all watered up!",
    },
  ];

  return (
    <div className="min-h-screen md:ml-65 bg-white">
      {/* Header */}
      <div className="px-6 py-4 pt-0 md:pt-4">
        <div className="hidden md:flex md:pt-10 items-center text-[#88AE9D] text-[18px] font-bold mb-6">
          <Link to="/" className="hover:text-[#1E5D1E]">My plants</Link>
          <ChevronRight className="w-[24px] h-[24px] mx-2" />
          <span className="text-[#53675E] font-bold">Community</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mr-2 text-[12px]">
          <input
            type="text"
            placeholder="Search"
            className="w-full py-3 px-10 rounded-[15px] bg-[#F4F3F3] focus:outline-none"
          />
          <svg className="w-4 h-4 absolute left-4 top-3 text-[#9D9191]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 mt-0 md:mt-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#F4F3F3] rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4 mb-6">
            <div className="flex flex-col md:flex-row">
              
              {/* Desktop Plant image */}
              <div className="hidden md:block w-80 h-80 bg-gray-200 rounded-lg relative overflow-hidden">
                <img src={post.image} alt="Plant" className="w-full h-full object-cover" />
              </div>

              {/* Mobile & Desktop Post*/}
              <div className="flex-1 p-4 md:p-6 bg-white rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none flex flex-col justify-between">

                {/* Mobile layout */}
                <div className="md:hidden flex items-start gap-4">
        
                  {/* Left side: Author + message */}
                  <div className="flex-1">
                    {/* Author */}
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-200">
                        <img src={post.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[#53675E] text-sm font-semibold">{post.author}</span>
                    </div>

                    {/* Message */}
                    <p className="text-[#1E5D1E] text-[15px] pt-6 font-medium leading-tight">{post.message}</p>
                  </div>

                  {/* Right side: Plant image + plant name */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-xl overflow-hidden">
                      <img src={post.image} alt="Plant" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[#53675E] text-[10px] font-light mt-1">{post.title}</span>
                  </div>
                </div>

                {/* Day mobile  */}
                <div className="md:hidden flex items-center text-[#53675E] text-[14px] font-light">
                  <svg className="w-4 h-4 text-blue-300 mr-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                  <span>{post.days} days</span>
                </div>

                {/* Desktop only content */}
                <div className="hidden md:block justify-between">
                  {/* Author */}
                  <div className="flex items-center mb-1">
                    <div className="w-10 h-10 bg-[#F4F3F3] rounded-full flex items-center justify-center mr-3 overflow-hidden">
                      <img src={post.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[#53675E] text-[15px] font-semibold">{post.author}</span>
                  </div>

                  <div className="border-b border-[#1E5D1E] my-4"></div>

                  <h3 className="font-semibold text-[#53675E] text-[16px] mb-1">{post.title}</h3>
                  <p className="text-[#53675E] font-light text-[16px] mb-1">{post.plantName}</p>
                  <p className="text-[#53675E] font-light text-[16px] mb-4">{post.daysAgo} days since {post.date}</p>

                  <div className="flex items-center justify-between pt-20">
                    <p className="text-[#1E5D1E] text-[15px] font-medium">{post.message}</p>
                    <div className="flex items-center text-[#53675E] text-[16px] font-light">
                      <svg className="w-4 h-4 text-blue-300 mr-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                      </svg>
                      <span>{post.days} days</span>
                    </div>
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
