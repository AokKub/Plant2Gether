import { createBrowserRouter, RouterProvider } from "react-router";

import "./App.css";
import MyPlantPage from "./pages/userPages/MyPlantPage";
import { useEffect } from "react";
import { subscribeToPush } from "./services/notification";
import UserLoginPage from "./pages/userPages/userLoginPage";
import UserSignupPage from "./pages/userPages/userSignUpPage";
import UserPlantDetailPage from "./pages/userPages/userPlantDetailPAge";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyPlantPage />,
  },
  {
    path: "/login",
    element: <UserLoginPage />,
  },
  {
    path: "/signup",
    element: <UserSignupPage />,
  },
  {
    path: "/plant-detail",
    element: <UserPlantDetailPage />,
  },
]);

function App() {
  useEffect(() => {
    subscribeToPush();
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
