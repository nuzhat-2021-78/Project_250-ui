import { useEffect, useState } from "react";
import axios from "axios";

const ClassLevelList = () => {
  const [classLevels, setClassLevels] = useState([]);
  const [editingClassLevel, setEditingClassLevel] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    curriculum: "",
    educationLevel: "",
  });

  useEffect(() => {
    fetchClassLevels();
  }, []);

  const fetchClassLevels = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9090/api/v1/class-levels/ui/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassLevels(res.data);
    } catch (err) {
      console.error("Error fetching class levels", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class level?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9090/api/v1/class-levels/class-level/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClassLevels((prev) => prev.filter((cl) => cl.id !== id));
    } catch (err) {
      console.error("Failed to delete class level", err);
    }
  };

  const handleEditClick = (cl) => {
    setEditingClassLevel(cl.id);
    setEditFormData({
      name: cl.name,
      curriculum: cl.curriculum || "",
      educationLevel: cl.educationLevel || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:9090/api/v1/class-levels/class-level/${editingClassLevel}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClassLevels((prev) =>
        prev.map((cl) =>
          cl.id === editingClassLevel ? { ...cl, ...editFormData } : cl
        )
      );
      setEditingClassLevel(null);
    } catch (err) {
      console.error("Error updating class level", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingClassLevel(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Class Level List</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Curriculum</th>
            <th className="border p-2">Education Level</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classLevels.map((cl, index) => (
            <tr key={cl.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                {editingClassLevel === cl.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  cl.name
                )}
              </td>
              <td className="border p-2">
                {editingClassLevel === cl.id ? (
                  <input
                    type="text"
                    name="curriculum"
                    value={editFormData.curriculum}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  cl.curriculum || "-"
                )}
              </td>
              <td className="border p-2">
                {editingClassLevel === cl.id ? (
                  <input
                    type="text"
                    name="educationLevel"
                    value={editFormData.educationLevel}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  cl.educationLevel || "-"
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editingClassLevel === cl.id ? (
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
                      onClick={() => handleEditClick(cl)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cl.id)}
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

export default ClassLevelList;
