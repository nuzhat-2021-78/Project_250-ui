import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "ADMIN", "TEACHER", etc.

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Left - Brand */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide hover:text-blue-100 transition duration-200"
      >
        QuestionBank
      </Link>

      {/* Right - Links */}
      <div className="flex space-x-6 text-sm font-medium">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="hover:text-blue-200 transition duration-150"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-blue-200 transition duration-150"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to={`/dashboard/${role?.toLowerCase()}`}
              className="hover:text-blue-200 transition duration-150"
            >
              Dashboard
            </Link>
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
