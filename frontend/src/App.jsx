import { createBrowserRouter, RouterProvider } from "react-router";

import "./App.css";
import MyPlantPage from "./pages/userPages/MyPlantPage";
import UserLoginPage from "./pages/userPages/userLoginPage";
import UserSignupPage from "./pages/userPages/userSignUpPage";
import { UserAddPlantPage } from "./pages/userPages/userAddPlantPage";
import { UserEditAccountPage } from "./pages/userPages/userEditAccPage";

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
    path: "/add-plant",
    element: <UserAddPlantPage />,
  },
  {
    path: "/edit-account",
    element: <UserEditAccountPage/>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
