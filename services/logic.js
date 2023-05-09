//import db.js
const db = require('./db')


//import jwt token
const jwt = require("jsonwebtoken")

//logic for register - asynchronous function - promise -  .then
const register = (acno, username, password) => {
    console.log("Inside register works");

    //acno in db?
    //yes
    return db.User.findOne({ acno }).then((response) => {
        // console.log(response);
        if (response) {
            return {
                statusCode: 401,
                message: "acno already registered"
            }
        }
        else {
            //create new object for registration
            const newUser = new db.User({
                acno,
                username,
                password,
                balance: 1000,
                transaction: []
            })

            //to save in database
            newUser.save()
            //to send response back to client 
            return {
                statusCode: 200,
                message: 'Successfully registered'
            }
        }
    })

}



//logic for login - asynchronous function - promise -  .then

const login = (acno, password) => {
    console.log('inside the login function');
    return db.User.findOne({ acno, password }).then((result) => {
        if (result) {
            //token generated
            const token = jwt.sign({ loginAcno: acno }, 'superkey2023')
            return {
                statusCode: 200,
                message: 'Successfully logged in',
                currentUser: result.username,
                token,//send to the client
                currentAcno: acno//send to client - login.ts
            }
        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid data'
            }
        }
    })

}


//logic for balance enquiry
const getBalance = (acno) => {
    //check acno in db
    return db.User.findOne({ acno }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                balance: result.balance
            }
        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid Data'
            }
        }
    })
}

//fund transfer
const fundTransfer = (fromAcno, fromAcnoPswd, toAcno, amt) => {

    //convert amt into a number
    let amount = parseInt(amt)

    //check fromAcno in mongodb
    return db.User.findOne({
        acno: fromAcno,
        password: fromAcnoPswd
    }).then((debitdetails) => {
        if (debitdetails) {
            //to check toAcno 
            return db.User.findOne({ acno: toAcno }).then((creditdetails) => {
                if (creditdetails) {
                    //check the balance>amount
                    if (debitdetails.balance > amount) {
                        debitdetails.balance -= amount;
                        debitdetails.transaction.push({
                            type: "Debit",
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes to the mongodb
                        debitdetails.save()

                        //update to the toAcno
                        creditdetails.balance += amount;
                        creditdetails.transaction.push({
                            type: "Credit",
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes to mongodb
                        creditdetails.save()

                        //send response  to the client side
                        return {
                            statusCode: 200,
                            message: 'Fund transfer successfull'
                        }
                    }
                    else {
                        return {
                            statusCode: 401,
                            message: 'Insufficient balance'
                        }
                    }
                }
                else {
                    return {
                        statusCode: 401,
                        message: 'Invalid Data'
                    }
                }
            })
        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid Data'
            }
        }
    })
}


//transaction history

const getTransactionHistory = (acno) => {
    return db.User.findOne({ acno }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                transaction: result.transaction
            }

        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid data'
            }
        }
    })
}

//delete account function

const deleteUserAccount=(acno)=>{
    //acno delete from mongodb
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:'Account deleted successfully'
        }
    })
}

//export
module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    getTransactionHistory,
    deleteUserAccount
}





