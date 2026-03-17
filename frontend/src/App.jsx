import { useState } from "react";
import axios from "axios";
import UserPage from "./pages/UserPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    username: "",
    email: ""
  });

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const login = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.email) {
      setError("Please fill in both username and email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/auth/google-login", {
        email: loginForm.email,
        name: loginForm.username,
        username: loginForm.username
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      setError("Login failed. Make sure the backend is running on http://localhost:5000");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoginForm({ username: "", email: "" });
  };

  return (
    <div className="app-container">
      {!user ? (
        <div className="login-container">
          <h1>📚 NEU Library</h1>
          <p>Visitor Log System</p>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={loginForm.username}
                onChange={handleLoginInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@neu.edu.ph or @gmail.com"
                value={loginForm.email}
                onChange={handleLoginInputChange}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      ) : (
        <div className="main-container">
          <UserPage user={user} onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
}

export default App;