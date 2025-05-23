import UserAddPlant from "../../components/userComponent/userAddPlant";
import UserFooterComponent from "../../components/userComponent/userFooter";
import NavBar from "../../components/userComponent/userNavBar";

const UserAddPlantPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content area with navbar and content */}
      <div className="flex-1">
        <NavBar />
        <div className="flex-1">
          <UserAddPlant />
        </div>
      </div>
      
      <div className="md:ml-64"> 
        <UserFooterComponent />
      </div>
    </div>
  );
};

export { UserAddPlantPage };