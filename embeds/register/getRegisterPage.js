
function getRegisterPage(req, res) {
    if(req.isAuthenticated()){
        res.redirect("back");
    } else{
       res.render("register", {authenticated: false}); 
    }
}

module.exports = getRegisterPage;