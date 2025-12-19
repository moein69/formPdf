const cors = require("cors");
const express = require("express");
const app = express();
const pdfcrowd = require("pdfcrowd");
const path = require("path");

app.use(cors()); // بهتره اول بیاد
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const initRoutes = require("./routes/server");
initRoutes(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Running at http://${HOST}:${PORT}`);
});
