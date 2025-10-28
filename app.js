import express from "express";

const app = express();

app.set("view engine", "ejs");

const PORT = 3001;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const orders = [];

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/submit-order", (req, res) => {
  const order = req.body;
  orders.push(order);
  res.render("confirm", { order });
  // res.json(order);
});

app.get("/confirm", (req, res) => {
  res.render("confirm");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
