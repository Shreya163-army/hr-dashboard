import React, { useState, useEffect } from "react";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Ensure HR exists
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("users"));

    if (!existing) {
      localStorage.setItem(
        "users",
        JSON.stringify([
          { username: "hr", password: "123", role: "hr" }
        ])
      );
    }
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to your dashboard</p>

        <div className="input-group">
          <input type="text" required onChange={(e) => setUsername(e.target.value)} />
          <label>Username</label>
        </div>

        <div className="input-group">
          <input type="password" required onChange={(e) => setPassword(e.target.value)} />
          <label>Password</label>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;