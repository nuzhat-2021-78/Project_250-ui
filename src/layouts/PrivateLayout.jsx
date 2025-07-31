import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const sidebarItems = [
  { label: "Admin Dashboard", path: "/dashboard/admin", requiredPrivilege: "ADMIN_ACCESS" },
  { label: "User Management", path: "/admin/users", requiredPrivilege: "ADMIN_ACCESS" },
  {
    label: "Organizations",
    children: [
      { label: "Setup", path: "/dashboard/admin/organization-setup", requiredPrivilege: "SETUP_PERMISSION" },
      { label: "List", path: "/dashboard/admin/organization-list", requiredPrivilege: "ADMIN_ACCESS" },
    ],
  },
  {
    label: "ClassLevels",
    children: [
      { label: "Setup", path: "/dashboard/admin/classLevel-setup", requiredPrivilege: "SETUP_PERMISSION" },
      { label: "List", path: "/dashboard/admin/classLevel-list", requiredPrivilege: "ADMIN_ACCESS" },
    ],
  },
  {
    label: "DifficultyLevels",
    children: [
      { label: "Setup", path: "/dashboard/admin/difficultyLevel-setup", requiredPrivilege: "SETUP_PERMISSION" },
      { label: "List", path: "/dashboard/admin/difficultyLevel-list", requiredPrivilege: "ADMIN_ACCESS" },
    ],
  },
  {
    label: "QuestionTypes",
    children: [
      { label: "Setup", path: "/dashboard/admin/questionType-setup", requiredPrivilege: "SETUP_PERMISSION" },
      { label: "List", path: "/dashboard/admin/questionType-list", requiredPrivilege: "ADMIN_ACCESS" },
    ],
  },
  {
    label: "Subjects",
    children: [
      { label: "Setup", path: "/dashboard/admin/subject-setup", requiredPrivilege: "SETUP_PERMISSION" },
      { label: "List", path: "/dashboard/admin/subject-list", requiredPrivilege: "ADMIN_ACCESS" },
    ],
  },
  {
    label: "Admins",
    children: [
      { label: "Setup", path: "/dashboard/super-admin/admin-setup", requiredPrivilege: "SUPER_ADMIN_ACCESS" },
      { label: "List", path: "/dashboard/super-admin/admin-list", requiredPrivilege: "SUPER_ADMIN_ACCESS" },
    ],
  },
  {
    label: "Questions",
    children: [
      { label: "Setup", path: "/dashboard/create-question-new", requiredPrivilege: "CREATE_QUESTION" },
      { label: "List", path: "/dashboard/question-list", requiredPrivilege: "CREATE_QUESTION" },
    ],
  },
  {
    label: "Exam-Papers",
    children: [
      { label: "Setup", path: "/dashboard/create-exam-paper", requiredPrivilege: "CREATE_EXAM_PAPER" },
      { label: "List", path: "/dashboard/exam-paper-list", requiredPrivilege: "CREATE_EXAM_PAPER" },
      { label: "Download List", path: "/dashboard/exam-paper-download", requiredPrivilege: "CREATE_EXAM_PAPER" },
    ],
  },
  { label: "Teacher Dashboard", path: "/dashboard/teacher", requiredPrivilege: "TEACHER_ACCESS" },
  { label: "Create Questions", path: "/dashboard/create-question", requiredPrivilege: "CREATE_QUESTION" },  
  
];

const PrivateLayout = () => {
  const privileges = JSON.parse(localStorage.getItem("privileges") || "[]");
  const isSuperAdmin = privileges.includes("SUPER_ADMIN_ACCESS");

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const hasAccess = (requiredPrivilege) =>
    isSuperAdmin || privileges.includes(requiredPrivilege);

  return (
    <div className="flex">
      <aside className="w-1/5 bg-gray-100 p-4 min-h-screen">
        <ul className="space-y-3">
          {sidebarItems.map((item, idx) => {
            // Regular item
            if (!item.children && hasAccess(item.requiredPrivilege)) {
              return (
                <li key={idx}>
                  <Link to={item.path} className="text-blue-700 hover:underline font-medium">
                    {item.label}
                  </Link>
                </li>
              );
            }

            // Menu with children
            if (item.children) {
              const visibleChildren = item.children.filter(child =>
                hasAccess(child.requiredPrivilege)
              );
              if (visibleChildren.length === 0) return null;

              return (
                <li key={idx}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="text-left w-full font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {item.label}
                  </button>
                  {openMenus[item.label] && (
                    <ul className="ml-4 mt-2 space-y-2 text-sm">
                      {visibleChildren.map((child, cIdx) => (
                        <li key={cIdx}>
                          <Link
                            to={child.path}
                            className="text-blue-700 hover:underline"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return null;
          })}
        </ul>
      </aside>

      <div className="flex-1">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
