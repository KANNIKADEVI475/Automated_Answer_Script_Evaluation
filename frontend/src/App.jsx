import { useState } from "react";
import "./App.css";

function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {

    if (username === "" || password === "") {
      alert("Please enter username and password");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Login Successful");
      console.log("Logged In");

      // Example:
      // navigate("/home");

    } else {
      alert("Invalid Username or Password");
    }
  }

  return (
    <div className="container">

      <div className="login-box">

        <h1>Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>
          Login
        </button>

      </div>

    </div>
  );
}

export default App;