import { useState, useEffect } from "react";
import axios from "axios";
import UserPage from "./pages/UserPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

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
        setUser(user);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Login failed. Please try again.");
      }
    }

    if (errorParam) {
      if (errorParam === "blocked") {
        setError("Your account has been blocked by an administrator");
      } else {
        setError("Google login failed. Please try again.");
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if token is already stored from previous session
    const storedToken = localStorage.getItem("token");
    if (storedToken && !user) {
      // You might want to add a verify endpoint to validate the token
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

  const login = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google-login`, {
        email: email,
        name: email.split("@")[0],
        username: email.split("@")[0]
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setEmail("");
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
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="example@neu.edu.ph or @gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login with Email"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button 
            type="button"
            className="google-button" 
            disabled={loading}
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
            }}
          >
            <span>🔵</span> Login with Google
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