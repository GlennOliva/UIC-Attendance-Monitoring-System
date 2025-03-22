import React, { useState } from 'react';
import "../css/create_student.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface UpdateTeacherProfileProps {
  initialFullName: string;
  initialEmail: string;
  initialPassword: string;
  teacherId: string;
  initialDepartment: string;
  initialImage: string;
  onClose: () => void;
}

const UpdateTeacherProfile: React.FC<UpdateTeacherProfileProps> = ({
  initialFullName,
  initialEmail,
  initialPassword,
  teacherId,
  initialDepartment,
  onClose
}) => {
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [department, setDepartment] = useState(initialDepartment);
  const [image, setImage] = useState<File | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("department", department);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${apiUrl}teacher/update/${teacherId}`, {
        method: 'PUT',
        body: formData, // Send FormData
      });

      const data = await response.json();
      console.log('Profile updated:', data);

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success"
      });

      setTimeout(() => {
        onClose(); // Close modal
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error updating profile. Please try again.",
        severity: "error"
      });
    }
  };

  return (
    <div className="modal-overlay" style={{ marginTop: '50px' }}>
      <div className="modal-container">
        <h2 className="modal-title">Update Teacher Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Profile Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
      
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
            <button type="submit" className="submit-button">Update Profile</button>
          </div>
        </form>
      </div>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "50px" }}
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

export default UpdateTeacherProfile;
