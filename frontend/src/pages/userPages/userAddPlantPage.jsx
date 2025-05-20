import UserAddPlant from "../../components/userComponent/userAddPlant";
import NavBar from "../../components/userComponent/userNavBar";

const UserAddPlantPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavBar />
      <UserAddPlant />
    </div>
  );
};

export { UserAddPlantPage };
