import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import HRDashboard from "./Pages/HRDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import Sidebar from "./Components/Sidebar";

function App() {
  const [user, setUser] = useState(null);

  // 🔥 Keep user logged in after refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <BrowserRouter>
      <Sidebar role={user.role} setUser={setUser} />

      <div className="main fade">        
        <Routes>
        {user.role === "hr" ? (
          <>
            <Route path="/" element={<HRDashboard />} />
            <Route path="/hr" element={<HRDashboard />} />
          </>
        ) : (
          <>
            <Route path="/" element={<EmployeeDashboard />} />
            <Route path="/employee" element={<EmployeeDashboard />} />
          </>
        )}
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;