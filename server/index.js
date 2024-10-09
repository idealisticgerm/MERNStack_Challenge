import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/transactions.js";
import cors from "cors";

const port = 3000
const app = express()
app.use(cors());
// configure dotenv
dotenv.config()
app.use(express.json())
connectDB();

app.use(router);

app.get('/', (req, res) => {
    res.send('Hello Siddhesh!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})