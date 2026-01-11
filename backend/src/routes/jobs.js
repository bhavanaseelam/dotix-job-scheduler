const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");

/**
 * CREATE JOB
 * POST /jobs
 */
router.post("/jobs", (req, res) => {
  const { taskName, payload, priority } = req.body;

  if (!taskName || !payload || !priority) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const payloadString = JSON.stringify(payload);

  const sql = `
    INSERT INTO jobs (taskName, payload, priority, status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.query(sql, [taskName, payloadString, priority], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Job created successfully",
      jobId: result.insertId
    });
  });
});

/**
 * GET ALL JOBS
 * GET /jobs
 */
router.get("/jobs", (req, res) => {
  const sql = "SELECT * FROM jobs ORDER BY createdAt DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

/**
 * GET SINGLE JOB BY ID
 * GET /jobs/:id
 */
router.get("/jobs/:id", (req, res) => {
  const jobId = req.params.id;

  const sql = "SELECT * FROM jobs WHERE id = ?";

  db.query(sql, [jobId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(results[0]);
  });
});

/**
 * RUN JOB
 * POST /run-job/:id
 */
router.post("/run-job/:id", async (req, res) => {
  const jobId = req.params.id;

  // Step 1: set status to running
  const updateRunningSql =
    "UPDATE jobs SET status = 'running' WHERE id = ?";

  db.query(updateRunningSql, [jobId], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Step 2: wait 3 seconds (simulate processing)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 3: set status to completed
    const updateCompletedSql =
      "UPDATE jobs SET status = 'completed' WHERE id = ?";

    db.query(updateCompletedSql, [jobId], (err2) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

      // 🔹 FETCH COMPLETED JOB DETAILS
      const getJobSql = "SELECT * FROM jobs WHERE id = ?";

      db.query(getJobSql, [jobId], async (err3, results) => {
        if (err3) {
          return res.status(500).json({ error: err3.message });
        }

        const job = results[0];

        // 🔹 SEND WEBHOOK
        try {
          await axios.post(process.env.WEBHOOK_URL, {
            jobId: job.id,
            taskName: job.taskName,
            priority: job.priority,
            payload:
              typeof job.payload === "string"
                ? JSON.parse(job.payload)
                : job.payload,
            completedAt: new Date()
          });
        } catch (webhookError) {
          console.error("Webhook failed:", webhookError.message);
        }

        // 🔹 FINAL RESPONSE
        res.json({
          message: "Job executed successfully and webhook triggered",
          jobId: job.id,
          status: "completed"
        });
      });
    });
  });
});

module.exports = router;
