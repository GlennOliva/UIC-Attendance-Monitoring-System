const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyparser = require("body-parser");
const multer = require('multer');
const path = require('path');
const { error } = require("console");
const app = express();
app.use(cors());
app.use(bodyparser.json());
require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Uploads folder for storing images
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true // (Optional: Allows multiple queries in one statement)
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
      if (err) {
          console.error("❌ Database connection failed:", err.message);
          console.log("🔄 Retrying connection in 5 seconds...");
          setTimeout(handleDisconnect, 5000); // Retry after 5 seconds
      } else {
          console.log("✅ Connected to MySQL database.");
      }
  });

  db.on("error", (err) => {
      console.error("⚠️ Database error:", err);
      
      if (["PROTOCOL_CONNECTION_LOST", "ECONNRESET", "ETIMEDOUT"].includes(err.code)) {
          console.log("🔄 Reconnecting to MySQL...");
          handleDisconnect();
      } else {
          throw err; // Crash the app for unknown errors (important for debugging)
      }
  });
}

// Start MySQL connection
handleDisconnect();



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


// ✅ Create Teacher Route
app.post("/add_teacher", upload.single("image"), (request, response) => {
  console.log("Received Data:", request.body); // ✅ Debug received data

  const { admin_id, full_name, email, password, department } = request.body;
  const image = request.file ? request.file.filename : null; // Get the uploaded image file name

  if (!admin_id) {
    return response.status(400).json({ error: "Admin ID is required" }); // ✅ Handle missing admin_id
  }

  const sql = "INSERT INTO tbl_teacher (admin_id, full_name, email, image, password, department, status) VALUES (?, ?, ?, ?, ?, ?, 'Active')";
  
  db.query(sql, [admin_id, full_name, email, image, password, department], (error, result) => {
    if (error) {
      console.error("SQL Error:", error); // ✅ Log SQL errors
      return response.status(500).send("Error creating teacher");
    }
    response.send("Teacher Successfully Created!");
  });
});

app.get('/teacher', (request, response) => {
  try {
    const data ="SELECT * FROM tbl_teacher"; // Synchronous query execution
    db.query(data, (error,data) => {
      if(error) return response.json(error);
      return response.json(data);
    })
  } catch (error) {
    console.error("Database error:", error);
    response.status(500).json({ error: "Internal Server Error" }); // Correct `response`
  }
});


app.delete('/teacher/:id', (request, response) => {
  const id = request.params.id;
  console.log("Deleting teacher with ID: " + id);
  
  const sql = "DELETE FROM tbl_teacher WHERE id = ?";
  
  db.query(sql, [id], (error, result) => {
      if (error) {
          console.error("Error deleting teacher:", error);
          return response.status(500).json({ message: "Error deleting teacher" });
      }

      if (result.affectedRows === 0) {
          return response.status(404).json({ message: "Teacher not found" });
      }

      return response.json({ message: "Teacher deleted successfully!" });
  });
});


app.put("/update_teacher/:id", upload.single("image"), (request, response) => {
  console.log("Received Data:", request.body); // ✅ Debug received data

  const { full_name, email, password, department, status } = request.body;
  const image = request.file ? request.file.filename : null; // Get the uploaded image file name
  const teacherId = request.params.id; // Get teacher ID from URL parameter

  if (!teacherId) {
    return response.status(400).json({ error: "Teacher ID is required" }); // ✅ Handle missing teacher ID
  }

  // ✅ SQL Query without modifying `admin_id`
  let sql =
    "UPDATE tbl_teacher SET full_name = ?, email = ?, password = ?, department = ?, status = ?";
  let values = [full_name, email, password, department, status];

  if (image) {
    sql += ", image = ?";
    values.push(image);
  }

  sql += " WHERE id = ?"; // Ensure only `id` is used for updating
  values.push(teacherId);

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("SQL Error:", error); // ✅ Log SQL errors
      return response.status(500).json({ error: "Error updating teacher" });
    }
    response.json({ message: "Teacher Successfully Updated!" });
  });
});



