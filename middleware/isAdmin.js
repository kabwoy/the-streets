async function isAdmin(req,res,next){
    const result = true
    if(req.session.user){
        next()
    }else{
        res.redirect("/")
    }
}

module.exports = isAdmin