/**
 * Created by liyan on 2017/1/10.
 */
module.exports = function (app) {

    app.get("/",function (req, res) {
        if (req.cookies.user == null) {
            res.redirect('/signin');
        } else {
            res.render("index");
        }

    })
    app.use("/signin",require("./signin"));

}