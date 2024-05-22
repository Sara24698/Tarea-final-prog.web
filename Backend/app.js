const express = require('express')
const port = 4000


const routerUsers= require("./Routers/Users")

const app = express()

app.use("/users", routerUsers)