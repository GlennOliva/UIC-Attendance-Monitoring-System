import React, { useState } from 'react';
import "../css/create_student.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface UpdateAdminProfileProps {
  initialFullName: string;
  initialEmail: string;
  initialPassword: string;
  adminId: string;
  onClose: () => void;
}

const UpdateAdminProfile: React.FC<UpdateAdminProfileProps> = ({
  initialFullName,
  initialEmail,
  initialPassword,
  adminId,
  onClose
}) => {
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

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

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create the data object to send in the PUT request
    const updatedData = {
      full_name: fullName,
      email: email,
      password: password
    };

    // Send the PUT request to update the profile
    fetch(`${apiUrl}admin/update/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Profile updated:', data);

        // Show snackbar before closing the modal
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success"
        });

        // Close the modal and reload the page after the snackbar is displayed
        setTimeout(() => {
          onClose(); // Close modal
          window.location.reload(); // Reload the page
        }, 3000); // Wait for 3 seconds before closing modal and reloading
      })
      .catch(err => {
        console.log(err);
        setSnackbar({
          open: true,
          message: "Error updating profile. Please try again.",
          severity: "error"
        });
      });
  };

  return (
    <div className="modal-overlay" style={{ marginTop: '50px' }}>
      <div className="modal-container">
        <h2 className="modal-title">Update Admin Profile</h2>
        <form onSubmit={handleSubmit}>
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

export default UpdateAdminProfile;
