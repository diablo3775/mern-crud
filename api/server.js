const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const UserModel = require("./models/Todo");

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Give the client public or src assets folder path everytime you change the file location
    // cb(null, 'D:\\Mano\\CRUDiNMERN\\mern\\src\\assets\\prrofile-img');
    // cb(null, 'D:\\Side projects\\mano\\v2\\mern\\src\\assets');
    cb(null, 'D:\\Mern Stack\\client\\public\\assets');
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    fieldSize: 10 * 1024 * 1024, // 10MB
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

mongoose
  .connect("mongodb://127.0.0.1:27017/todo-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

app.get("/getUsers", (req, res) => {
  UserModel.find({})
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.post('/createUser', upload.single('image'), async (req, res) => {
  const user = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }
  const newUser = new UserModel({
    name: user.name,
    age: user.age,
    username: user.username,
    image: req.file.filename, // Save the filename in the "image" field
  });
  try {
    const result = await newUser.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

app.put("/editUser/:id", upload.single("image"), async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  // Check if a new image file was uploaded
  if (req.file) {
    updatedUser.image = req.file.filename; // Set the image filename in the updatedUser object
  }

  try {
    const result = await UserModel.findByIdAndUpdate(userId, updatedUser);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error editing user", error: error.message });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await UserModel.findByIdAndDelete(userId);
    if (result) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

app.listen(3001, () => console.log("Server started on port 3001"));

