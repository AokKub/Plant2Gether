import NavBar from "../../components/userComponent/userNavBar"
import UserPlantDetailComponent from "../../components/userComponent/userPlantDetailComponent"

export default function UserPlantDetailPage(){
  return (
    <div className="flex flex-col">
        <NavBar />
        <UserPlantDetailComponent />
    </div>
  )
}