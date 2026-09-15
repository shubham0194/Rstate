import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import GoogleAuthButton from "../components/GoogleAuthButton";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await API.post("/user", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage(response.data.message || "User registered successfully!");
      console.log("Registered user:", response.data.data);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: "20px" }}>
        Register
      </h1>

      {errorMessage && (
        <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: "green", marginBottom: "10px" }}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

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
          {loading ? "Registering..." : "Register"}
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "15px 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
          <span style={{ padding: "0 10px", color: "#666", fontSize: "14px" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
        </div>

        <GoogleAuthButton text="signup_with" onError={setErrorMessage} />

        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>
            Login instead
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