//create student
app.post("/add_student", upload.single("image"), (request, response) => {
  console.log("Received Data:", request.body); // ✅ Debug received data

  const { admin_id, teacher_id, student_number, full_name, email, password, course, department, status } = request.body;
  const image = request.file ? request.file.filename : null; // Get the uploaded image file name

  if (!admin_id) {
    return response.status(400).json({ error: "Admin ID is required" }); // ✅ Handle missing admin_id
  }

  const sql = "INSERT INTO tbl_student (admin_id, teacher_id, student_number, full_name, email, password, image, course, department, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [admin_id, teacher_id, student_number, full_name, email, password, image, course, department, status || "Active"], (error, result) => {
    if (error) {
      console.error("SQL Error:", error); // ✅ Log SQL errors
      return response.status(500).json({ error: "Error creating student" });
    }
    response.json({ message: "Student Successfully Created!" });
  });
});

app.put("/update_student/:id", upload.single("image"), (request, response) => {
  console.log("Received Data:", request.body); // ✅ Debug received data

  const { teacher_id, student_number, full_name, email, password, course, department, status } = request.body;
  const image = request.file ? request.file.filename : null; // Get uploaded image filename
  const studentId = request.params.id; // Get student ID from URL parameter

  if (!studentId) {
    return response.status(400).json({ error: "Student ID is required" }); // ✅ Handle missing student ID
  }

  // ✅ SQL Query with all fields included
  let sql = `
    UPDATE tbl_student 
    SET teacher_id = ?, student_number = ?, full_name = ?, email = ?, password = ?, course = ?, department = ?, status = ?
  `;
  let values = [teacher_id, student_number, full_name, email, password, course, department, status];

  // ✅ If an image is uploaded, include it in the SQL query
  if (image) {
    sql += ", image = ?";
    values.push(image);
  }

  sql += " WHERE id = ?";
  values.push(studentId);

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("SQL Error:", error); // ✅ Log SQL errors
      return response.status(500).json({ error: "Error updating student" });
    }
    response.json({ message: "Student Successfully Updated!" });
  });
});




