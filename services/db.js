        //database connection with NODEJS

//import  mongoose
const mongoose=require("mongoose");

//define a connection string between express and mongodb
mongoose.connect('mongodb://localhost:27017/BankServer')

//create a model and schema for storing data into the database
//model - User
//model in express same as mongodb collection name
const User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

//export the collection
module.exports={
    User
}