import { useEffect, useState } from "react";
import axios from "axios";

const QuestionTypeList = () => {
  const [types, setTypes] = useState([]);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9090/api/v1/question-types/ui/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes(res.data);
    } catch (err) {
      console.error("Failed to fetch question types", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this type?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9090/api/v1/question-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes((prev) => prev.filter((type) => type.id !== id));
    } catch (err) {
      console.error("Failed to delete question type", err);
    }
  };

  const handleEditClick = (type) => {
    setEditingTypeId(type.id);
    setEditFormData({
      name: type.name,
      description: type.description || "",
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
        `http://localhost:9090/api/v1/question-types/update/${editingTypeId}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTypes((prev) =>
        prev.map((type) =>
          type.id === editingTypeId ? { ...type, ...editFormData } : type
        )
      );

      setEditingTypeId(null);
    } catch (err) {
      console.error("Failed to update question type", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTypeId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Question Type List</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type, index) => (
            <tr key={type.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                {editingTypeId === type.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  type.name
                )}
              </td>
              <td className="border p-2">
                {editingTypeId === type.id ? (
                  <input
                    type="text"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  type.description || "-"
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editingTypeId === type.id ? (
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
                      onClick={() => handleEditClick(type)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
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

export default QuestionTypeList;
