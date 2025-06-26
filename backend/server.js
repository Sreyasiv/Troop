const mongoose=require("mongoose")
const express=require("express")
const app=express()
app.use(express.json())

const cors = require("cors");

const PORT=8000

const dotenv=require("dotenv")
dotenv.config()

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("db connected"))
  .catch((err)=>console.log("Err connecting to db",err))

app.get('/',async(req,res)=>{
  res.json("SERVER is runningggg!!!!")
})

const postRoutes = require("./routes/posts");
app.use("/api", postRoutes);

const CompaRoutes = require("./routes/compaRoutes");
app.use("/api/compaRoutes", CompaRoutes);
console.log("✅ Compa Routes connected");


app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})