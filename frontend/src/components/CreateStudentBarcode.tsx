import React, { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../css/create_student.css";

interface CreateStudentBarcodeProps {
  onClose: () => void;
}

const CreateStudentBarcode: React.FC<CreateStudentBarcodeProps> = ({ onClose }) => {
  const [students, setStudents] = useState<{ id: string; full_name: string; student_number: string }[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "";
  const barcodeRef = useRef<HTMLCanvasElement | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info"; }>(
    { open: false, message: "", severity: "info" }
  );

  useEffect(() => {
    axios.get(`${apiUrl}student`)
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  }, [apiUrl]);

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
    const selected = students.find(student => student.id.toString() === studentId);
    if (selected) {
      setStudentNumber(selected.student_number);
      generateBarcode(selected.student_number);
    } else {
      setStudentNumber("");
      setBarcodeFile(null);
    }
  };

  const generateBarcode = (number: string) => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, number, {
        format: "CODE128",
        displayValue: true,
        width: 2,
        height: 50,
      });

      setTimeout(() => {
        const canvas = barcodeRef.current;
        if (canvas) {
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `${number}.png`, { type: "image/png" });
              setBarcodeFile(file);
            }
          }, "image/png");
        }
      }, 100);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const adminId = localStorage.getItem("admin_id") || "";
  
    if (!selectedStudent || !studentNumber || !barcodeFile) {
      setSnackbar({ open: true, message: "Please select a student and generate a barcode.", severity: "warning" });
      return;
    }
  
    const formData = new FormData();
    formData.append("admin_id", adminId);
    formData.append("student_id", selectedStudent);
    formData.append("student_number", studentNumber);
    formData.append("barcode_image", barcodeFile);
  
    try {
      await axios.post(`${apiUrl}barcode`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSnackbar({ open: true, message: "Barcode successfully created!", severity: "success" });
  
      // Delay closing the modal to let the snackbar show first
      setTimeout(() => {
        onClose();
      }, 2000); // Adjust the delay time if needed
    } catch (error) {
      console.error("Error saving barcode:", error);
      setSnackbar({ open: true, message: "Failed to save barcode. Please try again.", severity: "error" });
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Create Student Barcode</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Student</label>
              <select value={selectedStudent} onChange={handleStudentChange}>
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>{student.full_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Student Number</label>
              <input type="text" value={studentNumber} readOnly />
            </div>

            <div className="form-group">
              <label>Generated Barcode</label>
              <canvas ref={barcodeRef}></canvas>
            </div>
          </div>

          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>
      </div>
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

export default CreateStudentBarcode;