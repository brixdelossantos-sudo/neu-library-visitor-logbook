import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsByCollege, setLogsByCollege] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };

      // Fetch stats
      const statsRes = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers });
      setStats(statsRes.data);

      // Fetch all logs
      const logsRes = await axios.get(`${import.meta.env.VITE_API_URL}/admin/logs`, { headers });
      setLogs(logsRes.data);

      // Fetch logs by college
      const collegeRes = await axios.get(`${import.meta.env.VITE_API_URL}/admin/logs-by-college`, { headers });
      setLogsByCollege(collegeRes.data);

      // Fetch all users
      const usersRes = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, { headers });
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const collegeCodeMap = {
    "CCS": "College of Computer Studies",
    "CED": "College of Education",
    "ENG": "College of Engineering",
    "CAS": "College of Arts and Sciences",
    "BUS": "College of Business",
    "LAW": "College of Law",
    "HEL": "College of Health, Education & Livelihood"
  };

  const handleBlockUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/block`,
        {},
        { headers: { Authorization: token } }
      );
      fetchDashboardData();
    } catch (err) {
      console.error("Error blocking user:", err);
      setError("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/unblock`,
        {},
        { headers: { Authorization: token } }
      );
      fetchDashboardData();
    } catch (err) {
      console.error("Error unblocking user:", err);
      setError("Failed to unblock user");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2>📊 Admin Dashboard</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="dashboard">
          <div className="stat-card">
            <h4>Total Visitors</h4>
            <div className="stat-number">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h4>Visitors Today</h4>
            <div className="stat-number">{stats.visitorsToday}</div>
          </div>
          <div className="stat-card">
            <h4>Visitors This Month</h4>
            <div className="stat-number">{stats.visitorsThisMonth}</div>
          </div>
        </div>
      )}

      {/* Tab Buttons */}
      <div style={{ marginBottom: "20px", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px" }}>
        <button
          className={`nav-button ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          College Distribution
        </button>
        <button
          className={`nav-button ${activeTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveTab("logs")}
        >
          All Visitor Logs
        </button>
        <button
          className={`nav-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Manage Users
        </button>
        <button
          className={`nav-button`}
          onClick={fetchDashboardData}
          style={{ marginLeft: "auto", background: "#28a745", color: "white" }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* College Distribution */}
      {activeTab === "stats" && (
        <div>
          <h3>📍 Visitors by College</h3>
          {logsByCollege.length > 0 ? (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>College</th>
                  <th>Number of Visits</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {logsByCollege.map(item => {
                  const percentage = ((item.count / stats.total) * 100).toFixed(1);
                  return (
                    <tr key={item._id}>
                      <td>{collegeCodeMap[item._id] || item._id}</td>
                      <td>{item.count}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            height: "8px",
                            background: "#667eea",
                            width: `${percentage * 3}px`,
                            borderRadius: "4px"
                          }}></div>
                          {percentage}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No data available</div>
          )}
        </div>
      )}

      {/* All Visitor Logs */}
      {activeTab === "logs" && (
        <div>
          <h3>📋 All Visitor Logs ({logs.length})</h3>
          {logs.length > 0 ? (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Date & Time</th>
                  <th>Email</th>
                  <th>Reason</th>
                  <th>College</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td>{log.visitorName}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>{log.email}</td>
                    <td>{log.reason}</td>
                    <td>{log.college !== "N/A" ? (collegeCodeMap[log.college] || log.college) : "—"}</td>
                    <td>{log.employeeType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No visitor logs yet</div>
          )}
        </div>
      )}

      {/* User Management */}
      {activeTab === "users" && (
        <div>
          <h3>👥 User Management ({users.length})</h3>
          {users.length > 0 ? (
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles?.join(", ") || "user"}</td>
                    <td>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: user.blocked ? "#ff6b6b" : "#28a745",
                        color: "white"
                      }}>
                        {user.blocked ? "🚫 Blocked" : "✅ Active"}
                      </span>
                    </td>
                    <td>
                      {user.blocked ? (
                        <button
                          onClick={() => handleUnblockUser(user._id)}
                          style={{
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          style={{
                            background: "#ff6b6b",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}