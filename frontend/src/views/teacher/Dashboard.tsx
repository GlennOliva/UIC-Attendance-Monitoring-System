
import '../../css/style.css'
import Sidebar from '../../components/TeacherSidebar';
import Navbar from '../../components/TeacherNavbar';
import { useEffect, useState } from 'react';
import axios from 'axios';


const Dashboard = () => {

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const [attendanceData, setAttendanceData] = useState({
    total_students: 0,
    late_students: 0,
    absent_students: 0,
    excuse_students: 0,
    present_students: 0
  });

  const teacherId = localStorage.getItem('teacher_id') || ''; 

  useEffect(() => {
    axios.get(`${apiUrl}dashboard_attendance?teacher_id=${teacherId}`)
      .then(response => {
        setAttendanceData(response.data);
      })
      .catch(error => {
        console.error("Error fetching attendance:", error);
      });
  }, [apiUrl, teacherId]);
  return (
    <div>
  
      <Sidebar />
      <section id="content" >
      <Navbar />
      <main >
        <h1 className="title">Dashboard</h1>
        <ul className="breadcrumbs">
          <li><a href="#">Home</a></li>
          <li className="divider">/</li>
          <li><a href="#" className="active">Dashboard</a></li>
        </ul>
        <div className="info-data">
            <div className="card">
              <div className="head">
                <div>
                  <h2>{attendanceData.total_students}</h2>
                  <p>Records of Student</p>
                </div>
                <i className='bx bx-group icon'></i>
              </div>
            </div>

            <div className="card">
              <div className="head">
                <div>
                  <h2>{attendanceData.late_students}</h2>
                  <p>No. of Late Students</p>
                </div>
                <i className='bx bx-group icon'></i>
              </div>
            </div>

            <div className="card">
              <div className="head">
                <div>
                  <h2>{attendanceData.absent_students}</h2>
                  <p>No. of Absent Students</p>
                </div>
                <i className='bx bx-group icon'></i>
              </div>
            </div>

            <div className="card">
              <div className="head">
                <div>
                  <h2>{attendanceData.excuse_students}</h2>
                  <p>No. of Excused Students</p>
                </div>
                <i className='bx bx-group icon'></i>
              </div>
            </div>

            <div className="card">
              <div className="head">
                <div>
                  <h2>{attendanceData.present_students}</h2>
                  <p>No. of Present Students</p>
                </div>
                <i className='bx bx-group icon'></i>
              </div>
            </div>

          </div>
    
      </main>
      </section>
    </div>
  );
};

export default Dashboard;
