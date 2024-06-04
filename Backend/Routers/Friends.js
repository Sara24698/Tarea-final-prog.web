const express = require('express');
const routerFriends= express.Router();
const database = require("../database")

//Insertar correo de amigo
routerFriends.post("/", async (req,res)=>{
    let emailUser = req.infoInApiKey.email
    let emailFriend= req.body.email


    if ( emailFriend == undefined ){
        return res.status(400).json({error: "no email param"})
    }

    database.connect();

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
    res.json({inserted: insertedFriend})
})


//Mostrar amigos de un usuario

routerFriends.get("/", async (req,res)=>{
    let emailUser = req.infoInApiKey.email

    database.connect();
    let friends = await database.query('SELECT emailFriend FROM friends WHERE emailMainUser = ?',[emailUser])

    database.disConnect();
    res.send(friends)
})


//Eliminar amigo de la lista

routerFriends.delete('/:email', async (req, res) => {
    let email = req.params.email;
    let emailUser = req.infoInApiKey.email


    if ( email == undefined ){
        return res.status(400).json({error: "no email param"})
    }

    database.connect();
    let deletedFriend = null;
    try {
        deletedFriend = await database.query(
            'DELETE FROM friends WHERE emailFriend = ? AND emailMainUser= ?',[email, emailUser])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({modifiyed: deletedFriend})
})













module.exports=routerFriends