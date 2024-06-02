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

    database.connect();
    let presents = await database.query('SELECT * FROM presents WHERE idUser = ?',[idUser])

    database.disConnect();
    res.send(presents)
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
        return res.status(400).json({error: "Not item with this id"})
    } else {
        database.disConnect();
        return res.send(present)
    }
});

//Modificar un regalo

routerPresents.put("/:id", async (req,res)=>{
    let idUser = req.infoInApiKey.id

    let id = req.params.id
    let name = req.body.name
    let description = req.body.description
    let URL = req.body.url
    let price = req.body.price;

    if ( id == undefined ){
        return res.status(400).json({error: "no id param"})
    }

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