import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../css/create_student.css";

interface CreateTeacherProps {
  onClose: () => void;
}

const CreateTeacher: React.FC<CreateTeacherProps> = ({ onClose }) => {

  const adminId = localStorage.getItem("admin_id") || "";
  // State for form fields
  const [formData, setFormData] = useState({
    admin_id: adminId,
    full_name: "",
    email: "",
    password: "",
    department: "",
    image: null as File | null,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // API Base URL
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("admin_id", adminId);
    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("department", formData.department);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
  
    try {
      const response = await axios.post(`${apiUrl}add_teacher`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Admin-ID": adminId,
        },
      });
  
      console.log("API Response:", response.data);
  
      setSnackbar({ open: true, message: response.data, severity: "success" });
  
      // Delay modal closing to allow Snackbar to be displayed
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : "Something went wrong!";
  
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };
  
  
  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Create Teacher</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Image</label>
              <input type="file" name="image" onChange={handleFileChange} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
   {/* ✅ Snackbar should be placed here inside the return */}
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
  );
};

export default CreateTeacher;
