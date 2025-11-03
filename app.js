import express from "express";

const app = express();

app.set("view engine", "ejs");

const PORT = 3004;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const orders = [];

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/submit-order", (req, res) => {
  const order = req.body;
  if (!order.toppings) {
    order.toppings = ["No toppings"];
  }
  order.time = new Date();

  orders.push(order);

  res.render("confirm", { order });
  // res.json(order);
});

app.get("/confirm", (req, res) => {
  res.render("confirm");
});

app.get("/admin", (req, res) => {
  res.render("admin", { orders });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
