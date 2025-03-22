import { Routes, Route } from 'react-router-dom';
import Dashboard from './views/Admin/Dashboard';
import TeacherDashboard from './views/teacher/Dashboard';
import './css/app.css';
import ManageStudent from './views/Admin/ManageStudent';
import ManageTeacher from './views/Admin/ManageTeacher';
import ManageBarcode from './views/Admin/ManageBarcode';
import Login from './views/Auth/Login';
import ManageRecords from './views/teacher/ManageRecords';
import ManageAttendance from './views/teacher/ManageAttendance';
import ViewBarcode from './views/student/ViewBarcode';
import ViewAttendance from './views/student/ViewAttendance';

const App = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path='/admin/manage_student' element={<ManageStudent/>}/>
      <Route path='/admin/manage_teacher' element={<ManageTeacher/>}/>
      <Route path='/admin/manage_barcode' element={<ManageBarcode/>}/>
      <Route path='/teacher/manage_records' element={<ManageRecords/>}/>
      <Route path='/teacher/manage_attendance' element={<ManageAttendance/>}/>
      <Route path='/student/view_barcode' element={<ViewBarcode/>}/>
      <Route path='/student/view_attendance' element={<ViewAttendance/>}/>
      <Route path='/' element={<Login/>}/>
    </Routes>
  );
};

export default App;
