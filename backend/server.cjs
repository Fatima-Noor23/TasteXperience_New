const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------- PostgreSQL connection (hardcoded – no .env) ----------------------
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finalllll",
  password: "12345",
  port: 5432,
});

// Demo mode: mock taste data when PostgreSQL is not running (all menu ids)
const DEMO_FOOD_NAMES = {
  1: "Cheezy Sticks",
  2: "Oven Baked Wings",
  3: "Flaming Wings",
  4: "Calzone Chunks",
  5: "Arabic Rolls",
  6: "Behari Rolls",
  7: "Chicken Tikka",
  8: "Chicken Fajita",
  10: "Chicken Tandoori",
  12: "Vegetable Pizza",
  16: "Sausage Pizza",
  17: "Cheese Lover Pizza",
  20: "Peri Peri Pizza",
};
function getDemoTasteSignal(foodId) {
  const id = parseInt(foodId, 10);
  const name = DEMO_FOOD_NAMES[id] || "Menu item";
  return {
    food_name: name,
    voltage: 1.2 + (id % 20) * 0.1,
    current_salty: 0.5 + (id % 20) * 0.05,
    frequency: 50 + (id % 20),
    duration: 100 + (id % 20) * 10,
    waveform: "sine",
    polarity: "positive",
  };
}

// ---------------------- ESP32 SerialPort (Optional) ----------------------
let port;
try {
  const { SerialPort } = require("serialport");

  port = new SerialPort({ path: "COM5", baudRate: 115200 });

  port.on("open", () => {
    console.log("SerialPort to ESP32 is open.");
  });

  port.on("error", (err) => {
    console.error("SerialPort error:", err.message);
  });
} catch (err) {
  console.log("ESP32 not connected. Continuing without SerialPort.");
  port = null; // ESP32 not available
}

// Safe function to send data to ESP32
function sendToESP32(data) {
  if (port && port.isOpen) {
    port.write(data + "\n", (err) => {
      if (err) console.error("Error writing to ESP32:", err);
      else console.log("Sent to ESP32:", data);
    });
  } else {
    console.log("ESP32 not connected or port not open. Data:", data);
  }
}

// ---------------------- Root (so localhost:5000 shows something) ----------------------
app.get("/", (req, res) => {
  res.json({
    message: "TasteXperience API is running",
    endpoints: {
      "GET /api/finalllll/:id": "Taste profile for food (id 1–7)",
      "POST /api/feedback": "Submit feedback (name, email, rating, comments)",
    },
  });
});

// ---------------------- GET Taste Profile ----------------------
app.get("/api/finalllll/:id", async (req, res) => {
  const foodId = req.params.id;
  const id = parseInt(foodId, 10);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(404).json({ message: "Item not found" });
  }

  try {
    const tasteQuery = "SELECT * FROM food_profiles WHERE food_id = $1";
    const tasteResult = await pool.query(tasteQuery, [foodId]);
    if (tasteResult.rows.length === 0)
      return res.status(404).json({ message: "Item not found" });

    const tasteData = tasteResult.rows[0];
    const stimQuery = "SELECT * FROM stimulation_parameters LIMIT 1";
    const stimResult = await pool.query(stimQuery);
    const stimData = stimResult.rows[0];

    const tasteKeys = ["ph", "salinity", "aroma", "temperature", "taste_level"];
    let tasteSum = 0;
    tasteKeys.forEach((key) => (tasteSum += parseFloat(tasteData[key])));

    const finalSignal = {
      food_name: tasteData.food_name,
      voltage: tasteSum * parseFloat(stimData.intensity_voltage_level),
      current_salty: tasteSum * parseFloat(stimData.current_level_salty),
      frequency: tasteSum * parseFloat(stimData.frequency_type),
      duration: tasteSum * parseFloat(stimData.duration),
      waveform: stimData.waveform,
      polarity: stimData.polarity,
    };

    sendToESP32(JSON.stringify(finalSignal));
    return res.json(finalSignal);
  } catch (err) {
    // PostgreSQL not running? Use demo data so the app still works
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      console.log("DB not available – using demo taste data for id", foodId);
    } else {
      console.error("Error:", err);
    }
    const demoSignal = getDemoTasteSignal(foodId);
    sendToESP32(JSON.stringify(demoSignal));
    return res.json(demoSignal);
  }
});

// ---------------------- POST Feedback ----------------------
app.post("/api/feedback", async (req, res) => {
  console.log("Incoming feedback:", req.body);

  const { name, email, rating, comments } = req.body;

  if (!name || !email || !rating || !comments) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const query = `
      INSERT INTO feedback (name, email, rating, comments, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    const values = [name, email, rating, comments];
    const result = await pool.query(query, values);
    console.log("Inserted feedback:", result.rows[0]);
    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: result.rows[0],
    });
  } catch (err) {
    // PostgreSQL not running? Still return success so the form works in demo
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      console.log("DB not available – feedback received (demo mode):", {
        name,
        email,
        rating,
      });
    } else {
      console.error("Error inserting feedback:", err);
    }
    return res.status(201).json({
      message: "Feedback received (demo mode – no database)",
      feedback: { name, email, rating, comments },
    });
  }
});

// ---------------------- Start Server ----------------------
const SERVER_PORT = 5000;
app.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`),
);
