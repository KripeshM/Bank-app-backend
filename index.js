//1 import express
const express = require("express");

//4 import cors
const cors = require("cors");

//8 import logic.js
const logic=require('./services/logic')

//import jwttoken
const jwt=require('jsonwebtoken')


//2 create a server using express
const server = express();

//5 use cors in server app 
server.use(cors({
    origin:"http://localhost:4200"
}))

//6 parse json data to the js in server app
server.use(express.json())

//7 to resolve client requests - 5000 /
// server.get("/",(req,res)=>{
//     res.send('GET METHOD')
// })

// server.post("/",(req,res)=>{
//     res.send("POST METHOD")
// })

//3 setup port for the server
server.listen(5000,()=>{
    console.log("listening on port 5000");
})


//application specific middleware
const appMiddleware=(req,res,next)=>{
    next()
    console.log('application specific middleware');
}

//use application specific middleware
server.use(appMiddleware)



//Router specific middleware
//middleware for verifying token to check user is logined or not
const jwtMiddleware=(req,res,next)=>{

    //get token from req header
    const token =req.headers['verify-token'];//token
    console.log(token);
    //verify token
    try{
        const data=jwt.verify(token,'superkey2023')
        console.log(data);
        req.currentAcno=data.loginAcno
        next()
    }
    catch{
        res.status(401).json({message:'please Login'})
    }
    

    console.log('Router specific middleware');
}


//Bank request
//register
//login
//balance enquiry
//fund transfer

//7 register api call
server.post('/register',(req,res)=>{
    console.log(req.body);

    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
    // res.send('Register request received');
    // res.status(200).json({message:'Request Received'})
})


//9 login api call
server.post('/login',(req,res)=>{
    console.log('inside the login api call');
    console.log(req.body);

    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})


//getBalance api call
server.get('/getbalance/:acno',jwtMiddleware,(req,res)=>{
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//fundTransfer api call
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log("inside fund transfer");
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//getTransactionHistory api call
server.get('/getTransactionHistory',jwtMiddleware,(req,res)=>{
    console.log("inside get transaction history");
    logic.getTransactionHistory(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//account delete api call
server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log("inside the delete account");
    logic.deleteUserAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})