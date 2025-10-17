const express = require("express")
const app = express()

const path = require("path")
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config();

const dbConnection = require("./config/mongoose-connection.js")


const PORT = process.env.PORT || 5000

app.use(cookieParser())

app.use(cors({
    origin:true,
    credentials:true,
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))


console.log(process.env.NODE_ENV);
dbConnection()
app.listen(PORT,(req,res)=>{
    console.log("server is listening on port 5000")
})