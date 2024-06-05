const express = require('express');
const routerPresents= express.Router();
const database = require("../database")



//Insertar regalo
routerPresents.post("/", async (req,res)=>{
    let idUser = req.infoInApiKey.id
    let name = req.body.name
    let description = req.body.description
    let URL = req.body.url
    let price = req.body.price;


    if ( name == undefined ){
        return res.status(400).json({error: "no name param"})
    }

    if ( description == undefined ){
        return res.status(400).json({error: "no description param"})
    }

    if ( URL == undefined ){
        return res.status(400).json({error: "no URL param"})
    }

    if ( price == undefined ){
        return res.status(400).json({error: "no price param"})
    }

    database.connect();

    let insertedPresent = null;
    try {
        insertedPresent = await database.query(
            'INSERT INTO presents (idUser,name,description,URL,price) VALUES (?,?,?,?,?)',
            [idUser, name, description,URL,price])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({inserted: insertedPresent})
})


//Mostrar regalos de un usuario

routerPresents.get("/", async (req,res)=>{
    let idUser = req.infoInApiKey.id
    let emailUser = req.infoInApiKey.email

    if(req.query != undefined){
        let emailFriend = req.query.userEmail

        database.connect();
        let friend = await database.query('SELECT * FROM friends WHERE emailMainUser = ? AND emailFriend=?',[emailUser, emailFriend])

        if(friend.length<1){
            database.disConnect();
            return res.status(400).json({error: "You are not registered in this user friend list"})


        } else{
            let idFriend = await database.query('SELECT Id FROM users WHERE email = ?',[emailFriend])
            let presents = await database.query('SELECT * FROM presents WHERE idUser = ?',[idFriend])

            if(presents.length<1){
                database.disConnect();
                return res.status(400).json({error: "This friend does not have any items in its wishlist yet"})
            } else{database.disConnect();
                res.send(presents)
            }
            
        }

    } else{

    database.connect();
    let presents = await database.query('SELECT * FROM presents WHERE idUser = ?',[idUser])

    database.disConnect();
    res.send(presents)
}})


//Mostrar un regalo determinado

routerPresents.get('/:id', async (req, res) => {
    let id = req.params.id;
    let idUser = req.infoInApiKey.id


    if ( id == undefined ){
        return res.status(400).json({error: "no id param"})
    }

    database.connect();
    const present = await database.query('SELECT * FROM presents WHERE id = ? AND idUser= ?',[id, idUser])

    if (present.length < 1){
        database.disConnect();
        return res.status(400).json({error: "Not item with this id"})
    } else {
        database.disConnect();
        return res.send(present)
    }
});

//Modificar un regalo

routerPresents.put("/:id", async (req,res)=>{
    let idUser = req.infoInApiKey.id
    let emailUser = req.infoInApiKey.email
    let id = req.params.id

    if ( id == undefined ){
        return res.status(400).json({error: "no id param"})
    }

    database.connect();
    let owner = await database.query('SELECT * FROM presents WHERE id = ? AND idUser= ?',[id, idUser])
    if(owner.length<1){
        let emailFriend = await database.query('SELECT email FROM users JOIN presents ON users.Id=presents.idUser WHERE id =?',[id])

        if(emailFriend.length<1){
            database.disConnect();
            return res.status(400).json({error: "No item with this id"})
        }
        else{
            let friend = await database.query('SELECT * FROM friends WHERE emailMainUser = ? AND emailFriend=?',[emailUser, emailFriend])
            if(friend.length<1){
                database.disConnect();
                return res.status(400).json({error: "You are not registered in this user friend list"})
        }   else{
            let chosen = null
            let choose = await database.query('SELECT * FROM presents WHERE id = ? AND ChosenBy=?',[id, chosen])
            if(choose.length<1){
                database.disConnect();
                return res.status(400).json({error: "This item is being given by another user"})
            } else{
                let ChosenBy = null;
                try {
                    ChosenBy = await database.query(
                        'INSERT INTO presents (ChosenBy) VALUES (?)',
                        [emailUser])

                } catch (e){
                    database.disConnect();
                    return res.status(400).json({error: e})
                }

                database.disConnect();
                res.json({inserted: ChosenBy})
            }
            }

    }}else{
        let id = req.params.id
        let name = req.body.name
        let description = req.body.description
        let URL = req.body.url
        let price = req.body.price;
    
        
    
        if ( name == undefined ){
            return res.status(400).json({error: "no name param"})
        }
    
        if ( description == undefined ){
            return res.status(400).json({error: "no description param"})
        }
    
        if ( URL == undefined ){
            return res.status(400).json({error: "no URL param"})
        }
    
        if ( price == undefined ){
            return res.status(400).json({error: "no price param"})
        }
    
        database.connect();
    
        let updatedPresent = null;
        try {
            updatedPresent = await database.query(
                'UPDATE presents SET name = ?, description = ?, URL = ?, price = ? WHERE id = ? AND idUser = ?', 
                        [name,description,URL,price,id, idUser])
    
        } catch (e){
            database.disConnect();
            return res.status(400).json({error: e})
        }
    
        database.disConnect();
        res.json({modifiyed: updatedPresent})
    }

    
})



// Eliminar un regalo

routerPresents.delete('/:id', async (req, res) => {
    let id = req.params.id;
    let idUser = req.infoInApiKey.id


    if ( id == undefined ){
        return res.status(400).json({error: "no id param"})
    }

    database.connect();
    let deletedPresent = null;
    try {
        deletedPresent = await database.query(
            'DELETE FROM presents WHERE id = ? AND idUser= ?',[id, idUser])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({modifiyed: deletedPresent})
})


module.exports=routerPresents