import UserAddPlant from "../../components/userComponent/userAddPlant";
import UserFooterComponent from "../../components/userComponent/userFooter";
import NavBar from "../../components/userComponent/userNavBar";

const UserAddPlantPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 md:ml-50 flex flex-col ">
        <main className="flex-grow">
          <UserAddPlant />
        </main>

        <div className="md:ml-14">
          <UserFooterComponent />
        </div>
      </div>
    </div>
  );
};

export { UserAddPlantPage };
