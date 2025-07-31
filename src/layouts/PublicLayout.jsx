import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="p-4"><Outlet /></main>
    </div>
  );
};

export default PublicLayout;