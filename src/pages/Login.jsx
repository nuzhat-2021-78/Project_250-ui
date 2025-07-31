import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9090/api/auth/signin", form);

      const {
        accessToken,
        refreshToken,
        username,
        email,
        roles // These are privileges
      } = response.data;

      // Store in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("privileges", JSON.stringify(roles));

      // Redirect logic based on privilege
      if (roles.includes("ADMIN_ACCESS")) {
        navigate("/dashboard/admin");
      } else if (roles.includes("TEACHER_ACCESS") || roles.includes("CREATE_ADMIN_BY_SUPER_ADMIN_ONLY")) {
        navigate("/dashboard/teacher");
      } else {
        navigate("/"); // Default fallback
      }

    } catch (err) {
      console.error(err);
      setMessage("❌ Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-amber-600">Login</h2>

      {message && <div className="mb-4 text-sm text-red-600 text-center">{message}</div>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="input border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
