const express = require('express')
const jwt = require("jsonwebtoken");
const port = 4000


const routerUsers= require("./Routers/Users")
const routerPresents= require("./Routers/Presents")
const routerFriends= require("./Routers/Friends")
const activeApiKeys= require("./activeApiKeys")

var cors = require('cors');



const app = express()
app.use(express.json())
app.use(cors())

app.use(["/users/disconnect","/presents", "/friends"] ,(req,res,next)=>{
	console.log("middleware execution")

	let apiKey = req.query.apiKey

	if ( apiKey == undefined ||apiKey == "null" ){
		res.status(401).json({ error: "no apiKey" });
		return 

	} else{
		let infoInApiKey = jwt.verify(apiKey, "secret");

		if ( infoInApiKey == undefined || activeApiKeys.indexOf(apiKey) == -1){
			res.status(401).json({ error: "invalid apiKey" });
			return 	
		}

		req.infoInApiKey = infoInApiKey;
		req.apiKey = apiKey;
		next()

	}
	
	

	
	
	

	
})



app.use("/users", routerUsers)
app.use("/presents", routerPresents)
app.use("/friends", routerFriends)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })