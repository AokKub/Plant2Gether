import { useState } from "react";

const UserLoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 0) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        setLoginError(data.msg || "Login failed");
        setIsLoading(false);
        return;
      }

      // Handle the provided response structure
      if (data.loggedIn && data.loggedIn.status) {
        const { token, user } = data.loggedIn;

        // Store token and user data in localStorage
        localStorage.setItem("token", token.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            img_url: user.img_url,
          }),
        );

        // Redirect to dashboard or home page after successful login
        window.location.href = "/";
      } else {
        setLoginError("Invalid login credentials");
      }

      setIsLoading(false);
    } catch (error) {
      setLoginError(error.message || "Failed to login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section
      className="flex min-h-screen flex-col md:flex-row bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/f7/ee/38/f7ee380359b9fb38dca99e3060f1d86c.jpg')",
      }}
    >
      {/* Mobile Text */}
      <div className="block md:hidden w-full pt-10 px-4">
        <h1 className="text-[#53675E] text-4xl font-bold leading-none">
          Plant
        </h1>
        <h1 className="text-[#53675E] text-4xl font-bold leading-none">
          2gether
        </h1>
        <h2 className="text-[#1E5D1E] text-base font-semibold pt-2">
          welcome to our green space
        </h2>
      </div>

      {/* Left Side Image (desktop) */}
      <div className="w-1/2 hidden md:block relative">
        <img
          src="https://i.pinimg.com/736x/f7/ee/38/f7ee380359b9fb38dca99e3060f1d86c.jpg"
          className="w-full h-screen object-cover"
          alt="login visual"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-start ml-4 z-10 pointer-events-none">
          <h1 className="text-[#53675E] text-6xl font-bold px-6 pt-10 leading-none">
            Plant
          </h1>
          <h1 className="text-[#53675E] text-6xl font-bold px-6 leading-none">
            2gether
          </h1>
          <h1 className="text-[#1E5D1E] text-base font-semibold px-6 py-4 leading-none">
            welcome to our green space
          </h1>
        </div>
      </div>

      {/* Right Side with Login Form */}
      <div className="flex items-center justify-center md:w-1/2 w-full md:bg-[#E3E7E1]/90 px-4 py-10 md:py-0">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
          <h2 className="text-[#53675E] font-bold text-3xl mb-4">Login</h2>

          {loginError && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#F4F3F3] text-[#9D9191] font-light border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C968A]"
              />
              <div className="h-4 mt-1">
                <p className="text-[#D37070] text-xs leading-4">
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
                className="w-full p-3 bg-[#F4F3F3] text-[#9D9191] font-light border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C968A]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-7/20 transform -translate-y-1/2"
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
              <div className="h-4 mt-1">
                <p className="text-[#D37070] text-xs leading-4">
                  {errors.password || "\u00A0"}
                </p>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                className="hidden"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label
                htmlFor="remember"
                className="flex items-center cursor-pointer"
              >
                <div
                  className={`w-5 h-5 border rounded-md flex items-center justify-center transition-all duration-300 ${
                    rememberMe ? "border-[#7C968A]" : "border-gray-300"
                  }`}
                >
                  {rememberMe && (
                    <svg
                      className="w-4 h-4 text-[#7C968A]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-[#7C968A] text-base">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-32 p-3 mb-4 shadow-inner bg-[#5AA67E] rounded-full text-white font-medium hover:bg-[#4c8c6d] disabled:opacity-50"
              >
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </div>
          </form>

          <div className="text-center text-[#888888] text-sm mt-4">
            <p>
              don't have an account?{" "}
              <a href="/signup" className="text-[#5AA67E] underline">
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserLoginComponent;
