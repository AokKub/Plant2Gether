import UserEditPlantDetail from "../../components/userComponent/userEditPlantDetail"
import NavBar from "../../components/userComponent/userNavBar"


export default function UserPlantEditDetailPage(){
  return (
    <div className="flex flex-col">
        <NavBar />
        <UserEditPlantDetail />
    </div>
  )
}