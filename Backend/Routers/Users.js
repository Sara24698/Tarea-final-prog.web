const express = require('express');
const routerUsers= express.Router();
const database = require("../database")

const activeApiKeys = require("../activeApiKeys")
const jwt = require("jsonwebtoken");


//Petición para registrarse
routerUsers.post("/", async (req,res)=>{
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password 
    let errors = []
    
    if ( name == undefined ){
        errors.push("No name in body")
    }
    if ( email == undefined ){
        errors.push("No email in body")
    }
    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    if (code_email.test(email) == false ){
        errors.push("Email format no valid")
    }

    if ( password == undefined ){
        errors.push("No password in body")
    }

    if ( password.length < 5 ){
        errors.push("Password must be at least 5 characters long")
    }
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    else{database.connect();

        let insertedUser = null;
        try {
    
            userWithSameEmail = await database.query('SELECT email FROM users WHERE email = ?',
                [email])
    
            if ( userWithSameEmail.length > 0){
                database.disConnect();
                return res.status(400).json({error: "Already a user with that email"})
            }
       
            insertedUser = await database.query('INSERT INTO users (name,email,password) VALUES (?,?,?)',
                [name, email, password])
    
        } catch (e){
            database.disConnect();
            return res.status(400).json({error: e})
        }
    
        database.disConnect();
        res.status(200).json({inserted: "User registered"})}

    
})


//Petición para iniciar sesión
routerUsers.post("/login", async (req,res)=>{
    let email = req.body.email
    let password = req.body.password 
    let errors = []
    if ( email == undefined ){
        errors.push("no email in body")
    }
    if ( password == undefined ){
        errors.push("no password in body")
    }
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();

    let selectedUsers = null;
    try {
        selectedUsers = await database.query('SELECT id, email FROM users WHERE email = ? AND password = ?',
            [email, password])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    if ( selectedUsers.length == 0){
        return res.status(401).json({error: "invalid email or password"})
    }

    database.disConnect();

    let apiKey = jwt.sign(
		{ 
			email: selectedUsers[0].email,
			id: selectedUsers[0].id,
		},
		"secret");
	activeApiKeys.push(apiKey)


    res.status(200).json({
        apiKey: apiKey,
        id: selectedUsers[0].id,
        email: selectedUsers[0].email
    })
})

//Petición para desconectar
routerUsers.post("/disconnect", async (req,res)=>{
    const index = activeApiKeys.indexOf(req.apiKey);
    if (index > -1) { 
        activeApiKeys.splice(index, 1); 
        res.status(200).json({removed: "User disconnected"})
    } else {
        return res.status(400).json({error: "user not found"})
    }

})


module.exports=routerUsers