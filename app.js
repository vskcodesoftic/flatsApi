require("dotenv").config();
const functions = require("firebase-functions");

const environment = process.env.NODE_ENV;

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const HttpError = require("./middleware/http-error");

const homepageRoutes = require("./routes/home-routes");

const adminpageRoutes = require("./routes/admin-routes");


// Init app
const app = express();
const server = http.createServer(app);
// Connect database
require("./db/db");


// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  })
);

//static serving
app.use(express.static("public"));

// set public directory to serve static html files
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(homepageRoutes);

// Routes

/* admin routes */
app.use("/api/admin", adminpageRoutes);

// error model middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// Connect port

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(
    `server running in ${environment} mode & listening on port ${process.env.PORT}`
  );
  if (
    environment !== "production" &&
    environment !== "development" &&
    environment !== "testing"
  ) {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }
});

exports.app = functions.https.onRequest(app);
