import '../../css/style.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const ManageStudent = () => {
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
            {/* Table Container */}
            
            
            <div className="table-container">
            <button className="create-btn">Create Student</button>
              <table className="student-table">
                {/* Table Head */}
         
                <thead>
         
                  <tr>
                    <th>ID</th>
                    <th>Admin ID</th>
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

                {/* Table Body (Example Data) */}
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>A001</td>
                    <td>T002</td>
                    <td>20211001</td>
                    <td>Juan Dela Cruz</td>
                    <td>juan@example.com</td>
                    <td>BSIT</td>
                    <td>Computer Science</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </section>
    </div>
  );
};

export default ManageStudent;
