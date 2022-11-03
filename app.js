const express = require("express")
const session = require("express-session")
const Joi = require("joi")
const multer = require("multer")
const flash = require("connect-flash")
const bcrypt = require("bcryptjs")
const sequelize = require("./db/con")
const User = require("./models/User")
const Image = require("./models/Image")
const isAuth = require("./middleware/isAuth")
const isAdmin = require('./middleware/isAdmin')
const mailer = require("./utils/mailer")
var nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()

app.use(express.urlencoded({extended:true}))

app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:process.env.SECRET,
}))
app.use(async function(req,res,next){
    if(!req.session.user){
        console.log("no users yet")
        next()
    }else{
    
        req.user = await User.findByPk(req.session.user.id)
        res.locals.userid = req.user.id
        res.locals.isAdmin = req.user.isAdmin
        res.locals.isAuth = req.session.isAuthenticated
        next()
    
    }
    
})
app.use(flash())
app.use(express.static('public'))
app.set('view engine' , 'ejs')

const storageConfig = multer.diskStorage({

    destination:(req,file ,cb)=>{

        cb(null , 'public/assets/img/pics')
    },

    filename:(req,file,cb)=>{

        cb(null , Date.now() + "-" + file.originalname)
    }

})

const upload = multer({storage:storageConfig})
app.get("/" , async(req,res)=>{

    res.render("index")
})
app.get("/contacts" , async(req,res)=>{

    res.render("contact")
})

app.post("/contacts" , async(req,res)=>{

    mailer(req.body.message , req.body.email)

    res.redirect("/")
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

app.get("/work" , async(req,res)=>{
    const images = await Image.findAll({})


    res.render('work' ,{images})
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

    req.session.user = user

    // console.log(res.locals);

    req.session.isAuthenticated = true


    res.redirect("/")
})

app.get("/logout" , async(req,res)=>{

    req.session.isAuthenticated = false

    res.redirect("/")
})

app.get('/images' , isAdmin, isAuth , async(req,res)=>{

    res.render("add-images")
})

app.post("/images" , upload.array('image') , async(req,res)=>{

    await Promise.all(req.files.map(async(image)=>{
        const src = image.destination.split('public')
        await Image.create({image_src:`${src[1]}/${image.filename}`})
    }))

    res.redirect("/images")
})

sequelize.sync({alter:false})
app.listen(3000 | process.env.PORT) 