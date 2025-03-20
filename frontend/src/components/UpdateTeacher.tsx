import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/create_student.css";
import { Snackbar, Alert } from "@mui/material";

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  department: string;
  status?: string;
}

interface UpdateTeacherProps {
  onClose: () => void;
  teacher: Teacher;
}

const UpdateTeacher: React.FC<UpdateTeacherProps> = ({ onClose, teacher }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  // State for form fields
  const [fullName, setFullName] = useState(teacher.full_name);
  const [email, setEmail] = useState(teacher.email);
  const [department, setDepartment] = useState(teacher.department);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(teacher.status);
  const [image, setImage] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  


  

  // Fetch teacher details
  useEffect(() => {
    axios.get(`${apiUrl}teacher/${teacher.id}`)
      .then((res) => {
        const teacherData = res.data;
        setFullName(teacherData.full_name);
        setEmail(teacherData.email);
        setDepartment(teacherData.department);
        setStatus(teacherData.status);
      })
      .catch((err) => console.error("Error fetching teacher details:", err));
  }, [teacher.id, apiUrl]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const admin_id = localStorage.getItem("admin_id");
  
    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("department", department);
    if (status !== undefined) {
      formData.append("status", status);
    }
    if (password) formData.append("password", password);
    if (image) formData.append("image", image);
  
    if (admin_id) {
      formData.append("admin_id", admin_id);
    } else {
      console.warn("Admin ID not found in localStorage.");
    }
  
    try {
      await axios.put(`${apiUrl}update_teacher/${teacher.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
// Show success Snackbar
setSnackbar({
  open: true,
  message: "Teacher updated successfully!",
  severity: "success",
});
  
      // Delay closing the modal until after 3 seconds
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error updating teacher:", error);
  
      // Show error Snackbar
      setSnackbar({
        open: true,
        message: "Failed to update teacher.",
        severity: "error",
      });
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Edit Teacher</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Image</label>
              <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input 
                type="text" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Leave blank to keep the same password"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Update
            </button>
          </div>
        </form>

        <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
  sx={{ marginTop: "50px" }} // Adjust the top margin
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity}
    sx={{ width: "100%" }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

      </div>
    </div>
  );
};

export default UpdateTeacher;
