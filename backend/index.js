const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");
const app = express();
const options = [
    cors({
      origin: '*',
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  ];
  
  app.use(cors(options));
app.use(express.json());
app.get("/hi",(req,res) => {
    return res.send("hello");
})
app.use("/",mainRouter);


app.listen(3000);