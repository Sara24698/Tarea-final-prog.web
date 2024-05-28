const express = require('express');
const routerUsers= express.Router();
const database = require("../database")

const activeApiKeys = require("../activeApiKeys")
const jwt = require("jsonwebtoken");


//Petición para registrarse
routerUsers.post("/users", async (req,res)=>{
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
    if ( password == undefined ){
        errors.push("No password in body")
    }

    if ( password.length < 5 ){
        errors.push("Password must be at least 5 characters long")
    }
    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();

    let insertedUser = null;
    try {

        userWithSameEmail = await database.query('SELECT email FROM users WHERE email = ?',
            [email])

        if ( userWithSameEmail.length > 0){
            database.disConnect();
            return res.status(400).json({error: "Already a user with that email"})
        }

        if ( password.length < 5){
            database.disConnect();
            return res.status(400).json({error: "Password is not 5 characters long"})
        }

        let role = "user"
        insertedUser = await database.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
            [name, email, password,role])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({inserted: insertedUser})
})


//Petición para iniciar sesión
routerUsers.post("/users/login", async (req,res)=>{
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
            role: selectedUsers[0].role //igualmente lo compruebo en el backend
		},
		"secret");
	activeApiKeys.push(apiKey)


    res.json({
        apiKey: apiKey,
        id: selectedUsers[0].id,
        email: selectedUsers[0].email
    })
})

//Petición para desconectar
routerUsers.post("/users/disconect", async (req,res)=>{
    const index = activeApiKeys.indexOf(req.body.apiKey);
    if (index > -1) { 
        activeApiKeys.splice(index, 1); 
        res.json({removed: true})
    } else {
        return res.status(400).json({error: "user not found"})
    }

})


module.exports=routerUsers