app.get('/student', (request, response) => {
  db.query("SELECT * FROM tbl_student", (error, data) => {
    if (error) {
      console.error("Database error:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
    return response.json(data);
  });
});


app.get('/student_assigned', (request, response) => {
  const { teacher_id } = request.query; // Get teacher_id from request query

  if (!teacher_id) {
    return response.status(400).json({ error: "Teacher ID is required" });
  }

  db.query("SELECT * FROM tbl_student WHERE teacher_id = ?", [teacher_id], (error, data) => {
    if (error) {
      console.error("Database error:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
    return response.json(data);
  });
});


app.get('/student_by_barcode', (req, res) => {
  const { barcode } = req.query;

  if (!barcode) return res.status(400).json({ error: "Barcode is required" });

  db.query("SELECT * FROM tbl_student WHERE student_number = ?", [barcode], (error, result) => {
    if (error) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(404).json({ error: "Student not found" });
    
    res.json(result[0]); // Return student details
  });
});

app.post("/create_attendance", (req, res) => {
  const { student_id, teacher_id, status, time_in, time_out } = req.body;

  if (!student_id || !teacher_id || !status || !time_in || !time_out) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    INSERT INTO tbl_attendance (student_id, teacher_id, status, time_in, time_out)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [student_id, teacher_id, status, time_in, time_out], (err, result) => {
    if (err) {
      console.error("Error inserting attendance:", err);
      return res.status(500).json({ message: "Error recording attendance" });
    }
    res.status(201).json({ message: "Attendance successfully recorded!", id: result.insertId });
  });
});


app.get('/fetch_attendance', (req, res) => {
  const { teacher_id } = req.query;

  if (!teacher_id) {
    return res.status(400).json({ error: "Teacher ID is required" });
  }

  const query = `
    SELECT 
      a.id, 
      a.student_id, 
      s.full_name, 
      a.status, 
      a.time_in, 
      a.time_out 
    FROM tbl_attendance a
    JOIN tbl_student s ON a.student_id = s.id
    WHERE a.teacher_id = ?
  `;

  db.query(query, [teacher_id], (error, result) => {
    if (error) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(404).json({ error: "No attendance records found" });

    res.json(result);
  });
});






// Route to upload barcode
app.post("/barcode", upload.single("barcode_image"), async (req, res) => {
  try {
    const { admin_id, student_id, student_number } = req.body;
    const barcode_image = req.file ? req.file.path : null;

    if (!admin_id || !student_id || !student_number || !barcode_image) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const sql = "INSERT INTO tbl_barcode (admin_id, student_id, student_number, barcode_image) VALUES (?, ?, ?, ?)";
    db.query(sql, [admin_id, student_id, student_number, barcode_image], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.status(200).json({ message: "Barcode saved successfully!" });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error." });
  }
});


app.put("/update_barcode/:id", upload.single("barcode_image"), async (req, res) => {
  try {
    const { id } = req.params; // Get barcode id from URL
    const { admin_id, student_id, student_number } = req.body;
    const barcode_image = req.file ? req.file.path : null;

    if (!admin_id || !student_id || !student_number || !barcode_image) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const sql = `
      UPDATE tbl_barcode 
      SET admin_id = ?, student_number = ?, barcode_image = ? , student_id = ?
      WHERE id = ?
    `;

    db.query(sql, [admin_id, student_number, barcode_image, student_id, id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Barcode not found or no changes made." });
      }

      res.status(200).json({ message: "Barcode updated successfully!" });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error." });
  }
});


app.put("/admin/update/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the admin ID from URL
    const { full_name, email, password } = req.body; // Get data from the request body

    // Validation: Ensure all fields are provided
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // SQL Query to update the admin profile
    const sql = `
      UPDATE tbl_admin
      SET full_name = ?, email = ?, password = ?
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [full_name, email, password, id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error." });
      }

      // Check if any rows were updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Admin not found or no changes made." });
      }

      // Success response
      res.status(200).json({ message: "Admin profile updated successfully!" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error." });
  }
});



app.get('/teacher_count', (request, response) => {
  db.query("SELECT COUNT(*) as teacher_count FROM tbl_teacher", (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return response.status(500).json({ error: "Database error." });
    }
    
    // Send the count of teachers as a response
    response.status(200).json({ teacher_count: result[0].teacher_count });
  });
});


app.get('/student_count', (request, response) => {
  db.query("SELECT COUNT(*) as student_count FROM tbl_student", (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return response.status(500).json({ error: "Database error." });
    }
    
    // Send the count of teachers as a response
    response.status(200).json({ student_count: result[0].student_count });
  });
});



app.get('/fetch_barcode', (request, response) => {
  db.query("SELECT * FROM tbl_barcode", (error, data) => {
    if (error) {
      console.error("Database error:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
    return response.json(data);
  });
});

app.delete('/barcode/:id', (request, response) => {
  const id = request.params.id;
  console.log("Deleting student with ID: " + id);
  
  const sql = "DELETE FROM tbl_barcode WHERE id = ?";
  
  db.query(sql, [id], (error, result) => {
      if (error) {
          console.error("Error deleting teacher:", error);
          return response.status(500).json({ message: "Error deleting teacher" });
      }

      if (result.affectedRows === 0) {
          return response.status(404).json({ message: "Teacher not found" });
      }

      return response.json({ message: "Teacher deleted successfully!" });
  });
});


app.delete('/delete_attendance/:id', (request, response) => {
  const id = request.params.id;
  console.log("Deleting Attendance with ID: " + id);
  
  const sql = "DELETE FROM tbl_attendance WHERE id = ?";
  
  db.query(sql, [id], (error, result) => {
      if (error) {
          console.error("Error deleting Attendance:", error);
          return response.status(500).json({ message: "Error deleting teacher" });
      }

      if (result.affectedRows === 0) {
          return response.status(404).json({ message: "Teacher not found" });
      }

      return response.json({ message: "Attendance deleted successfully!" });
  });
});

app.delete('/student/:id', (request, response) => {
  const id = request.params.id;
  console.log("Deleting student with ID: " + id);
  
  const sql = "DELETE FROM tbl_student WHERE id = ?";
  
  db.query(sql, [id], (error, result) => {
      if (error) {
          console.error("Error deleting teacher:", error);
          return response.status(500).json({ message: "Error deleting teacher" });
      }

      if (result.affectedRows === 0) {
          return response.status(404).json({ message: "Teacher not found" });
      }

      return response.json({ message: "Teacher deleted successfully!" });
  });
});



app.get('/fetch_attendance_by_id', (req, res) => {
  const { attendance_id } = req.query;

  if (!attendance_id) {
    return res.status(400).json({ error: "Attendance ID is required" });
  }

  db.query("SELECT * FROM tbl_attendance WHERE id = ?", [attendance_id], (error, result) => {
    if (error) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(404).json({ error: "Attendance not found" });

    res.json(result[0]);
  });
});


app.post('/update_attendance', (req, res) => {
  const { id, time_in, time_out, status } = req.body;

  if (!id || !time_in || !time_out || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "UPDATE tbl_attendance SET time_in = ?, time_out = ?, status = ? WHERE id = ?",
    [time_in, time_out, status, id],
    (error, result) => {
      if (error) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Attendance updated successfully!" });
    }
  );
});


app.get('/dashboard_attendance', (req, res) => {
  const { teacher_id } = req.query;

  if (!teacher_id) {
    return res.status(400).json({ error: "Teacher ID is required" });
  }

  const query = `
    SELECT 
      COUNT(*) AS total_students,
      SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) AS late_students,
      SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_students,
      SUM(CASE WHEN a.status = 'Excuse' THEN 1 ELSE 0 END) AS excuse_students,
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_students
    FROM tbl_attendance a
    WHERE a.teacher_id = ?
  `;

  db.query(query, [teacher_id], (error, result) => {
    if (error) return res.status(500).json({ error: "Database error" });

    if (result.length === 0) return res.status(404).json({ error: "No records found" });

    res.json(result[0]); // Return counts
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


app.put("/teacher/update/:teacherId", upload.single("image"), (req, res) => {
  const { teacherId } = req.params;
  const { full_name, email, password, department } = req.body;
  const image = req.file ? req.file.filename : null; // Get uploaded image filename

  if (!full_name || !email || !password || !department) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Dynamically construct SQL query
  let updateQuery = `
    UPDATE tbl_teacher 
    SET full_name = ?, email = ?, password = ?, department = ? 
    ${image ? ", image = ?" : ""} 
    WHERE id = ?
  `;

  let values = image
    ? [full_name, email, password, department, image, teacherId]
    : [full_name, email, password, department, teacherId];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Error updating profile!" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found!" });
    }

    res.status(200).json({ message: "Profile updated successfully!" });
  });
});


app.put("/student/update/:studentId", upload.single("image"), (req, res) => {
  const { studentId } = req.params;
  const { student_number,full_name, email, password, department, course } = req.body;
  const image = req.file ? req.file.filename : null; // Get uploaded image filename

  if (!student_number || !full_name || !email || !password || !department ||!course ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Dynamically construct SQL query
  let updateQuery = `
  UPDATE tbl_student 
  SET student_number = ?, full_name = ?, email = ?, password = ?, department = ?, course = ?
  ${image ? ", image = ?" : ""} 
  WHERE id = ?
`;


  let values = image
    ? [student_number,full_name, email, password, department, course, image, studentId]
    : [student_number, full_name, email, password, department, course, studentId];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Error updating profile!" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Teacher not found!" });
    }

    res.status(200).json({ message: "Profile updated successfully!" });
  });
});



app.get('/view_barcode', (req, res) => {
  const student_id = req.query.student_id;

  if (!student_id) {
      return res.status(400).json({ error: "Student ID is required" });
  }

  const sql = "SELECT * FROM tbl_barcode WHERE student_id = ? LIMIT 1";
  db.query(sql, [student_id], (err, result) => {
      if (err) {
          console.error("Error fetching barcode:", err);
          return res.status(500).json({ error: "Server error" });
      }

      if (result.length === 0) {
          return res.status(404).json({ error: "No barcode found for this student" });
      }

      res.json(result[0]); // Return the barcode data
  });
});


// View Attendance with Teacher's Name
app.get("/view_attendance", (req, res) => {
  const { student_id } = req.query;
  if (!student_id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  const query = `
    SELECT 
      a.id, 
      a.student_id, 
      a.status, 
      a.time_in, 
      a.time_out, 
      t.full_name AS teacher_name
    FROM tbl_attendance a
    JOIN tbl_teacher t ON a.teacher_id = t.id
    WHERE a.student_id = ? `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
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
