const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geoCode");
const forecast = require("./utils/forecast");

const app = express();

//Define paths fpr Exress comfig
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.render("index", { title: "weather app", name: "Shikhar bansal" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About me", name: "Shikhar" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Shikhar",
    helpText: "This is ahelp page",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forcastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forcastData,
        location,
        address: req.query.address,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Shikhar bansal",
    errorMessage: "help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Shikhar bansal",
    errorMessage: "Page not found",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
