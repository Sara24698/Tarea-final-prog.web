const express = require('express');
const routerFriends= express.Router();
const database = require("../database")

let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

//Insertar correo de amigo
routerFriends.post("/", async (req,res)=>{
    let emailUser = req.infoInApiKey.email
    let emailFriend= req.body.email
    let errors = []


    if ( emailFriend == undefined ){
        errors.push("No email in body")
    }

    if (code_email.test(emailFriend) == false ){
        errors.push("Email format no valid")
    }

    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();
    
    let checkFriend = null;
    try {
        checkFriend = await database.query(
            'SELECT * FROM users WHERE email = ?',[emailFriend])
        
        if(checkFriend.length==0){
            database.disConnect();
            return res.status(400).json({error: "Wrong email or friend not registered in this app"})
        }

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    let insertedFriend = null;
    try {
        insertedFriend = await database.query(
            'INSERT INTO friends (emailMainUser, emailFriend) VALUES (?,?)',
            [emailUser, emailFriend])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.status(200).json({inserted: "New friend added"})
})


//Mostrar amigos de un usuario

routerFriends.get("/", async (req,res)=>{
    let emailUser = req.infoInApiKey.email

    database.connect();
    let friends = await database.query('SELECT emailFriend FROM friends WHERE emailMainUser = ?',[emailUser])

    database.disConnect();
    res.status(200).send(friends)
})


//Eliminar amigo de la lista

routerFriends.delete('/:email', async (req, res) => {
    let email = req.params.email;
    let emailUser = req.infoInApiKey.email
    let errors = []


    if ( email == undefined ){
        errors.push("No email provided")
    }

    
    if (code_email.test(email) == false ){
        errors.push("Email format no valid")
    }

    if ( errors.length > 0){
        return res.status(400).json({error: errors})
    }

    database.connect();

    let checkFriend = null;
    try {
        checkFriend = await database.query(
            'SELECT * FROM friends WHERE emailFriend = ? AND emailMainUser= ?',[email, emailUser])
        
        if(checkFriend.length==0){
            database.disConnect();
            return res.status(400).json({error: "Wrong email or friend not added"})
        }

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }


    let deletedFriend = null;
    try {
        deletedFriend = await database.query(
            'DELETE FROM friends WHERE emailFriend = ? AND emailMainUser= ?',[email, emailUser])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.status(200).json({modifiyed: "Friend deleted"})
})













module.exports=routerFriends