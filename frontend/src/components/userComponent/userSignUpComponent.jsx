import { useState } from "react";

const UserSignupComponent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        setSignupError(data.msg || "Signup failed");
        setIsLoading(false);
        return;
      }

      window.location.href = "/login";
      
      setIsLoading(false);
    } catch (error) {
      setSignupError(error.message || "Failed to signup. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section
      className="flex min-h-screen flex-col md:flex-row"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/f7/ee/38/f7ee380359b9fb38dca99e3060f1d86c.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Mobile Text */}
      <div className="block md:hidden w-full pt-10 px-4">
        <h1 className="text-[#53675E] text-[48px] font-bold leading-none">
          Plant
        </h1>
        <h1 className="text-[#53675E] text-[48px] font-bold leading-none">
          2gether
        </h1>
        <h2 className="text-[#1E5D1E] text-[16px] font-semibold pt-2">
          welcome to our green space
        </h2>
      </div>

      {/* Left Side Image (desktop) */}
      <div className="w-1/2 hidden md:block relative">
        <img
          src="https://i.pinimg.com/736x/f7/ee/38/f7ee380359b9fb38dca99e3060f1d86c.jpg"
          className="w-full h-screen object-cover"
          alt="signup visual"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-start ml-4 z-10 pointer-events-none">
          <h1 className="text-[#53675E] text-[65px] font-bold px-6 pt-10 leading-none">
            Plant
          </h1>
          <h1 className="text-[#53675E] text-[65px] font-bold px-6 leading-none">
            2gether
          </h1>
          <h1 className="text-[#1E5D1E] text-[16px] font-semibold px-6 py-4 leading-none">
            welcome to our green space
          </h1>
        </div>
      </div>

      {/* Right Side with Signup Form */}
      <div className="flex items-center justify-center md:w-1/2 w-full md:bg-[#E3E7E1]/90 px-4 py-10 md:py-0">
        <div className="w-full max-w-md p-8 bg-white rounded-[25px] shadow-lg">
          <h2 className="text-[#53675E] font-bold text-[35px] mb-4">Sign Up</h2>

          {signupError && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {signupError}
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Username Field */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-[#F4F3F3] text-[#9D9191] font-light border border-white rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#7C968A]"
              />
              <div className="h-[16px] mt-1">
                <p className="text-[#D37070] text-[10px] leading-[1rem]">
                  {errors.username || "\u00A0"}
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#F4F3F3] text-[#9D9191] font-light border border-white rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#7C968A]"
              />
              <div className="h-[16px] mt-1">
                <p className="text-[#D37070] text-[10px] leading-[1rem]">
                  {errors.email || "\u00A0"}
                </p>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#F4F3F3] text-[#9D9191] font-light border border-white rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#7C968A]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-6.5 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              <div className="h-[16px] mt-1">
                <p className="text-[#D37070] text-[10px] leading-[1rem]">
                  {errors.password || "\u00A0"}
                </p>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-[#F4F3F3] text-[#9D9191] font-light border border-white rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#7C968A]"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-6.5 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              <div className="h-[16px] mt-1">
                <p className="text-[#D37070] text-[10px] leading-[1rem]">
                  {errors.confirmPassword || "\u00A0"}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-[130px] p-3 mb-4 shadow-inner bg-[#5AA67E] rounded-[64px] text-white font-medium hover:bg-[#4c8c6d] disabled:opacity-50"
              >
                {isLoading ? "SIGNING UP..." : "SIGN UP"}
              </button>
            </div>
          </form>

          <div className="text-center text-[#888888] text-sm mt-4">
            <p>
              already have an account?{" "}
              <a href="/login" className="text-[#5AA67E] underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSignupComponent;