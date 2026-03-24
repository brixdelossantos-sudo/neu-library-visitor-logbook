import { useState, useEffect } from "react";
import axios from "axios";
import UserPage from "./pages/UserPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check for OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");
    const errorParam = params.get("error");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(user));
        setUser(user);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Login failed. Please try again.");
      }
    }

    if (errorParam) {
      setError("Google login failed. Please try again.");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if token is already stored from previous session
    const storedToken = localStorage.getItem("token");
    if (storedToken && !user) {
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error("Error retrieving stored user data:", err);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
        name: formData.name
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setFormData({ email: "", password: "", name: "" });
    setIsRegistering(false);
  };

  return (
    <div className="app-container">
      {!user ? (
        <div className="login-container">
          <h1>📚 NEU Library</h1>
          <p>Visitor Log System</p>
          {error && <div className="error-message">{error}</div>}

          <div className="auth-tabs">
            <button
              type="button"
              className={`tab-button ${!isRegistering ? 'active' : ''}`}
              onClick={() => setIsRegistering(false)}
            >
              Login
            </button>
            <button
              type="button"
              className={`tab-button ${isRegistering ? 'active' : ''}`}
              onClick={() => setIsRegistering(true)}
            >
              Register
            </button>
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Processing..." : (isRegistering ? "Create Account" : "Login")}
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            type="button"
            className="google-button"
            disabled={loading}
            onClick={() => {
              window.location.href = `${API_URL}/auth/google`;
            }}
          >
            <span>🔵</span> Continue with Google
          </button>
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