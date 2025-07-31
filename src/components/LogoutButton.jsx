import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      await axios.post("http://localhost:9090/api/auth//signout", { refreshToken });

      // Clear tokens and privileges from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("privileges");
      localStorage.removeItem("username");
      // etc - clear whatever you stored

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Still clear tokens and redirect to login to force logout on frontend
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Logout
    </button>
  );
};

export default Logout;
