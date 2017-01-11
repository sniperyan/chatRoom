/**
 * Created by liyan on 2017/1/11.
 */
var express = require('express');
var app = express();
var router = express.Router();
// GET /signin 登录页
router.get('/', function(req, res, next) {
    res.render('signin');
});

// POST /signin 用户登录
router.post('/',  function(req, res, next) {
    if (global.users[req.body.name]) {
        //存在，则不允许登陆
        res.redirect('/signin');
    } else {
        //不存在，把用户名存入 cookie 并跳转到主页
        res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
        res.redirect('/');
    }


});

module.exports = router;