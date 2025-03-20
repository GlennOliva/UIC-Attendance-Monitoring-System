import React, { useState, useEffect, useRef } from "react";
import "../css/style.css";
import admin_image from "../assets/images/administrator.png";
import { useNavigate } from "react-router-dom"; 

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // ✅ Use inside the function component

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Redirect to login page
  };

  const [userProfile, setAdminProfile] = useState<{ image: string; full_name: string } | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem('student_id'); // Retrieve the admin ID from local storage

    if (studentId) {
        // Fetch admin profile data using the updated endpoint
        fetch(`${apiUrl}student/${studentId}`) // Adjusted endpoint to fetch by ID
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => setAdminProfile(data[0] || null)) // Assuming the response is an array
            .catch(err => console.log(err));
    } else {
        console.log("Teacher ID not found in local storage");
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = (e: MouseEvent) => {
    if (
      profileRef.current &&
      dropdownRef.current &&
      !profileRef.current.contains(e.target as Node) &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <nav>
      <i className="bx bx-menu toggle-sidebar"></i>
        {/* Search Form */}
        <form action="#">
        {/* <div className="form-group">
          <input type="text" placeholder="Search..." />
          <i className="bx bx-search icon"></i>
        </div> */}
      </form>

      {/* <a href="#" className="nav-link">
        <i className="bx bxs-bell icon"></i>
        <span className="badge">5</span>
      </a>
      <a href="#" className="nav-link">
        <i className="bx bxs-message-square-dots icon"></i>
        <span className="badge">8</span>
      </a>
      <span className="divider"></span> */}




      {/* Profile Dropdown */}
      <div className="profile" ref={profileRef} onClick={toggleDropdown}>
        <img src={admin_image} alt="Profile" />
        <ul className={`profile-link ${isDropdownOpen ? "show" : ""}`} ref={dropdownRef}>
          <li>
            <p style={{ fontSize: "12px", margin: "4px", paddingLeft: "10px" }}>
              Hi, {userProfile?.full_name}
            </p>
          </li>
          <li>
            <a href="#">
              <i className="bx bxs-cog"></i> Settings
            </a>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <i className="bx bxs-log-out-circle"></i> Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
