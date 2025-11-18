import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();

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
  if (!order.toppings) {
    order.toppings = ["No toppings"];
  }
  order.time = new Date();

  orders.push(order);

  res.render("confirm", { order });
  // res.json(order);
});

app.get('/db-test', async(req,res) => {
  try{
    const [orders] = await pool.query('Select * from orders');
    res.send(orders)
  } catch (err){
    console.error('Database Error:', err);
    res.status(500).send('Database error' + err.message);
  } 
})

app.get("/confirm", (req, res) => {
  res.render("confirm");
});

app.post("/confirm", async (req, res) => {
  try {
    const order = req.body;

    console.log("New order submitted:", order);

    order.toppings = Array.isArray(order.toppings)
      ? order.toppings.join(",")
      : "";

    const sql = `INSERT INTO orders(customer,email, flavor, cone, toppings)
    VALUES (?,?,?,?,?)`;

    const params = Object.values(order);
    const [result] = await pool.execute(sql, params);
    console.log("Order saved with ID:", result.insertId);

    res.render("confirm", { order });
  } catch (error) {
    console.error("Error saving orders:", error);
    res
      .status(500)
      .send(
        "Sorry, there was an error processing your order. Please try again"
      );
  }
});

app.get("/admin", async (req, res) => {
  try {
    const [orders] = await pool.query(
      "Select * from orders ORDER BY timestamp DESC"
    );
    res.render("admin", { orders });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Database error" + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
