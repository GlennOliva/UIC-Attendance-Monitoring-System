import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/logo_main.png";
import "../../css/login.css";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role to "admin"
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });
  

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form reload

    if (!email || !password) {
      setSnackbar({ open: true, message: "Email and password are required.", severity: "error" });
      return;
    }

    try {
      const url =
        role === "admin"
          ? `${apiUrl}admin/login`
          : role === "teacher"
          ? `${apiUrl}teacher/login`
          : `${apiUrl}student/login`;

      const response = await axios.post(url, { email, password });

      if (response.status === 200) {
        console.log(`${role} Login Successful:`, response.data);

        // Clear previous stored IDs
        localStorage.removeItem("admin_id");
        localStorage.removeItem("teacher_id");
        localStorage.removeItem("student_id");

        // Store user ID based on role
        if (role === "admin") {
          localStorage.setItem("admin_id", response.data.admin.id);
          setSnackbar({ open: true, message: "Admin Login Successful!", severity: "success" });
          setTimeout(() => navigate("/admin/dashboard"), 1500);
        } else if (role === "teacher") {
          localStorage.setItem("teacher_id", response.data.teacher.id);
          setSnackbar({ open: true, message: "Teacher Login Successful!", severity: "success"  });
          setTimeout(() => navigate("/teacher/dashboard"), 1500);
        } else {
          localStorage.setItem("student_id", response.data.student.id);
          setSnackbar({ open: true, message: "Student Login Successful!", severity: "success" });
          setTimeout(() => navigate("/student/dashboard"), 1500);
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setSnackbar({ open: true, message: error.response.data?.error || "Login failed", severity: "error" });
      } else {
        setSnackbar({ open: true, message: "An unexpected error occurred.", severity: "error" });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="login-title">
          UIC ATTENDANCE <br /> MONITORING SYSTEM
        </h1>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2 className="login-header">LOGIN PAGE</h2>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="input-group relative">
              <i className="bx bx-group icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <select 
                className="input-field pl-10"  
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div className="input-group">
              <i className="bx bx-envelope email-icon"></i>
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="bx bx-lock password-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showPassword ? "bx-hide" : "bx-show"} eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* Login Button */}
            <button className="login-button" type="submit">
              LOGIN
            </button>
          </form>
        </div>
      </div>

      <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "right" }} // Correct positioning
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity} // Dynamically set severity
    sx={{ width: "100%" }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>


    </div>
  );
};

export default Login;
