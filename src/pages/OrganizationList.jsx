import { useEffect, useState } from "react";
import axios from "axios";

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    type: "",
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:9090/api/organizations/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrganizations(response.data);
    } catch (error) {
      console.error("Failed to fetch organizations", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9090/api/organizations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrganizations((prev) => prev.filter((org) => org.id !== id));
    } catch (error) {
      console.error("Failed to delete organization", error);
    }
  };

  const handleEditClick = (org) => {
    setEditingOrgId(org.id);
    setEditFormData({
      name: org.name,
      type: org.type,
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
      await axios.put(`http://localhost:9090/api/organizations/${editingOrgId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === editingOrgId ? { ...org, ...editFormData } : org
        )
      );

      setEditingOrgId(null);
    } catch (error) {
      console.error("Failed to update organization", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingOrgId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Organization List</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org, index) => (
            <tr key={org.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                {editingOrgId === org.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  org.name
                )}
              </td>
              <td className="border p-2">
                {editingOrgId === org.id ? (
                  <input
                    type="text"
                    name="type"
                    value={editFormData.type}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  org.type
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editingOrgId === org.id ? (
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
                      onClick={() => handleEditClick(org)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
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
    </div>
  );
};

export default OrganizationList;
