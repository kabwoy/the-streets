async function isAuth(req , res, next){
    if(!req.session.isAuthenticated){

        res.redirect('/login')
    }else{

        next()
    }

}

module.exports = isAuth