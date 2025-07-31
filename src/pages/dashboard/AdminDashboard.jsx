import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-blue-700 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">You can manage users, organizations, and system setup here.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-medium mb-2">Manage Teachers</h3>
          <p className="text-gray-500">Add/edit/delete teacher profiles.</p>
        </div>

        <Link
          to="/dashboard/admin/organization-setup"
          className="p-4 border rounded shadow hover:shadow-lg transition block hover:bg-blue-50"
        >
          <h3 className="text-xl font-medium mb-2 text-blue-700">Organization Setup</h3>
          <p className="text-gray-500">Set up and assign organizations.</p>
        </Link>

        <div className="p-4 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-medium mb-2">Roles & Privileges</h3>
          <p className="text-gray-500">Configure roles and access levels.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
