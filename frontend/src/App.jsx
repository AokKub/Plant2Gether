import { createBrowserRouter, RouterProvider } from "react-router";

import "./App.css";
import MyPlantPage from "./pages/userPages/MyPlantPage";


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
  return <RouterProvider router={router} />;
}

export default App;