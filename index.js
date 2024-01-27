import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const URL = "mongodb://localhost:27017"; // Add 'const' keyword
const PORT = 8000;
const router = express.Router();

app.use(bodyParser.json());
app.use(express.json());

// Model
const { Schema } = mongoose;
const stuSchema = new Schema({
  uid: Number,
  sem1: Number,
  sem2: Number,
  cgpa: Number
});
const records = mongoose.model("records", stuSchema);

// Database connection
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }) // Fix typo in the method name
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

router.get("/students", async (req, res) => {
  try {
    const users = await records.find();
    res.json({ message: "Students found", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while retrieving users" });
  }
});

router.post("/students", async (req, res) => {
  try {
    const newUser = await records.create(req.body);
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while creating user" });
  }
});

router.put("/students/:uid", async (req, res) => {
  try {
    const updatedUser = await records.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true }
    );
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating user" });
  }
});

router.patch("/students/:uid", async (req, res) => {
  try {
    const patchedUser = await records.findOneAndUpdate(
      { uid: req.params.uid },
      { $set: req.body },
      { new: true }
    );
    res.json({ message: "User patched successfully", patchedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while patching user" });
  }
});

router.delete("/students/:uid", async (req, res) => {
  try {
    await records.deleteOne({ uid: req.params.uid });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while deleting user" });
  }
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
