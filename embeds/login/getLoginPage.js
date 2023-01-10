

function getLoginPage(req, res) { 
    if(req.isAuthenticated()){
        res.redirect("back");
    } else{
        if(req.query.message){
            res.render("login", {loginType: "email", authenticated: false, url: " ", message: req.query.message});
        }
        else{
            if(req.query.url){
                res.render("login", {loginType: "email", authenticated: false, url: req.query.url});
            }else{
                res.render("login", {loginType: "email", authenticated: false, url: " "});
            }
        }
    }
}

function getLogoutPage(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
    });
    res.redirect("/login");
} 

module.exports = { getLoginPage, getLogoutPage };