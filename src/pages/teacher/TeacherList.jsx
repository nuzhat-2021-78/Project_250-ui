// src/pages/admin/TeacherList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9090/api/users/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error("Error fetching teachers", err);
        // Implement robust error handling, e.g., display an error message to the user
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Teacher List</h2>
      {teachers.length === 0 ? (
        <p>No teacher users found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name / Username</th> {/* Added for clarity */}
              <th className="border p-2">Email</th>
              <th className="border p-2">Contact Number</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Qualifications</th>
              <th className="border p-2">Join Date</th>
              <th className="border p-2">Roles & Privileges</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {teacher.name || teacher.user.username} {/* Display name or username if name is null */}
                </td>
                <td className="border p-2">{teacher.user.email}</td>
                <td className="border p-2">{teacher.contactNumber || "N/A"}</td>
                <td className="border p-2">{teacher.department || "N/A"}</td>
                <td className="border p-2">{teacher.qualifications || "N/A"}</td>
                <td className="border p-2">{teacher.joinDate || "N/A"}</td>
                <td className="border p-2">
                  {teacher.user.roles && teacher.user.roles.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {teacher.user.roles.map((role) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherList;