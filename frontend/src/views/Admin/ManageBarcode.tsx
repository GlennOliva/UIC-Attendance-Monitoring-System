import '../../css/style.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import CreateStudentBarcode from '../../components/CreateStudentBarcode';
import UpdateStudentBarcode from '../../components/UpdateStudentBarcode';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteBarcode from '../../components/DeleteBarcode';

interface Barcode {
  id: number;
  student_id: number;
  student_number: number;
  barcode_image: string;
}

const ManageBarcode = () => {
  const [isCreateStudentBarcodeOpen, setIsCreateStudentBarcodeOpen] = useState(false);
  const [isUpdateStudentBarcodeOpen, setIsUpdateStudentBarcodeOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Barcode | null>(null);
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const [currentPage, setCurrentPage] = useState<number>(1);
  const studentsPerPage = 5;  // Set how many items per page you want
  const totalPages = Math.ceil(barcodes.length / studentsPerPage);

  // Calculate indices for current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = barcodes.slice(indexOfFirstStudent, indexOfLastStudent);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  // Fetch Barcode Data
  useEffect(() => {
    axios.get(`${apiUrl}fetch_barcode`)
      .then((response) => setBarcodes(response.data))
      .catch((error) => console.error("Error fetching barcodes:", error));
  }, [apiUrl]);

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">Manage Barcode</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Manage Barcode</a></li>
          </ul>
          <div className="info-data">
            <div className="table-container">
              <button className="create-btn" onClick={() => setIsCreateStudentBarcodeOpen(true)}>Create Student Barcode</button>
              <table className="student-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student ID</th>
                    <th>Student Number</th>
                    <th>Barcode Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.length > 0 ? (
                    currentStudents.map((barcode) => (
                      <tr key={barcode.id}>
                        <td>{barcode.id}</td>
                        <td>{barcode.student_id}</td>
                        <td>{barcode.student_number}</td>
                        <td>
                          <img src={`${apiUrl}${barcode.barcode_image}`} alt="Barcode" style={{ width: "100px", height: "40px" }} />
                        </td>
                        <td style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setSelectedStudent(barcode);
                              setIsUpdateStudentBarcodeOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <DeleteBarcode id={barcode.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>No Barcode Data Available</td>
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
      {isCreateStudentBarcodeOpen && <CreateStudentBarcode onClose={() => setIsCreateStudentBarcodeOpen(false)} />}
      {isUpdateStudentBarcodeOpen && selectedStudent && (
        <UpdateStudentBarcode
          onClose={() => setIsUpdateStudentBarcodeOpen(false)}
          studentId={selectedStudent.id}
        />
      )}
    </div>
  );
};

export default ManageBarcode;
