import { useEffect, useState } from "react";
import axios from "axios";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    parentId: null,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9090/api/v1/subjects/ui/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9090/api/v1/subjects/subject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting subject", err);
    }
  };

  const handleEditClick = (subject) => {
    setEditingSubjectId(subject.id);
    setEditFormData({
      name: subject.name,
      parentId: subject.parentId || null,
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
        `http://localhost:9090/api/v1/subjects/update/${editingSubjectId}`,
        {
          name: editFormData.name,
          parentId: editFormData.parentId || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editingSubjectId ? { ...s, name: editFormData.name, parentId: editFormData.parentId } : s
        )
      );
      setEditingSubjectId(null);
    } catch (err) {
      console.error("Error updating subject", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingSubjectId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Subject List</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Subject Name</th>
            <th className="border p-2">Parent Subject</th>
            <th className="border p-2">Child Subjects</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={subject.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                {editingSubjectId === subject.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  />
                ) : (
                  subject.name
                )}
              </td>
              <td className="border p-2">
                {editingSubjectId === subject.id ? (
                  <select
                    name="parentId"
                    value={editFormData.parentId || ""}
                    onChange={handleEditChange}
                    className="w-full border px-2"
                  >
                    <option value="">None</option>
                    {subjects
                      .filter((s) => s.id !== subject.id) // prevent self-reference
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  subject.parentName || "-"
                )}
              </td>
              <td className="border p-2">
                {subject.children && subject.children.length > 0
                  ? subject.children.map((child) => child.name).join(", ")
                  : "-"}
              </td>
              <td className="border p-2 space-x-2">
                {editingSubjectId === subject.id ? (
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
                      onClick={() => handleEditClick(subject)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
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

export default SubjectList;
