const express = require("express")
const session = require("express-session")
const Joi = require("joi")
const multer = require("multer")
const flash = require("connect-flash")
const bcrypt = require("bcryptjs")
const sequelize = require("./db/con")
const User = require("./models/User")

const app = express()

app.set("view engine" , "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(session({

    resave:false,
    saveUninitialized:false,
    secret:"david",
}))
app.use(flash())

const storageConfig = multer.diskStorage({

    destination:(req,file ,cb)=>{

        cb(null , './public/assets/img/pics')
    },

    filename:(req,file,cb)=>{

        cb(null , Date.now() + "-" , file.originalname)
    }
 
})

const upload = multer({storage:storageConfig})
app.get("/" , async(req,res)=>{

    res.render("index")
})
app.get("/work" , async(req,res)=>{

    res.render("work")
})

app.get("/contacts" , async(req,res)=>{

    res.render("contact")
})

app.get("/signup" , async(req,res ,next)=>{

    // // res.send(req.flash('message'))
    // console.log(req.flash('message'))
    
    res.render("signup",{message:req.flash('message')})
})

app.post("/signup" , async(req,res)=>{

    const schema = Joi.object({email:Joi.string().required() , password:Joi.string().required().min(3)})

    const {error} = schema.validate(req.body)

    if(error){

        return error.details.map((message)=>{
            req.flash('message' , message.message)
            return res.redirect("/login")
        })
    }

    const password = await bcrypt.hash(req.body.password , 12)

    await User.create({email:req.body.email , password:password})

    req.session.isAuthenticated = true

    res.redirect("/")


})
app.get("/login" , async(req,res)=>{

    res.render("login")
})

app.post("/login" , async(req,res)=>{

    const schema = Joi.object({email:Joi.string().required() , password:Joi.string().required().min(3)})

    const {error} = schema.validate(req.body)

    if(error){

        return error.details.map((message)=>{
            req.flash('message' , message.message)
            return res.redirect("/login")
        })
    }

    const user = await User.findOne({where:{
        email:req.body.email,
    }})


    if(!user) return res.send("no user found with this email")


    const matching = await bcrypt.compare(req.body.password, user.password)

    if(!matching) return res.send('incorect password')

    req.session.isAuthenticated = true

    res.redirect("/")
})

app.get('/images' , async(req,res)=>{

    res.render("add-images")
})

sequelize.sync({alter:true})
app.listen(3000)