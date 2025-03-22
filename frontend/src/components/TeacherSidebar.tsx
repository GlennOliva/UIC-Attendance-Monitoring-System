import React, { useEffect, useRef, useState } from "react";
import '../css/style.css';
import logo from '../assets/images/logo_main.png';
import {Link} from 'react-router';

const Sidebar: React.FC = () => {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const toggleSidebar = document.querySelector(".toggle-sidebar");

    if (!sidebar || !toggleSidebar) return;

    const handleSidebarToggle = () => {
      sidebar.classList.toggle("hide");
      setIsCollapsed((prev) => !prev); // Toggle state for logo resizing

      document.querySelectorAll<HTMLLIElement>("#sidebar .divider").forEach((item) => {
        item.textContent = sidebar.classList.contains("hide") ? "-" : item.dataset.text || "";
      });
    };

    toggleSidebar.addEventListener("click", handleSidebarToggle);
    
    return () => {
      toggleSidebar.removeEventListener("click", handleSidebarToggle);
    };
  }, []);

  return (
    <section id="sidebar" ref={sidebarRef} className="transition-all duration-300" >
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center py-4 transition-all duration-300">
  <img
    src={logo}
    alt="Admin Logo"
    className={`rounded-full object-cover transition-all duration-300 ${
      isCollapsed ? 'w-10 h-10' : 'w-45 h-45'
    }`}
  />
  <h1 className={`mt-5 text-center ${
    isCollapsed ? 'text-xs' : 'text-lg'
  }` }>TEACHER PANEL</h1>
</div>


<ul className="side-menu">
      <li>
        <Link 
          to="/teacher/dashboard" 
          className={location.pathname === "/teacher/dashboard" ? "active" : ""}
        >
          <i className="bx bxs-dashboard icon"></i> Dashboard
        </Link>
      </li>

      <li className="divider" data-text="STUDENT MANAGMENT">STUDENT MANAGEMENT</li>

      <li>
        <Link 
          to="/teacher/manage_records" 
          className={location.pathname === "/teacher/manage_records" ? "active" : ""}
        >
          <i className="bx bxs-file icon"></i> ASSIGNED STUDENTS
        </Link>
      </li>

      <li>
        <Link 
          to="/teacher/manage_attendance" 
          className={location.pathname === "/teacher/manage_attendance" ? "active" : ""}
        >
          <i className="bx bxs-calendar-check icon"></i> MANAGE ATTENDANCE
        </Link>
      </li>


      
    </ul>
    </section>
  );
};

export default Sidebar;
