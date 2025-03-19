import { Routes, Route } from 'react-router-dom';
import Dashboard from './views/Admin/Dashboard';
import TeacherDashboard from './views/teacher/Dashboard';
import StudentDashboard from './views/student/Dashboard';
import './css/app.css';
import ManageStudent from './views/Admin/ManageStudent';
import ManageTeacher from './views/Admin/ManageTeacher';
import ManageBarcode from './views/Admin/ManageBarcode';
import Login from './views/Auth/Login';

const App = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path='/admin/manage_student' element={<ManageStudent/>}/>
      <Route path='/admin/manage_teacher' element={<ManageTeacher/>}/>
      <Route path='/admin/manage_barcode' element={<ManageBarcode/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  );
};

export default App;
