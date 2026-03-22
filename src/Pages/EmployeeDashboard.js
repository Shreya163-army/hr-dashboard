import React, { useEffect, useState } from "react";

function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 Load employees (for payslip)
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const currentEmployee = employees.find(
    (emp) => emp.username === user.username
  );

  // 🔥 Load leaves
  useEffect(() => {
    const data = localStorage.getItem("leaves");
    if (data) setLeaves(JSON.parse(data));
  }, []);

  // 🔥 Save leaves (sync with HR)
  useEffect(() => {
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }, [leaves]);

  // 🔥 Load notifications
  useEffect(() => {
    const data = localStorage.getItem("notifications");
    if (data) setNotifications(JSON.parse(data));
  }, []);

  // 🔥 Filter current user data
  const myLeaves = leaves.filter((l) => l.name === user.username);
  const myNotifications = notifications.filter(
    (n) => n.user === user.username
  );

  // 🔥 Apply leave
  const applyLeave = () => {
    if (!start || !end || !reason) {
      alert("Fill all fields");
      return;
    }

    const newLeave = {
      id: Date.now(),
      name: user.username,
      dates: `${start} to ${end}`,
      reason,
      status: "Pending"
    };

    setLeaves([...leaves, newLeave]);

    setStart("");
    setEnd("");
    setReason("");
  };

  return (
    <div className="container">
      <h1>Employee Dashboard</h1>

      {/* 🔔 NOTIFICATIONS */}
      <div className="card">
        <h2>🔔 Notifications</h2>

        {myNotifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {myNotifications.map((n, i) => (
              <li key={i}>
                {n.message}
                <br />
                <small>{n.time}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 👤 PROFILE */}
      <div className="card">
        <h2>My Profile</h2>
        <p>Name: {user.username}</p>
        <p>Department: {currentEmployee?.department || "N/A"}</p>
        <p>Address: {currentEmployee?.address || "N/A"}</p>
      </div>

      {/* 📝 APPLY LEAVE */}
      <div className="card">
        <h2>Apply Leave</h2>

        <div className="form-group">
          <label htmlFor="start">Start Date</label>
          <input
            type="date"
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="end">End Date</label>
          <input
            type="date"
            id="end"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Leave</label>
          <input
            type="text"
            id="reason"
            placeholder="Reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button className="approve" onClick={applyLeave}>
          Apply
        </button>
      </div>

      {/* 📄 MY LEAVES */}
      <div className="card">
        <h2>My Leaves</h2>

        {myLeaves.length === 0 ? (
          <p>No leaves yet</p>
        ) : (
          <ul>
            {myLeaves.map((leave) => (
              <li key={leave.id}>
                {leave.dates} - {leave.status}
                <br />
                <small>Reason: {leave.reason}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 💰 PAYSLIP */}
      <div className="card">
        <h2>💰 Payslip</h2>

        {currentEmployee?.payslip ? (
          <>
            <p>Salary: ₹{currentEmployee.payslip.salary}</p>
            <p>Bonus: ₹{currentEmployee.payslip.bonus}</p>
            <p>Deductions: ₹{currentEmployee.payslip.deductions}</p>

            <hr />

            <p>
              <strong>
                Net Pay: ₹
                {currentEmployee.payslip.salary +
                  currentEmployee.payslip.bonus -
                  currentEmployee.payslip.deductions}
              </strong>
            </p>
          </>
        ) : (
          <p>No payslip available</p>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;