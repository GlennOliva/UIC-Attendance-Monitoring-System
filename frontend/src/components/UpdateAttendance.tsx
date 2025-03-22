import React, { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../css/create_student.css";

interface UpdateStudentBarcodeProps {
  onClose: () => void;
  attendanceId: number;
}

const UpdateAttendance: React.FC<UpdateStudentBarcodeProps> = ({ onClose, attendanceId }) => {
  const [attendance, setAttendance] = useState({
    time_in: "",
    time_out: "",
    status: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    axios
      .get(`${apiUrl}fetch_attendance_by_id?attendance_id=${attendanceId}`)
      .then((response) => {
        setAttendance(response.data);
      })
      .catch((error) => console.error("Error fetching attendance:", error));
  }, [apiUrl, attendanceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAttendance({ ...attendance, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}update_attendance`, {
        id: attendanceId,
        time_in: attendance.time_in,
        time_out: attendance.time_out,
        status: attendance.status,
      })
      .then(() => {
        setSnackbar({ open: true, message: "Attendance updated successfully!", severity: "success" });
  
        // Wait for 3 seconds before reloading and closing the modal
        setTimeout(() => {
          window.location.reload(); // Reload the page
          onClose(); // Close the modal
        }, 3000);
      })
      .catch((error) => {
        console.error("Error updating attendance:", error);
        setSnackbar({ open: true, message: "Failed to update attendance.", severity: "error" });
      });
  };
  

  return (
    <div className="modal-overlay" style={{ marginTop: "50px" }}>
      <div className="modal-container">
        <h2 className="modal-title">Edit Attendance</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Time In:</label>
              <input type="time" name="time_in" value={attendance.time_in} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Time Out:</label>
              <input type="time" name="time_out" value={attendance.time_out} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select name="status" value={attendance.status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Excuse">Excuse</option>
                <option value="Late">Late</option>
              </select>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button" style={{ marginRight: "20px" }}>Update</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{marginTop:'50px'}}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UpdateAttendance;
