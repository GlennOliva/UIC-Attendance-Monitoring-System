import '../../css/style.css';
import Sidebar from '../../components/StudentSidebar';
import Navbar from '../../components/StudentNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Barcode {
  id: number;
  student_id: number;
  student_number: number;
  barcode_image: string;
}

const ViewBarcode = () => {
  const [barcode, setBarcode] = useState<Barcode | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Get student ID from localStorage
  const student_id = localStorage.getItem('student_id');

  useEffect(() => {
    if (student_id) {
      axios
        .get(`${apiUrl}view_barcode?student_id=${student_id}`)
        .then((response) => {
          if (response.data && !response.data.error) {
            setBarcode(response.data);
          }
        })
        .catch((error) => console.error('Error fetching barcode:', error));
    }
  }, [apiUrl, student_id]);
  

  const handleDownload = async () => {
    if (barcode) {
      try {
        const response = await fetch(`${apiUrl}${barcode.barcode_image}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `barcode_${barcode.student_number}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Free memory
      } catch (error) {
        console.error('Error downloading barcode:', error);
      }
    }
  };
  

  return (
    <div>
      <Sidebar />
      <section id="content">
        <Navbar />
        <main>
          <h1 className="title">My Barcode</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">View Barcode</a></li>
          </ul>

          <div className="info-data">
          {barcode ? (
  <div 
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      margin: '20px auto',
    }}
  >
    <h3 style={{ color: '#333', marginBottom: '10px' }}>
      Student Number: {barcode.student_number}
    </h3>
    <img
      src={`${apiUrl}${barcode.barcode_image.replace(/\\/g, '/')}`}
      alt="Barcode"
      style={{
        width: '550px',
        height: '250px',
        marginBottom: '15px',
        border: '2px solid #EC7FA9',
        borderRadius: '5px',
      }}
    />
    <button
      onClick={handleDownload}
      style={{
        backgroundColor: '#FFB8E0',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: '0.3s',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EC7FA9'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#EC7FA9'}
    >
      Download Barcode
    </button>
  </div>
) : (
  <p style={{ color: '#dc3545', fontSize: '16px', textAlign: 'center' }}>
    No barcode available for your account.
  </p>
)}

          </div>
        </main>
      </section>
    </div>
  );
};

export default ViewBarcode;
