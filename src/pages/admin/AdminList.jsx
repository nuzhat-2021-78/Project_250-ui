import { useEffect, useState } from "react";
import axios from "axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9090/api/users/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins", err);
    }
  };

  const handleEditClick = (admin) => {
    setEditingAdminId(admin.id);
    setEditFormData({
      name: admin.name || "",
      contactNumber: admin.contactNumber || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:9090/api/auth/admin/${editingAdminId}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === editingAdminId
            ? { ...admin, ...editFormData }
            : admin
        )
      );
      setEditingAdminId(null);
    } catch (err) {
      console.error("Failed to update admin", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingAdminId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9090/api/auth/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (err) {
      console.error("Failed to delete admin", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin List</h2>
      {admins.length === 0 ? (
        <p>No admin users found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Contact Number</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Roles & Privileges</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {editingAdminId === admin.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="w-full border px-2"
                    />
                  ) : (
                    admin.name
                  )}
                </td>
                <td className="border p-2">
                  {editingAdminId === admin.id ? (
                    <input
                      type="text"
                      name="contactNumber"
                      value={editFormData.contactNumber}
                      onChange={handleEditChange}
                      className="w-full border px-2"
                    />
                  ) : (
                    admin.contactNumber
                  )}
                </td>
                <td className="border p-2">{admin.user.email}</td>
                <td className="border p-2">
                  {admin.user.roles && admin.user.roles.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {admin.user.roles.map((role) => (
                        <li key={role.id}>
                          <strong>{role.name}</strong>:
                          {role.privileges && role.privileges.length > 0 ? (
                            <ul className="list-disc list-inside ml-4">
                              {role.privileges.map((privilege) => (
                                <li key={privilege.id}>{privilege.name}</li>
                              ))}
                            </ul>
                          ) : (
                            " No Privileges"
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  {editingAdminId === admin.id ? (
                    <>
                      <button
                        onClick={handleEditSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(admin)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminList;
