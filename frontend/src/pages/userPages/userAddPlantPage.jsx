import UserAddPlant from "../../components/userComponent/userAddPlant";
import UserFooterComponent from "../../components/userComponent/userFooter";
import NavBar from "../../components/userComponent/userNavBar";

const UserAddPlantPage = () => {
  return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <div className="flex-1 md:ml-50 flex flex-col ">
        <main className="flex-grow">
          <UserAddPlant />
        </main>
=======
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content area with navbar and content */}
      <div className=" flex-1">
        <NavBar />
        <div className="flex-1">
          <UserAddPlant />
        </div>
      </div>
      
      <div className="ml-64"> 
>>>>>>> origin/main
        <UserFooterComponent />
      </div>
    </div>
  );
};

export { UserAddPlantPage };