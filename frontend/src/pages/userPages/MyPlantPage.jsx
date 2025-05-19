import NavBar from "../../components/userComponent/userNavBar";
import UserMyplant from "../../components/userComponent/userMyplant";

const MyPlantPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavBar />

      <UserMyplant />
    </div>
  );
};

export default MyPlantPage;