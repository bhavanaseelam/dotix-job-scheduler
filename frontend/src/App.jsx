import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [jobs, setJobs] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState("Low");
  const [loadingId, setLoadingId] = useState(null);

  const API = "http://localhost:5000";

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get(`${API}/jobs`);
    setJobs(res.data);
  };

  const createJob = async (e) => {
    e.preventDefault();

    await axios.post(`${API}/jobs`, {
      taskName,
      payload: { email },
      priority
    });

    setTaskName("");
    setEmail("");
    setPriority("Low");

    fetchJobs();
  };

  const runJob = async (id) => {
    setLoadingId(id);
    await axios.post(`${API}/run-job/${id}`);
    setLoadingId(null);
    fetchJobs();
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Job Scheduler Dashboard</h1>

      {/* CREATE JOB FORM */}
      <form onSubmit={createJob} style={{ marginBottom: 30 }}>
        <h3>Create Job</h3>

        <input
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="submit">Create Job</button>
      </form>

      {/* JOB LIST */}
      <h3>Jobs</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.taskName}</td>
              <td>{job.priority}</td>
              <td>{job.status}</td>
              <td>
                {job.status === "pending" ? (
                  <button onClick={() => runJob(job.id)}>
                    {loadingId === job.id ? "Running..." : "Run Job"}
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
