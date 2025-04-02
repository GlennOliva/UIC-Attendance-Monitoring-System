import '../../css/style.css';
import Sidebar from '../../components/TeacherSidebar';
import Navbar from '../../components/TeacherNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateAttendance from '../../components/CreateAttendance';
import DeleteAttendance from '../../components/DeleteAttendance';
import UpdateAttendance from '../../components/UpdateAttendance';

interface Attendance {
    id: number;
    student_id: number;
    student_number: number;
    full_name: string;
    date: string;
    status: string;
    time_in: string;
    time_out: string;
  }
  

const ManageAttendance = () => {
  const [isCreateAttendanceOpen, setIsCreateAttendanceOpen] = useState(false);
  const [isUpdateAttendanceOpen, setIsUpdateAttendanceOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const [currentPage, setCurrentPage] = useState<number>(1);
  const studentsPerPage = 5;  // Set how many items per page you want
  const totalPages = Math.ceil(attendanceRecords.length / studentsPerPage);

  // Calculate indices for current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentAttendance = attendanceRecords.slice(indexOfFirstStudent, indexOfLastStudent);




  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const teacherId = localStorage.getItem("teacher_id");

  // Fetch Barcode Data
  useEffect(() => {
    axios.get(`${apiUrl}fetch_attendance?teacher_id=${teacherId}`)
      .then((response) => {
        setAttendanceRecords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance:", error);
      });
  }, [apiUrl, teacherId]);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Attendance</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Attendance</a></li>
          </ul>
          <div className="info-data">
            <div className="table-container">
              <button className="create-btn" onClick={() => setIsCreateAttendanceOpen(true)}>Mark Student Attendance</button>
              <table className="student-table">
                <thead>
                <tr>
      <th>ID</th>
      <th>Student ID</th>
      <th>Name</th>
      <th>Time In</th> {/* New column for Time In */}
      <th>Time Out</th> {/* New column for Time Out */}
      <th>Status</th>
      <th>Actions</th>
    </tr>
                </thead>
                <tbody>
                {currentAttendance.length > 0 ? (
  currentAttendance.map((record) => (
        <tr key={record.id}>
          <td>{record.id}</td>
          <td>{record.student_number}</td>
          <td>{record.full_name}</td>
          <td>{record.time_in}</td>
          <td>{record.time_out}</td>
          <td>{record.status}</td>
          <td style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setSelectedAttendance(record);
                              setIsUpdateAttendanceOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <DeleteAttendance id={record.id} />
                        </td>

        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8} style={{ textAlign: "center" }}>No Attendance Data Available</td>
      </tr>
    )}
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
      {isCreateAttendanceOpen && <CreateAttendance onClose={() => setIsCreateAttendanceOpen(false)} />}
      {isUpdateAttendanceOpen && selectedAttendance && (
        <UpdateAttendance
          onClose={() => setIsUpdateAttendanceOpen(false)}
          attendanceId={selectedAttendance.id}
        />
      )}
    </div>
  );
};

export default ManageAttendance;
