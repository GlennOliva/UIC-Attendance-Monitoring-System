import { useEffect, useState } from "react";
import "../../css/style.css";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import CreateStudent from "../../components/CreateStudent";
import UpdateStudent from "../../components/UpdateStudent";
import DeleteStudent from "../../components/DeleteStudent";
import axios from "axios";

interface Student {
  id: number;
  teacher_id: number;
  student_number: number;
  full_name: string;
  email: string;
  image?: string;
  course: string;
  department: string;
  status?: string;
  password: string;
}

const ManageStudent = () => {
  const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false);
  const [isUpdateStudentOpen, setIsUpdateStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const studentsPerPage = 5;
  const apiUrl = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    axios
      .get<Student[]>(`${apiUrl}student`)
      .then((res) => setStudentData(res.data))
      .catch((err) => console.error("Error fetching student data:", err));
  }, [apiUrl]);

  const totalPages = Math.ceil(studentData.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = studentData.slice(indexOfFirstStudent, indexOfLastStudent);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Student</h1>

          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Student</a></li>
          </ul>

          <div className="info-data">
            <div className="table-container">
              <button className="create-btn" onClick={() => setIsCreateStudentOpen(true)}>
                Create Student
              </button>

              <table className="student-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Teacher ID</th>
                    <th>Student Number</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Image</th>
                    <th>Course</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.teacher_id}</td>
                      <td>{student.student_number}</td>
                      <td>{student.full_name}</td>
                      <td>{student.email}</td>
                      <td>
                          <img src={`${apiUrl}uploads/${student.image}`} alt="Teacher" width="70" height="50" />
                        </td>
                      <td>{student.course}</td>
                      <td>{student.department}</td>
                      <td style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsUpdateStudentOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <DeleteStudent id={student.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Modals */}
      {isCreateStudentOpen && <CreateStudent onClose={() => setIsCreateStudentOpen(false)} />}
      {isUpdateStudentOpen && selectedStudent && (
        <UpdateStudent student={selectedStudent} onClose={() => setIsUpdateStudentOpen(false)} />
      )}
    </div>
  );
};

export default ManageStudent;
