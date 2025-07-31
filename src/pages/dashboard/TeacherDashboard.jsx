const TeacherDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-green-700 mb-4">Teacher Dashboard</h1>
      <p className="text-gray-600">You can manage questions and exams here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-4 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-medium mb-2">Question Management</h3>
          <p className="text-gray-500">Create, edit, or delete questions in the question bank.</p>
        </div>

        <div className="p-4 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-xl font-medium mb-2">Exam Setup</h3>
          <p className="text-gray-500">Create and schedule new exams using the question bank.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
