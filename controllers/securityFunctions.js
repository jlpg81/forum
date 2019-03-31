module.exports = {
    isLoggedIn: (req, res, next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/')
    },

    isUser: (req, res, next)=>{
        if(req.user.level>=1){
            return next();
        }
        res.redirect('/denied')
    },

    isAdmin: (req, res, next)=>{
        if(req.user.level>=2){
            return next();
        }
        res.redirect('/denied')
    },

    isIT: (req, res, next)=>{
        if(req.user.level>=3){
            return next();
        }
        res.redirect('/denied')
    }

}