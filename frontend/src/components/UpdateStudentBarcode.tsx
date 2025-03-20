import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode"; // Import JsBarcode
import "../css/create_student.css";

interface UpdateStudentBarcodeProps {
  onClose: () => void;
  studentId: number;
}

const UpdateStudentBarcode: React.FC<UpdateStudentBarcodeProps> = ({ onClose, studentId }) => {
  const [students, setStudents] = useState<{ id: string; full_name: string; student_number: string }[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [barcodeImage, setBarcodeImage] = useState<File | null>(null);
  const barcodeRef = useRef<HTMLCanvasElement | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "";

  // Fetch students for the dropdown
  useEffect(() => {
    axios.get(`${apiUrl}student`)
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  }, [apiUrl]);

  // Handle student selection
  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
    
    const selected = students.find(student => student.id.toString() === studentId);
    if (selected) {
      setStudentNumber(selected.student_number);
      generateBarcode(selected.student_number);
    } else {
      setStudentNumber("");
      setBarcodeImage(null);
    }
  };

  // Generate barcode
  const generateBarcode = (number: string) => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, number, {
        format: "CODE128",
        displayValue: true,
        width: 2,
        height: 50,
      });

      // Convert canvas to file after barcode is generated
      setTimeout(() => {
        const canvas = barcodeRef.current;
        if (canvas) {
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `${number}.png`, { type: "image/png" });
              setBarcodeImage(file);
            }
          }, "image/png");
        }
      }, 100);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    const adminId = localStorage.getItem('admin_id') || '';
    const formData = new FormData();
    formData.append("admin_id", adminId)
    formData.append("student_id", selectedStudent);
    formData.append("student_number", studentNumber);
    if (barcodeImage) {
      formData.append("barcode_image", barcodeImage);
    }

    // Pass the studentId or barcodeId here instead of barcode.id
    try {
      await axios.put(`${apiUrl}update_barcode/${studentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Barcode updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating barcode:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Update Student Barcode</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Student</label>
              <select value={selectedStudent} onChange={handleStudentChange} required>
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
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
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Update Barcode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentBarcode;
