import NavBar from "../../components/userComponent/userNavBar";
import UserMyplant from "../../components/userComponent/userMyplant";
import UserFooterComponent from "../../components/userComponent/userFooter";

const MyPlantPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <div className="flex-1 md:ml-65 flex flex-col pb-32">
        <main className="flex-grow">
          <UserMyplant />
        </main>
      </div>
      <div className="md:ml-64">
      <UserFooterComponent/>
      </div>
    </div>
  );
};
export default MyPlantPage;