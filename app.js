import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();



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

app.get("/admin", (req, res) => {
  res.render("admin", { orders });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
