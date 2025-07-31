import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl bg-white bg-opacity-90 p-10 rounded-2xl shadow-lg">
          <div className="flex justify-center text-blue-600 text-6xl">
            <FaBookOpen />
          </div>
          <h1 className="text-4xl font-extrabold text-blue-700">Welcome to QuestionBank</h1>
          <p className="text-lg text-gray-700">
            An all-in-one platform to create, manage, and attend exams with ease and efficiency.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-gray-600 text-sm mt-4">
            <div>✅ Create and organize question banks</div>
            <div>✅ Generate printable exam papers</div>
            <div>✅ Assign marks and question types</div>
            <div>✅ Download as PDF or DOCX</div>
          </div>

          <div className="space-x-4 pt-6">
            <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-4 bg-white bg-opacity-70">
        © {new Date().getFullYear()} QuestionBank. All rights reserved. | Powered by Nuzhat
      </footer>
    </div>
  );
};

export default Home;
