const mongoose=require("mongoose")
const express=require("express")
const app=express()
app.use(express.json())

const PORT=8000

const dotenv=require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("db connected"))
  .catch((err)=>console.log("Err connecting to db",err))

app.get('/',async(req,res)=>{
  res.json("SERVER is runnnnnningggg!!!!")
})



app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})