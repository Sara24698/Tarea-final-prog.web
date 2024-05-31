const express = require('express')
const jwt = require("jsonwebtoken");
const port = 4000


const routerUsers= require("./Routers/Users")
const activeApiKeys= require("./activeApiKeys")

var cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors())

app.use(["/users/disconect"] ,(req,res,next)=>{
	console.log("middleware execution")

	let apiKey = req.body.apiKey
	if ( apiKey == undefined ){
		res.status(401).json({ error: "no apiKey" });
	return 
	}
	let infoInApiKey = jwt.verify(apiKey, "secret");
	if ( infoInApiKey == undefined || activeApiKeys.indexOf(apiKey) == -1){
		res.status(401).json({ error: "invalid apiKey" });
		return 	
	}

	// desencrypted in req
	req.infoInApiKey = infoInApiKey;
	req.apiKey = apiKey;
  next()
})

app.use("/users", routerUsers)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })