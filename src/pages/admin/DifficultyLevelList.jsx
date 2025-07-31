import { useEffect, useState } from "react";
import axios from "axios";

const DifficultyLevelList = () => {
  const [levels, setLevels] = useState([]);
  const [editingLevelId, setEditingLevelId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    level: "",
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:9090/api/v1/difficulty-levels/ui/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLevels(response.data);
    } catch (error) {
      console.error("Failed to fetch difficulty levels", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this difficulty level?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9090/api/v1/difficulty-levels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLevels((prev) => prev.filter((lvl) => lvl.id !== id));
    } catch (error) {
      console.error("Failed to delete difficulty level", error);
    }
  };

  const handleEditClick = (lvl) => {
    setEditingLevelId(lvl.id);
    setEditFormData({ level: lvl.level });
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
        `http://localhost:9090/api/v1/difficulty-levels/${editingLevelId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLevels((prev) =>
        prev.map((lvl) =>
          lvl.id === editingLevelId ? { ...lvl, ...editFormData } : lvl
        )
      );

      setEditingLevelId(null);
    } catch (error) {
      console.error("Failed to update difficulty level", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingLevelId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Difficulty Level List</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Level</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((lvl, index) => (
            <tr key={lvl.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                {editingLevelId === lvl.id ? (
                  <input
                    type="text"
                    name="level"
                    value={editFormData.level}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  lvl.level
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editingLevelId === lvl.id ? (
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
                      onClick={() => handleEditClick(lvl)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lvl.id)}
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

export default DifficultyLevelList;
