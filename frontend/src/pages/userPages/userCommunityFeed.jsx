
import UserCommunityFeed from "../../components/userComponent/userCommunityFeed";
import UserFooterComponent from "../../components/userComponent/userFooter";
import NavBar from "../../components/userComponent/userNavBar";

const UserCommunityFeedPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content area with navbar and content */}
      <div className="flex-1">
            <NavBar />
        <div className="flex-1">
            < UserCommunityFeed/>
        </div>
      </div>
      
      {/* footer with ml-64 for sidebar didnt hide */}
      <div className="md:ml-64"> 
        <UserFooterComponent />
      </div>
    </div>
  );
};

export { UserCommunityFeedPage };