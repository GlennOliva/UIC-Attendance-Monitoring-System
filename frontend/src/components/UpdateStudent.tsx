import axios from "axios";
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface UpdateStudentProps {
  student: Student;
  onClose: () => void;
}

interface Student {
  id: number;
  teacher_id: number;
  student_number: number;
  full_name: string;
  email: string;
  course: string;
  department: string;
  status?: string;
  image?: string;
  password: string;
}

interface Teacher {
  id: number;
  full_name: string;
}

const UpdateStudent: React.FC<UpdateStudentProps> = ({ student, onClose }) => {
  const apiUrl = import.meta.env.VITE_API_URL as string;

  // State for form fields
  const [studentNumber, setStudentNumber] = useState<string>(student.student_number.toString());
  const [fullName, setFullName] = useState<string>(student.full_name);
  const [email, setEmail] = useState<string>(student.email);
  const [course, setCourse] = useState<string>(student.course);
  const [department, setDepartment] = useState<string>(student.department);
  const [status, setStatus] = useState<string>(student.status || "");
  const [password, setPassword] = useState<string>("");

  // State for teachers dropdown
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>(student.teacher_id.toString());

  // State for image upload
  const [image, setImage] = useState<File | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    axios
      .get<Teacher[]>(`${apiUrl}teacher`)
      .then((res) => setTeachers(res.data))
      .catch(() =>
        setSnackbar({ open: true, message: "Error fetching teachers", severity: "error" })
      );
  }, [apiUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("teacher_id", selectedTeacher);
    formData.append("student_number", studentNumber);
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("course", course);
    formData.append("department", department);
    formData.append("status", status);
    if (password) {
      formData.append("password", password);
    }
    if (image) formData.append("image", image);
  
    try {
      await axios.put(`${apiUrl}update_student/${student.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSnackbar({ open: true, message: "Student updated successfully!", severity: "success" });
  
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh the page after closing the modal
      }, 3000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbar({ open: true, message: "Error updating student", severity: "error" });
    }
  };
  

  return (
    <div className="modal-overlay" style={{marginTop:'50px'}}>
      <div className="modal-container">
        <h2 className="modal-title">Edit Student</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-group">
              <label>Select Teacher</label>
              <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} required>
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
              <input type="text" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Course</label>
              <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password (leave blank to keep current)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%", marginTop:'50px', }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UpdateStudent;
