import React, { useState, useEffect } from "react";
import axios from "axios";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../css/create_student.css";

interface CreateAttendanceProps {
  onClose: () => void;
}

interface Student {
  id: string;
  teacher_id: string;
  full_name: string;
  student_id: string;
}

const CreateAttendance: React.FC<CreateAttendanceProps> = ({ onClose }) => {
  const handleClose = () => {
    onClose(); // Ensure onClose is used
  };

  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string>("");
  const [timeIn, setTimeIn] = useState<string>("");
  const [timeOut, setTimeOut] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const teacherId = localStorage.getItem("teacher_id") || '';

  useEffect(() => {
    if (scannedBarcode) {
      axios
        .get(`${apiUrl}student_by_barcode?barcode=${scannedBarcode}`)
        .then((res) => {
          if (res.data) {
            setStudentData(res.data);
          } else {
            setSnackbar({ open: true, message: "Student not found!", severity: "error" });
          }
        })
        .catch((err) => {
          console.error("Error fetching student data:", err);
          setSnackbar({ open: true, message: "Error fetching student data.", severity: "error" });
        });
    }
  }, [scannedBarcode, apiUrl]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploading(true);
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = async () => {
          const codeReader = new BrowserMultiFormatReader();

          try {
            const result = await codeReader.decodeFromImageElement(img);
            setScannedBarcode(result.getText());
            setSnackbar({ open: true, message: "Barcode successfully scanned!", severity: "success" });
          } catch {
            setSnackbar({ open: true, message: "Failed to read barcode from image.", severity: "error" });
          }

          setUploading(false);
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!studentData || !attendanceStatus || !timeIn || !timeOut) {
      setSnackbar({ open: true, message: "Please fill in all required fields.", severity: "warning" });
      return;
    }

    const formData = {
      student_id: studentData.id,
      teacher_id: teacherId,
      status: attendanceStatus,
      time_in: timeIn,
      time_out: timeOut,
    };

    try {
      await axios.post(`${apiUrl}create_attendance`, formData);
      setSnackbar({ open: true, message: "Attendance successfully recorded!", severity: "success" });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setSnackbar({ open: true, message: "Failed to record attendance.", severity: "error" });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Create Student Attendance</h2>

        {!studentData ? (
             <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
             <button
               onClick={() => setScanning(true)}
               style={{
                 backgroundColor: "#007bff",
                 color: "white",
                 padding: "10px 15px",
                 fontSize: "16px",
                 border: "none",
                 borderRadius: "5px",
                 cursor: "pointer",
                 marginBottom: "10px",
                 transition: "0.3s"
               }}>
               📷 Scan Barcode
             </button>
             <label style={{
               backgroundColor: "#17a2b8",
               color: "white",
               padding: "10px 15px",
               borderRadius: "5px",
               cursor: "pointer",
               transition: "0.3s"
             }}>
               📤 Upload Image
               <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ display: "none" }} />
             </label>
           </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" name="student_id" value={studentData.id} readOnly />
              </div>
              <div className="form-group">
                <label>Attendance Status</label>
                <select
                  name="status"
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Excuse">Excuse</option>
                  <option value="Late">Late</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time Out</label>
                <input
                  type="time"
                  name="time_out"
                  value={timeOut}
                  onChange={(e) => setTimeOut(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="button-group">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button type="button" onClick={handleClose} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        )}

{scanning && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px"
          }}>
          <BarcodeScannerComponent
  width={350}
  height={350}
  onUpdate={(_err, result) => {
    if (result) {
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setScannedBarcode(result.getText());
      setTimeIn(currentTime); // Automatically set time-in
      setScanning(false);
      setSnackbar({ open: true, message: "Barcode scanned, time-in recorded!", severity: "success" });
    }
  }}
/>

            <button onClick={() => setScanning(false)} style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "8px 12px",
              fontSize: "14px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px"
            }}>
              ❌ Close Scanner
            </button>
          </div>
        )}
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "50px" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default CreateAttendance;
