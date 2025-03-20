import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/create_student.css";
import { Snackbar, Alert } from "@mui/material"; // Added missing imports

interface Teacher {
  id: number;
  full_name: string;
}

interface CreateStudentProps {
  onClose: () => void;
}

const CreateStudent: React.FC<CreateStudentProps> = ({ onClose }) => {
  const apiUrl = import.meta.env.VITE_API_URL || ""; // Ensure fallback
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const adminId = localStorage.getItem("admin_id") || ""; // Ensure adminId is never null

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

  useEffect(() => {
    axios
      .get(`${apiUrl}teacher`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Error fetching teachers:", err));
  }, [apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!selectedTeacher) {
      setSnackbar({
        open: true,
        message: "Please select a teacher",
        severity: "error",
      });
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("admin_id", adminId);
    formData.append("teacher_id", selectedTeacher);
    formData.append("student_number", studentNumber);
    formData.append("full_name", fullName);
    formData.append("email", email);
    if (image) formData.append("image", image);
    formData.append("course", course);
    formData.append("department", department);
    formData.append("password", password);
    formData.append("status", "Active"); // Added status field
  
    try {
      await axios.post(`${apiUrl}add_student`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSnackbar({
        open: true,
        message: "Student created successfully!",
        severity: "success",
      });
  
      // Delay closing the modal until after the Snackbar is shown
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 2000); // Delay for 2 seconds
  
    } catch (error) {
      console.error("Error creating student:", error);
      setSnackbar({
        open: true,
        message:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : "Failed to create student.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Create Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                required
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Student Number</label>
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required
              />
            </div>
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
              <input
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
            <div className="form-group">
              <label>Course</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
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
                required
              />
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Snackbar Notification */}
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

export default CreateStudent;
