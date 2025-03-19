
import '../../css/style.css'
import Sidebar from '../../components/TeacherSidebar';
import Navbar from '../../components/TeacherNavbar';


const Dashboard = () => {


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
      <h2>514,099</h2>
      <p>Teachers</p>
    </div>
    <i className='bx bx-group icon'></i>
  </div>
  
</div>

<div className="card">
  <div className="head">
    <div>
      <h2>27,560,000</h2>
      <p>Students</p>
    </div>
    <i className='bx bx-group icon'></i>
  </div>

</div>

        </div>
        {/* <div className="data">
          <div className="content-data">
            <h3>Sales Report</h3>
            <div className="chart">
              <div id="chart"></div>
            </div>
          </div>
        </div> */}
      </main>
      </section>
    </div>
  );
};

export default Dashboard;
