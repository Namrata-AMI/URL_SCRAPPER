const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { Queue } = require('bullmq');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 
const dbUrl = MONGO_URL;
const { scrapeMetadata } = require("./utils/scraper"); 
const MetaData = require("./models/MetaData"); 

const upload = multer({ dest: "uploads/" });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.render("index.ejs");
});


async function examp() {
    const url = "https://example.com";
    const data = await scrapeMetadata(url);
    console.log("Scraped data from URL:", data);
}
  
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    console.log("Uploaded file path:", req.file.path);  
  
    const filePath = req.file.path;
    const jobId = await scrapeMetadata(filePath); 
    res.json({ message: "File uploaded successfully!", jobId });
  });
  
app.get("/metadata", async (req, res) => {
  try {
    const metadata = await MetaData.find();
    res.json(metadata);
  } catch (e) {
    res.status(400).json({ error: "Error in fetching metadata!" });
  }
});


app.get("/metadata/:id", async (req, res) => {
  try {
    const data = await MetaData.findById(req.params.id); // Fixed line: use findById for single document fetch
    if (!data) {
      return res.status(404).json({ error: "Data not found!" });
    }
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: "Error in fetching metadata!" });
  }
});


app.delete("/metadata/:id", async (req, res) => {
  try {
    const data = await MetaData.findOneAndDelete(req.params.id); // Fixed line: use req.params.id for deletion
    if (!data) {
      return res.status(404).json({ error: "Data not found!" });
    }
    res.json({ message: "Data deleted successfully!" });
  } catch (err) {
    res.status(400).json({ error: "Error in deleting metadata!" });
  }
});

main()
  .then((res) => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
