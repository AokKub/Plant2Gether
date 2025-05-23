import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserCommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate days ago
  function calculateDaysAgo(dateString) {
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
  }

  // Format date for display (e.g., "5/5/2025")
  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
        // Fallback mock data for demo purposes
        const mockPosts = [
          {
            id: 1,
            user: {
              firstname: "John",
              lastname: "Doe",
              user_img: "/",
            },
            plant: {
              plant_name: "Dieffenbachia",
              plant_nickname: "Keaw Kachee",
              plant_img:
                "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2",
            },
            status: true,
            createdAt: "2025-05-20T00:00:00Z",
          },
          {
            id: 2,
            user: {
              firstname: "Jane",
              lastname: "Smith",
              user_img: "/",
            },
            plant: {
              plant_name: "Dieffenbachia",
              plant_nickname: "Keaw Kachee",
              plant_img:
                "https://cdn11.bigcommerce.com/s-wzfpfq4l/images/stencil/1280x1280/products/908/1016/green_plant__56554.1548787500.jpg?c=2",
            },
            status: true,
            createdAt: "2025-05-20T00:00:00Z",
          },
        ];
        setPosts(mockPosts);
        setFilteredPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => {
      const plantName = post.plant.plant_name?.toLowerCase() || "";
      const plantNickname = post.plant.plant_nickname?.toLowerCase() || "";
      const userFirstname = post.user.firstname?.toLowerCase() || "";
      const userLastname = post.user.lastname?.toLowerCase() || "";
      return (
        plantName.includes(lowerQuery) ||
        plantNickname.includes(lowerQuery) ||
        userFirstname.includes(lowerQuery) ||
        userLastname.includes(lowerQuery)
      );
    });
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen md:ml-65 bg-white px-6 py-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            <div className="bg-[#F4F3F3] rounded-2xl p-6">
              <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="bg-[#F4F3F3] rounded-2xl p-6">
              <div className="h-80 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && filteredPosts.length === 0) {
    return (
      <div className="min-h-screen md:ml-65 bg-white px-6 py-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}. Showing demo data instead.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:ml-65 bg-white">
      {/* Header */}
      <div className="px-6 py-4 pt-0 md:pt-4">
        <div className="hidden md:flex md:pt-10 items-center text-[#88AE9D] text-[18px] font-bold mb-6">
          <Link to="/" className="hover:text-[#1E5D1E]">
            My plants
          </Link>
          <ChevronRight className="w-[24px] h-[24px] mx-2" />
          <span className="text-[#53675E] font-bold">Community</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mr-2 text-[12px]">
          <input
            type="text"
            placeholder="Search by plant or user"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-3 px-10 rounded-[15px] bg-[#F4F3F3] focus:outline-none"
          />
          <svg
            className="w-4 h-4 absolute left-4 top-3 text-[#9D9191]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 mt-0 md:mt-4">
        {filteredPosts.length === 0 && searchQuery ? (
          <div className="text-center text-[#53675E] text-[16px]">
            No posts found for "{searchQuery}"
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#F4F3F3] rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4 mb-6"
            >
              <div className="flex flex-col md:flex-row">
                {/* Desktop Plant image */}
                <div className="hidden md:block w-80 h-80 bg-gray-200 rounded-lg relative overflow-hidden">
                  <img
                    src={post.plant.plant_img}
                    alt={post.plant.plant_nickname}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Mobile & Desktop Post */}
                <div className="flex-1 p-4 md:p-6 bg-white rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none flex flex-col justify-between">
                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start gap-4">
                    {/* Left side: Author + message */}
                    <div className="flex-1">
                      {/* Author */}
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-200">
                          <img
                            src={post.user.user_img}
                            alt={`${post.user.firstname} ${post.user.lastname}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[#53675E] text-sm font-semibold">
                          {post.user.firstname} {post.user.lastname}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-[#1E5D1E] text-[15px] pt-6 font-medium leading-tight">
                        {post.status
                          ? `Splash! ${post.plant.plant_nickname} is all watered up!`
                          : `I just gave ${post.plant.plant_nickname} some love, Your turn!`}
                      </p>
                    </div>

                    {/* Right side: Plant image + plant name */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-xl overflow-hidden">
                        <img
                          src={post.plant.plant_img}
                          alt={post.plant.plant_nickname}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[#53675E] text-[10px] font-light mt-1">
                        {post.plant.plant_nickname}
                      </span>
                    </div>
                  </div>

                  {/* Days mobile */}
                  <div className="md:hidden flex items-center text-[#53675E] text-[14px] font-light">
                    <svg
                      className="w-4 h-4 text-blue-300 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                    </svg>
                    <span>{calculateDaysAgo(post.createdAt)} days</span>
                  </div>

                  {/* Desktop only content */}
                  <div className="hidden md:block justify-between">
                    {/* Author */}
                    <div className="flex items-center mb-1">
                      <div className="w-10 h-10 bg-[#F4F3F3] rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        <img
                          src={post.user.user_img}
                          alt={`${post.user.firstname} ${post.user.lastname}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[#53675E] text-[15px] font-semibold">
                        {post.user.firstname} {post.user.lastname}
                      </span>
                    </div>

                    <div className="border-b border-[#1E5D1E] my-4"></div>

                    <h3 className="font-semibold text-[#53675E] text-[16px] mb-1">
                      {post.plant.plant_nickname}
                    </h3>
                    <p className="text-[#53675E] font-light text-[16px] mb-1">
                      {post.plant.plant_name}
                    </p>
                    <p className="text-[#53675E] font-light text-[16px] mb-4">
                      {calculateDaysAgo(post.createdAt)} days since{" "}
                      {formatDate(post.createdAt)}
                    </p>

                    <div className="flex items-center justify-between pt-20">
                      <p className="text-[#1E5D1E] text-[15px] font-medium">
                        {post.status
                          ? `Splash! ${post.plant.plant_nickname} is all watered up!`
                          : `I just gave ${post.plant.plant_nickname} some love, Your turn!`}
                      </p>
                      <div className="flex items-center text-[#53675E] text-[16px] font-light">
                        <svg
                          className="w-4 h-4 text-blue-300 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                        </svg>
                        <span>{calculateDaysAgo(post.createdAt)} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
