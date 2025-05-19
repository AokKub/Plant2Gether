import { createBrowserRouter, RouterProvider } from "react-router";

import "./App.css";
import MyPlantPage from "./pages/userPages/MyPlantPage";
import { useEffect } from "react";
import { subscribeToPush } from "./services/notification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyPlantPage />,
  },
  {
    path: "/login",
    element: <userLoginPage />,
  },
]);

function App() {
  useEffect(() => {
    subscribeToPush();
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
