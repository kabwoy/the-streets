const express = require("express")
const session = require("express-session")

const app = express()

app.set("view engine" , "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(session({

    resave:false,
    saveUninitialized:false,
    secret:"david",
}))

app.get("/" , async(req,res)=>{

    res.render("index")
})
app.get("/work" , async(req,res)=>{

    res.render("work")
})

app.get("/contacts" , async(req,res)=>{

    res.render("contact")
})
app.listen(3000)