import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // OAuth2PasswordRequestForm expects username + password
      const formData = new URLSearchParams();
      formData.append("username", form.email);
      formData.append("password", form.password);

      const res = await API.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("email", form.email);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);

      alert(
        err.response?.data?.detail ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card mx-auto p-4 shadow"
        style={{ maxWidth: "450px" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account?
          <Link to="/signup"> Signup</Link>
        </p>
      </div>
    </div>
  );
}