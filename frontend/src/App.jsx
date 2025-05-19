import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import UserLoginPage from "./pages/userPages/userLoginPage";


const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MyPlantPage />,
//   },
  {
    path: "/login",
    element: <UserLoginPage/>,
  },
  
    
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
