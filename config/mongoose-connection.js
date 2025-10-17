const mongoose = require("mongoose")
const dbUrl = process.env.MONGODB_URI
const dbConnection = async ()=>{
    try {
       await mongoose.connect(`${dbUrl}accessManagmentSystem`)
       console.log("Db connected")
    } catch (error) {
        console.log(`error on db connection: ${error}`)
    }

}

module.exports = dbConnection