import Sidebar from '../../components/StudentSidebar';
import Navbar from '../../components/StudentNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Attendance {
  id: number;
  student_id: number;
  teacher_name: string; // Changed to display teacher's full name from tbl_teacher
  date: string;
  status: string;
  time_in: string;
  time_out: string;
}

const ViewAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const studentsPerPage = 5; // Set number of records per page
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const studentId = localStorage.getItem('student_id');

  // Fetch attendance data from API
  useEffect(() => {
    if (studentId) {
      axios
        .get(`${apiUrl}view_attendance?student_id=${studentId}`)
        .then((response) => {
          if (response.data) {
            setAttendanceRecords(response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching attendance:', error);
        });
    }
  }, [apiUrl, studentId]);

  // Pagination Calculation
  const totalPages = Math.ceil(attendanceRecords.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentAttendance = attendanceRecords.slice(indexOfFirstStudent, indexOfLastStudent);

  // Pagination Controls
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">View Attendance</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">View Attendance</a></li>
          </ul>

          <div className="info-data">
            <div className="table-container">
              <table className="student-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Teacher Name</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAttendance.length > 0 ? (
                    currentAttendance.map((record) => (
                      <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>{record.teacher_name}</td> {/* Now displays the teacher's full name */}
                        <td>{record.time_in}</td>
                        <td>{record.time_out}</td>
                        <td>{record.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>No Attendance Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="pagination" style={{ marginTop: '10px', textAlign: 'center' }}>
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default ViewAttendance;
