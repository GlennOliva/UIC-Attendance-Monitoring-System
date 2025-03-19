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
  }` }>ADMIN PANEL</h1>
</div>


<ul className="side-menu">
      <li>
        <Link 
          to="/admin/dashboard" 
          className={location.pathname === "/admin/dashboard" ? "active" : ""}
        >
          <i className="bx bxs-dashboard icon"></i> Dashboard
        </Link>
      </li>

      <li className="divider" data-text="MANAGE ACCOUNTS">Manage Accounts</li>

      <li>
        <Link 
          to="/admin/manage_student" 
          className={location.pathname === "/admin/manage_student" ? "active" : ""}
        >
          <i className="bx bxs-group icon"></i> MANAGE STUDENTS
        </Link>
      </li>

      <li>
        <Link 
          to="/admin/manage_teacher" 
          className={location.pathname === "/admin/manage_teacher" ? "active" : ""}
        >
          <i className="bx bxs-group icon"></i> MANAGE TEACHERS
        </Link>
      </li>

      <li className="divider" data-text="BARCODE GENERATOR">Manage Accounts</li>

      <li>
        <Link 
          to="/admin/manage_barcode" 
          className={location.pathname === "/admin/manage_barcode" ? "active" : ""}
        >
          <i className="bx bxs-barcode icon"></i> MANAGE BARCODES
        </Link>
      </li>
    </ul>
    </section>
  );
};

export default Sidebar;
