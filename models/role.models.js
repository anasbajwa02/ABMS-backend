const mongoose = require("mongoose")
const bcrypt =require("bcrypt")  


const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true,
    },
    permissions:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permission", // 👈 references Permission model
        }
    ],

},{
    timestamps:true,
})


module.exports = mongoose.model("role",roleSchema)