import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/style.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const [teacherCount, setTeacherCount] = useState<number | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || "";  // Ensure this URL is correct

  // Fetch teacher count
  useEffect(() => {
    axios.get(`${apiUrl}teacher_count`)
      .then((response) => {
        setTeacherCount(response.data.teacher_count);
      })
      .catch((error) => {
        console.error("Error fetching teacher count:", error);
      });
  }, [apiUrl]);

  // Fetch student count
  useEffect(() => {
    axios.get(`${apiUrl}student_count`)
      .then((response) => {
        setStudentCount(response.data.student_count);
      })
      .catch((error) => {
        console.error("Error fetching student count:", error);
      });
  }, [apiUrl]);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Dashboard</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Dashboard</a></li>
          </ul>
          <div className="info-data">
            {/* Teachers Card */}
            <div className="card">
              <div className="head">
                <div>
                  <h2>{teacherCount !== null ? teacherCount.toLocaleString() : 'Loading...'}</h2>
                  <p>Teachers</p>
                </div>
                <i className='bx bx-group icon'></i>
              </div>
            </div>

            {/* Students Card */}
            <div className="card">
              <div className="head">
                <div>
                  <h2>{studentCount !== null ? studentCount.toLocaleString() : 'Loading...'}</h2>
                  <p>Students</p>
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
