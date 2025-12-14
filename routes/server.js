const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");
const controllerPdf = require("../controller/file.pdf");
const controllerPdfNew = require("../file.pdf");
const controllerPdfForm = require("../file.form.pdf");

let routes = (app) => {
  
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.get("/pdf/:number", controllerPdf.htmlToPdf);
  router.get("/convert/:number", controllerPdfNew.htmlToPdf);
 router.get("/convertForm/:number", controllerPdfForm.htmlToPdf);

  app.use(router);
};

module.exports = routes;