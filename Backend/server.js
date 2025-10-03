// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";

import authRoutes from "./routes/authRoutes.js";
import addmcqRoutes from "./routes/addmcqRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import addProgrammRoutes from "./routes/addProgrammRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import connectDb from "./config/db.js";

dotenv.config();

const app = express();

// Trust proxy so req.secure works behind proxies (Render, Heroku, nginx)
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------- CORS FIX --------------------
const allowedOrigins = [
  "http://localhost:5173",            // local dev
  "https://learnnext.letnexttechnologies.com" // production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman/cURL (no origin) or valid frontend origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    credentials: true, // ✅ allow cookies/authorization headers
  })
);
// --------------------------------------------------

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/questions", addmcqRoutes);
app.use("/api/v1/programs", addProgrammRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/admin", adminRoutes);

// ---------------- Local code execution (unchanged) ----------------
const TEMP_DIR = path.join(process.cwd(), "temp_code");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

app.post("/api/v1/execute", async (req, res) => {
  try {
    let { code, language, stdin } = req.body;
    if (!code || !language)
      return res.status(400).json({ success: false, error: "Code and language required" });

    language = language.toLowerCase();
    const id = uuidv4();
    let filePath,
      compileCmd = null,
      runCmd;

    switch (language) {
      case "python3":
      case "python":
        filePath = path.join(TEMP_DIR, `${id}.py`);
        fs.writeFileSync(filePath, code);
        runCmd = `python3 "${filePath}"`;
        break;

      case "c":
        filePath = path.join(TEMP_DIR, `${id}.c`);
        fs.writeFileSync(filePath, code);
        compileCmd = `gcc "${filePath}" -o "${TEMP_DIR}/${id}"`;
        runCmd = `"${TEMP_DIR}/${id}"`;
        break;

      case "cpp":
      case "c++":
        filePath = path.join(TEMP_DIR, `${id}.cpp`);
        fs.writeFileSync(filePath, code);
        compileCmd = `g++ "${filePath}" -o "${TEMP_DIR}/${id}"`;
        runCmd = `"${TEMP_DIR}/${id}"`;
        break;

      case "java":
        filePath = path.join(TEMP_DIR, "Main.java");
        fs.writeFileSync(filePath, code);
        compileCmd = `javac "${filePath}"`;
        runCmd = `java -cp "${TEMP_DIR}" Main`;
        break;

      case "javascript":
      case "js":
        filePath = path.join(TEMP_DIR, `${id}.js`);
        fs.writeFileSync(filePath, code);
        runCmd = `node "${filePath}"`;
        break;

      default:
        return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    const execute = () => {
      const finalCmd = stdin ? `echo "${stdin}" | ${runCmd}` : runCmd;

      exec(finalCmd, { timeout: 5000 }, (err, stdout, stderr) => {
        try {
          if (err) return res.json({ success: false, error: stderr || err.message });
          res.json({ success: true, output: stdout.trim() });
        } finally {
          // Cleanup files
          try {
            fs.unlinkSync(filePath);
            if (compileCmd) {
              if (language === "java") fs.unlinkSync(path.join(TEMP_DIR, "Main.class"));
              else if (["c", "cpp", "c++"].includes(language)) fs.unlinkSync(`${TEMP_DIR}/${id}`);
            }
          } catch {}
        }
      });
    };

    if (compileCmd) {
      exec(compileCmd, (err, stdout, stderr) => {
        if (err) return res.json({ success: false, error: stderr || err.message });
        execute();
      });
    } else execute();
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
// ------------------------------------------------------------------

// ---------------- Connect DB and start server ----------------
connectDb();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}...`));
