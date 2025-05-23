import UserFooterComponent from "../../components/userComponent/userFooter";
import NavBar from "../../components/userComponent/userNavBar";
import UserPlantDetailComponent from "../../components/userComponent/userPlantDetailComponent";

export default function UserPlantDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <div className="flex-1 md:ml-64"> 
        <UserPlantDetailComponent />
      </div>

      <div className="md:ml-64">
        <UserFooterComponent />
      </div>
    </div>
  );
}

