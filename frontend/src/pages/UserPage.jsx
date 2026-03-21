import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";

export default function UserPage({ user, onLogout }) {
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [myLogs, setMyLogs] = useState([]);
  const [formData, setFormData] = useState({
    reason: "Reading",
    collegeCode: "CCS",
    employeeType: "Student"
  });

  // College codes (typical Philippine universities)
  const colleges = [
    { code: "CCS", name: "College of Computer Studies" },
    { code: "CED", name: "College of Education" },
    { code: "ENG", name: "College of Engineering" },
    { code: "CAS", name: "College of Arts and Sciences" },
    { code: "BUS", name: "College of Business" },
    { code: "LAW", name: "College of Law" },
    { code: "HEL", name: "College of Health, Education & Livelihood" }
  ];

  const reasons = [
    "Reading",
    "Researching",
    "Using Computer",
    "Group Study",
    "Meeting",
    "Library Orientation",
    "Others"
  ];

  const employeeTypes = ["Student", "Faculty", "Staff", "Visitor"];

  // Fetch user's visit logs
  useEffect(() => {
    if (role === "user") {
      fetchMyLogs();
    }
  }, [role]);

  const fetchMyLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/logs/my-logs", {
        headers: { Authorization: token }
      });
      setMyLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/logs", formData, {
        headers: { Authorization: token }
      });

      setSuccess("✓ Visit logged successfully!");
      setFormData({
        reason: "Reading",
        collegeCode: "CCS",
        employeeType: "Student"
      });

      // Refresh logs
      setTimeout(() => {
        setSuccess("");
        fetchMyLogs();
      }, 2000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to log visit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>📚 NEU Library - Visitor Log System</h2>
        <div className="nav-buttons">
          {user.roles.includes("admin") && (
            <>
              <button
                className={`nav-button ${role === "user" ? "active" : ""}`}
                onClick={() => setRole("user")}
              >
                User
              </button>
              <button
                className={`nav-button ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                Admin Dashboard
              </button>
            </>
          )}
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Welcome message */}
      <div style={{ textAlign: "center", color: "white", marginBottom: "20px" }}>
        <p style={{ fontSize: "18px" }}>Welcome, {user.name}! ({user.roles.join(", ")})</p>
      </div>

      {/* Main Content */}
      <div className="content-container">
        {/* USER VIEW */}
        {role === "user" && (
          <div>
            <div className="form-section">
              <h3>📝 Log Your Visit</h3>

              {success && <div className="success-message">{success}</div>}
              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Category First */}
                <div className="form-group">
                  <label htmlFor="employeeType">Category * (Choose first)</label>
                  <select
                    id="employeeType"
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleInputChange}
                    required
                  >
                    {employeeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
                    {formData.employeeType === "Visitor" 
                      ? "Note: No department required for visitors" 
                      : "Note: Select your department below"}
                  </small>
                </div>

                {/* College/Department - Only show if not Visitor */}
                {formData.employeeType !== "Visitor" && (
                  <div className="form-group">
                    <label htmlFor="collegeCode">College/Department *</label>
                    <select
                      id="collegeCode"
                      name="collegeCode"
                      value={formData.collegeCode}
                      onChange={handleInputChange}
                      required
                    >
                      {colleges.map(college => (
                        <option key={college.code} value={college.code}>
                          {college.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Reason for Visit */}
                <div className="form-group">
                  <label htmlFor="reason">Reason for Visit *</label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  >
                    {reasons.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Visit Log"}
                </button>
              </form>
            </div>

            {/* Visit Logs */}
            <div style={{ marginTop: "40px" }}>
              <h3>📊 My Recent Visits</h3>
              {myLogs.length > 0 ? (
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>Visitor</th>
                      <th>Date & Time</th>
                      <th>Reason</th>
                      <th>College</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLogs.map(log => (
                      <tr key={log._id}>
                        <td>{log.visitorName}</td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                        <td>{log.reason}</td>
                        <td>{log.college !== "N/A" ? log.college : "—"}</td>
                        <td>{log.employeeType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">No visit logs yet</div>
              )}
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {role === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
}