"use strict";

const express = require("express");
const config = require("config");
var path = require("path");

const router = express.Router();

// angular app

router.get("/app*", function(req, res, next) {
  if (config.get("flags.angular8") == "true") {
    res.sendFile(path.join(__dirname, "../../dist/client2/index.html"));
  } else {
    res.sendFile(path.join(__dirname, "../../dist/index.html"));
  }
});

if (config.get("flags.angular8") == "true") {
  router.use("/", express.static(path.join(__dirname, "../../dist/client2")));
} else {
  router.use("/", express.static(path.join(__dirname, "../../dist")));
}

module.exports = router;
