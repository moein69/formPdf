const cors = require("cors");
const express = require("express");
const app = express();
const pdfcrowd = require("pdfcrowd");
var path = require('path')


// global.__basedir = __dirname;

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));

app.use(express.static(__dirname + '/public'));





const initRoutes = require("./routes/server");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);






// app.get("/", (req, res) => {
//   // create the API client instance
//   var client = new pdfcrowd.HtmlToPdfClient("demo", "ce544b6ea52a5621fb9d55f8b542d14d");

//   // configure the callback to send a file in the HTTP response
//   var callbacks = pdfcrowd.sendGenericHttpResponse(
//       res, "application/pdf", "MyLayout.pdf", "attachment");

//   // configure the callback to send an error in the HTTP response
//   callbacks.error = function(errMessage, statusCode) {
//       res.set('Content-Type', 'text/plain');
//       res.status(statusCode || 400);
//       res.send(errMessage);
//   }

//   // run the conversion
//   client.convertFile(path.join(__dirname + '/public/form.html'), callbacks);
// });




app.get("/",(req,res)=>{

  // res.send('Hello word')
  res.sendFile(path.join(__dirname + '/public/form.html'));

})

app.use(cors());

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});