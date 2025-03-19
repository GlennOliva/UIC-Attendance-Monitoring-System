import '../../css/style.css'
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';


const ManageBarcode = () => {
 

  return (
    <div>
  
      <Sidebar />
      <section id="content" >
      <Navbar />
      <main >
        <h1 className="title">Manage Barcode</h1>
        <ul className="breadcrumbs">
          <li><a href="#">Home</a></li>
          <li className="divider">/</li>
          <li><a href="#" className="active">Manage Barcode</a></li>
        </ul>
        <div className="info-data">
            {/* Table Container */}
            
            
            <div className="table-container">
            <button className="create-btn">Create Student Barcode</button>
              <table className="student-table">
                {/* Table Head */}
         
                <thead>
         
                  <tr>
                    <th>ID</th>
                    <th>Admin ID</th>
                    <th>Student ID</th>
                    <th>Student Number</th>
                    <th>Barcode Image</th>
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

export default ManageBarcode;
