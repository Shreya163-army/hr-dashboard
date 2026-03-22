import React, { useState, useEffect } from "react";
import { employees, leaves as initialLeaves } from "../Data/data";

function HRDashboard() {

  const [employeeList, setEmployeeList] = useState(() => {
    const data = localStorage.getItem("employees");
    return data ? JSON.parse(data) : employees;
  });

  const [leaves, setLeaves] = useState(() => {
    const data = localStorage.getItem("leaves");
    return data ? JSON.parse(data) : initialLeaves;
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    department: "",
    birthday: "",
    address: "",
    salary: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-6);
  };

  // 🔥 ADD + EDIT
  const addEmployee = () => {
    if (!form.name || !form.department || !form.salary) {
      alert("Fill required fields");
      return;
    }

    if (editId) {
      const updated = employeeList.map((emp) =>
        emp.id === editId
          ? {
              ...emp,
              name: form.name,
              department: form.department,
              birthday: form.birthday,
              address: form.address,
              payslip: {
                ...emp.payslip,
                salary: Number(form.salary)
              }
            }
          : emp
      );

      setEmployeeList(updated);
      setEditId(null);

    } else {
      const username = form.name.toLowerCase().replace(/\s/g, "");
      const password = generatePassword();

      const newEmployee = {
        id: Date.now(),
        name: form.name,
        username,
        password,
        department: form.department,
        birthday: form.birthday,
        address: form.address,
        payslip: {
          salary: Number(form.salary),
          bonus: 0,
          deductions: 0
        }
      };

      setEmployeeList([...employeeList, newEmployee]);

      const users = JSON.parse(localStorage.getItem("users")) || [];

      localStorage.setItem(
        "users",
        JSON.stringify([...users, { username, password, role: "employee" }])
      );

      alert(`Username: ${username}\nPassword: ${password}`);
    }

    setForm({
      name: "",
      department: "",
      birthday: "",
      address: "",
      salary: ""
    });
  };

  // ❌ DELETE EMPLOYEE
  const deleteEmployee = (id) => {
    const confirmDelete = window.confirm("Delete this employee?");
    if (!confirmDelete) return;

    setEmployeeList(employeeList.filter((emp) => emp.id !== id));
  };

  // 🔔 APPROVE + NOTIFICATION
  const updateStatus = (id, status) => {
    const updated = leaves.map((leave) => {
      if (leave.id === id) {

        const notifications =
          JSON.parse(localStorage.getItem("notifications")) || [];

        notifications.push({
          user: leave.name,
          message: `Your leave (${leave.dates}) was ${status}`,
          time: new Date().toLocaleString()
        });

        localStorage.setItem("notifications", JSON.stringify(notifications));

        return { ...leave, status };
      }
      return leave;
    });

    setLeaves(updated);
  };

  const filteredEmployees = employeeList.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employeeList));
  }, [employeeList]);

  useEffect(() => {
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }, [leaves]);

  return (
    <div className="container">
      <h1>HR Dashboard</h1>

      {/* SEARCH */}
      <input
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* EMPLOYEES */}
      <div className="card">
        <h2>Employees</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Birthday</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.birthday || "-"}</td>
                <td>
                  <button onClick={() => setSelectedEmployee(emp)}>View</button>

                  <button
                    onClick={() => {
                      setForm({
                        name: emp.name,
                        department: emp.department,
                        birthday: emp.birthday,
                        address: emp.address,
                        salary: emp.payslip?.salary
                      });
                      setEditId(emp.id);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="reject"
                    onClick={() => deleteEmployee(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS */}
      {selectedEmployee && (
        <div className="card">
          <h2>👤 Employee Details</h2>

          <p>Name: {selectedEmployee.name}</p>
          <p>Username: {selectedEmployee.username}</p>
          <p>Password: {selectedEmployee.password}</p>
          <p>Department: {selectedEmployee.department}</p>
          <p>Address: {selectedEmployee.address}</p>

          <h3>💰 Payslip</h3>
          <p>
            Salary: ₹
            {selectedEmployee.payslip?.salary?.toLocaleString("en-IN")}
          </p>
        </div>
      )}

      {/* FORM */}
      <div className="card">
        <h2>{editId ? "✏️ Edit Employee" : "➕ Add Employee"}</h2>

        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input name="department" value={form.department} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Birth Date</label>
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input type="number" name="salary" value={form.salary} onChange={handleChange} />
        </div>

        <button onClick={addEmployee}>
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </div>

      {/* LEAVES */}
      <div className="card">
        <h2>Leave Requests</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.name}</td>
                <td>{leave.dates}</td>
                <td>{leave.status}</td>
                <td>{leave.reason}</td>
                <td>
                  <button onClick={() => updateStatus(leave.id, "Approved")}>
                    Approve
                  </button>
                  <button onClick={() => updateStatus(leave.id, "Rejected")}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HRDashboard;