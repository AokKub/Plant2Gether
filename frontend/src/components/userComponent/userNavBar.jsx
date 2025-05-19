import { useState, useEffect } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // check current page
    const path = window.location.pathname;
    if (path.includes("/")) {
      setCurrentPage("/");
    } else if (path.includes("/")) {
      setCurrentPage("/");
    }
  }, []); // add empty dependency array for work only one time when component mount

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.href = `/${page}`;
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 fixed md:translate-x-0 z-40 flex flex-col w-64 md:w-64 h-full bg-white text-white font-inter shadow-lg hidden md:flex`}
      >
        <div className="flex flex-col items-start px-10 pt-10 h-full">
          <h1 className="text-[30px] font-bold text-[#53675E] leading-tight">
            Plant2gether
          </h1>
          <p className="mt-1 text-[10px] text-gray-400 font-medium">
            Let's give them a drink !
          </p>
          <div className="mt-20 space-y-2 text-[#53675E] font-bold text-[18px]">
            <div
              className={`cursor-pointer transition-colors ${currentPage === "/" ? "text-[#53675E]" : "text-[#88AE9D]"}`}
              onClick={() => navigateTo("/")}
            >
              My Plants
            </div>
            <div
              className={`cursor-pointer transition-colors ${currentPage === "community" ? "text-[#53675E]" : "text-[#88AE9D]"}`}
              onClick={() => navigateTo("community")}
            >
              Community
            </div>
          </div>
          <div className="mt-auto mb-4 flex items-center text-[#53675E] font-medium">
            <div className="flex items-center w-full">
              <div className="relative w-12 h-12 rounded-full border-1 border-[#1E5D1E] overflow-hidden mr-3 bg-gray-200">
              </div>
              <div>
                <div className="text-[18px]">Username</div>
                <button
                  className="flex items-center w-full underline text-[#D37070] text-[10px] font-light"
                  onClick={handleLogout}
                >
                  logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation - Visible only on Mobile */}
      <div className="px-5 py-6 md:hidden">
        <div className="flex justify-between items-start p-1">
          <div>
            <h1 className="text-[30px] font-bold text-[#53675E]">Plant2gether</h1>
            <p className="text-[10px] font-medium text-[#C6C6C6]">Let's give them a drink !</p>
            
            <div className="flex mt-3 text-[18px] font-bold">
              <div 
                className={`mr-6 ${currentPage === "/" ? "text-[#53675E] font-bold" : "text-[#88AE9D] font-bold"}`}
                onClick={() => navigateTo("/")}
              >
                My Plants
              </div>
              <div 
                className={`${currentPage === "community" ? "text-[#53675E] font-bold" : "text-[#88AE9D] font-bold"}`}
                onClick={() => navigateTo("community")}
              >
                Community
              </div>
            </div>
          </div>
          
          <button
              type="button"
              className="w-13 h-13 ml-30 rounded-full border border-[#1E5D1E] overflow-hidden bg-[#C6C6C6] cursor-pointer hover:bg-[#b0b0b0] focus:outline-none"
            >
          </button>
        </div>
      </div>
    </>
  );
}