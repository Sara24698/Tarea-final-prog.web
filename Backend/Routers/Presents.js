const express = require('express');
const routerPresents= express.Router();
const database = require("../database")

let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

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
    let ChosenBy = null;
    
    try {
        let insertedPresent = null;
        insertedPresent = await database.query(
            'INSERT INTO presents (idUser,name,description,URL,price, ChosenBy) VALUES (?,?,?,?,?,?)',
            [idUser, name, description,URL,price, ChosenBy])

    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.status(200).json({inserted: "Item inserted"})
})


//Mostrar regalos de un usuario

routerPresents.get("/", async (req,res)=>{
    let idUser = req.infoInApiKey.id
    let emailUser = req.infoInApiKey.email

    if(req.query.email != undefined){
        let emailFriend = req.query.email
        database.connect();

        if (code_email.test(emailFriend) == false ){
            return res.status(400).json({error: "Email invalid format"})
        }


        try {
            let checkFriend = await database.query(
                'SELECT * FROM users WHERE email = ?',[emailFriend])
            
            if(checkFriend.length==0){
                database.disConnect();
                return res.status(400).json({error: "Wrong email or friend not registered in this app"})
            }

        } catch (e){
            database.disConnect();
            return res.status(400).json({error: e})
        }

        try {

            let friend = await database.query('SELECT * FROM friends WHERE emailMainUser = ? AND emailFriend=?',[emailFriend, emailUser])
            if(friend.length<1){
                database.disConnect();
                return res.status(400).json({error: "You are not registered in this user friend list"})

            } 
        } catch (e){
            database.disConnect();
            return res.status(400).json({error: e})
        } 

        
        try {
            let idFriend = await database.query('SELECT Id FROM users WHERE email = ?',[emailFriend])

            let presents = await database.query('SELECT * FROM presents WHERE idUser = ?',[idFriend[0].Id])
            if(presents.length<1){
                database.disConnect();
                return res.status(400).json({error: "This friend does not have any items in its wishlist yet"})
            } else{
                database.disConnect();
                res.status(200).send(presents)
            }


        } catch (e){
            database.disConnect();
            return res.status(400).json({error: e})
        }
        
        

     
    } else{
        database.connect();
        let presents = await database.query('SELECT * FROM presents WHERE idUser = ?',[idUser])

        database.disConnect();
        res.status(200).send(presents)
    }
    
})


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
        return res.status(400).json({error: "No item with this id"})
    } else {
        database.disConnect();
        return res.status(200).send(present)
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
    if(owner.length==0){
        let emailFriend = await database.query('SELECT email FROM users JOIN presents ON users.Id=presents.idUser WHERE presents.id =?',[id])
  

        if(emailFriend.length<1){
            database.disConnect();
            return res.status(400).json({error: "No item with this id"})
        }
        else{
            let friend = await database.query('SELECT * FROM friends WHERE emailMainUser = ? AND emailFriend=?',[emailFriend[0].email, emailUser])
            if(friend.length<1){
                database.disConnect();
                return res.status(400).json({error: "You are not registered in this user friend list"})
        }   else{

            let choose = await database.query('SELECT ChosenBy FROM presents WHERE id = ?',[id])
            if(choose[0].ChosenBy!=null){
                database.disConnect();
                return res.status(400).json({error: "This item is being given by another user"})
            } else{
                let ChosenBy = null;
                try {
                    ChosenBy = await database.query(
                        'UPDATE presents SET ChosenBy=? WHERE id=?', [emailUser, id])

                } catch (e){
                    database.disConnect();
                    return res.status(400).json({error: e})
                }

                database.disConnect();
                res.status(200).json({inserted: "Regalo reservado para regalar al usuario"})
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
        try {
            let checkPresent = await database.query(
                'SELECT * FROM presents WHERE id=? and idUser=?',[id, idUser])
            if(checkPresent.length==0){
                database.disConnect();
                return res.status(400).json({error: "No hay un item con este id"})
            }
    
        } catch (e){
            database.disConnect();
            return res.status(400).json({error: e})
        }
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
        res.json({modifiyed: "Regalo actualizado"})
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
    

    try {
        
        let idcheck=null
        idcheck = await database.query(
            'SELECT * FROM presents WHERE id = ? AND idUser= ?',[id, idUser])
        
        if(idcheck.length==0){
            database.disConnect();
            return res.status(400).json({error: "No item with this id"})
        }
        
    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    try {
        let deletedPresent = null;
        deletedPresent = await database.query(
            'DELETE FROM presents WHERE id = ? AND idUser= ?',[id, idUser])
  
    } catch (e){
        database.disConnect();
        return res.status(400).json({error: e})
    }

    database.disConnect();
    res.json({modifiyed: "Item deleted"})
})


module.exports=routerPresents