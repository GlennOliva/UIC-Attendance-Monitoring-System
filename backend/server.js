const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyparser = require("body-parser");
const util = require("util"); // 👈 Convert MySQL to support async/await

const app = express();
app.use(cors());
app.use(bodyparser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "attendance_monitoring",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to MySQL Database");
});



// Test Route
app.get("/", (req, res) => {
  return res.json("Starting the Node Server");
});

// Admin Route
app.get("/admin", async (req, res) => {
  try {
    const data = await query("SELECT * FROM tbl_admin");
    res.json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post('/admin/login', (request, response) => {
    const { email, password } = request.body;
    const sql = `SELECT id, password FROM tbl_admin WHERE email = ?`;

    db.query(sql, [email], (error, data) => {
        if (error) return response.status(500).json({ error: 'Database error' });
        if (data.length === 0) return response.status(401).json({ error: 'Invalid email or password' });

        const admin = data[0];

        if (password !== admin.password) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        return response.json({ message: 'Login successful', admin: { id: admin.id } });
    });
});


app.post('/teacher/login', (request, response) => {
    const { email, password } = request.body;
    const sql = `SELECT id, password FROM tbl_teacher WHERE email = ?`;

    db.query(sql, [email], (error, data) => {
        if (error) return response.status(500).json({ error: 'Database error' });
        if (data.length === 0) return response.status(401).json({ error: 'Invalid email or password' });

        const teacher = data[0];

        if (password !== teacher.password) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        return response.json({ message: 'Login successful', teacher: { id: teacher.id } });
    });
});


app.post('/student/login', (request, response) => {
    const { email, password } = request.body;
    const sql = `SELECT id, password FROM tbl_student WHERE email = ?`;

    db.query(sql, [email], (error, data) => {
        if (error) return response.status(500).json({ error: 'Database error' });
        if (data.length === 0) return response.status(401).json({ error: 'Invalid email or password' });

        const student = data[0];

        if (password !== student.password) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        return response.json({ message: 'Login successful', student: { id: student.id } });
    });
});


app.get('/admin/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    const sql = "SELECT * FROM tbl_admin WHERE id = ?";
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});


app.get('/teacher/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    const sql = "SELECT * FROM tbl_teacher WHERE id = ?";
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});


app.get('/student/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    const sql = "SELECT * FROM tbl_student WHERE id = ?";
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});
// Start Server
app.listen(8081, () => {
  console.log("Listening on port 8081...");
});
