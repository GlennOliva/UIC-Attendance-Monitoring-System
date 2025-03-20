import '../../css/style.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import CreateTeacher from '../../components/CreateTeacher';
import UpdateTeacher from '../../components/UpdateTeacher';
import axios from 'axios';
import DeleteTeacher from '../../components/DeleteTeacher';

// Define the Teacher interface
interface Teacher {
  id: number;
  full_name: string;
  email: string;
  image: string;
  department: string;
}

const ManageTeacher: React.FC = () => {
  const [isCreateTeacherOpen, setIsCreateTeacherOpen] = useState<boolean>(false);
  const [isUpdateTeacherOpen, setIsUpdateTeacherOpen] = useState<boolean>(false);
  const [teacherData, setTeacherData] = useState<Teacher[]>([]); // Store fetched data
  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);


  const teachersPerPage = 5; // Number of teachers per page
  const apiUrl = import.meta.env.VITE_API_URL as string; // Type assertion

  useEffect(() => {
    // Fetch teacher data from API
    axios.get<Teacher[]>(`${apiUrl}teacher`)
      .then(res => {
        setTeacherData(res.data); // Store response data
      })
      .catch(err => console.error("Error fetching teacher data:", err));
  }, [apiUrl]);

  // Calculate total pages
  const totalPages = Math.ceil(teacherData.length / teachersPerPage);

  // Get current page's data
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = teacherData.slice(indexOfFirstTeacher, indexOfLastTeacher);

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Teacher</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Teacher</a></li>
          </ul>

          <div className="info-data">
            {/* Table Container */}
            <div className="table-container">
              <button className="create-btn" onClick={() => setIsCreateTeacherOpen(true)}>Create Teacher</button>
              
              <table className="student-table">
                {/* Table Head */}
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Image</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                {/* Table Body - Fetching Data with Pagination */}
                <tbody>
                  {currentTeachers.length > 0 ? (
                    currentTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>{teacher.id}</td>
                        <td>{teacher.full_name}</td>
                        <td>{teacher.email}</td>
                        <td>
                          <img src={`${apiUrl}uploads/${teacher.image}`} alt="Teacher" width="70" height="50" />
                        </td>
                        <td>{teacher.department}</td>
                        <td style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
  <button
    className="edit-btn"
    onClick={() => {
      setSelectedTeacher(teacher); // Set the selected teacher
      setIsUpdateTeacherOpen(true);
    }}
  >
    Edit
  </button>
  <DeleteTeacher id={teacher.id} />
</td>


                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No teachers found</td>
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
{isCreateTeacherOpen && <CreateTeacher onClose={() => setIsCreateTeacherOpen(false)} />}
{isUpdateTeacherOpen && selectedTeacher  && (
  <UpdateTeacher
    teacher={selectedTeacher}
    onClose={() => setIsUpdateTeacherOpen(false)}
  />
)}



    </div>
  );
};

export default ManageTeacher;
