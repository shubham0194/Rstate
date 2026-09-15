

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import GoogleAuthButton from "../components/GoogleAuthButton";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await API.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      const userData = response.data.data;
      const { token, ...user } = userData;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccessMessage(response.data.message || "Login successful!");
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid credentials or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: "20px" }}>
        Login
      </h1>

      {errorMessage && (
        <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: "green", marginBottom: "10px" }}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "15px 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          <span style={{ padding: "0 10px", color: "#666", fontSize: "14px" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
        </div>

        <GoogleAuthButton text="signin_with" onError={setErrorMessage} />

        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
            Register
          </Link>
          <span> instead</span>
        </p>
      </form>
    </div>
  );
}

export default Login;