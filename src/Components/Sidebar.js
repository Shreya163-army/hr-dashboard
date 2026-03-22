import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaClipboardList, FaUser, FaSignOutAlt } from "react-icons/fa";

function Sidebar({ role, setUser }) {
  return (
    <div className="sidebar">
      <h2>⚡ Dashboard</h2>

      {role === "hr" ? (
        <>
          <Link to="/hr"><FaUsers /> Employees</Link>
          <Link to="/hr/leaves"><FaClipboardList /> Leaves</Link>
        </>
      ) : (
        <>
          <Link to="/employee"><FaUser /> Profile</Link>
          <Link to="/employee/leaves"><FaClipboardList /> My Leaves</Link>
        </>
      )}

      <button
        className="logout"
        onClick={() => {
          localStorage.removeItem("user");
          window.location.reload();
        }}
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;