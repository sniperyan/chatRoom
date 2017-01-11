/**
 * Created by liyan on 2017/1/8.
 */
var path = require('path');
var express = require('express');   //web 框架
var routes = require('./routes');
var app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var http = require('http');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser());

//express全局变量存储在线用户列表的对象
global.users = {};


routes(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

    //有人上线
    socket.on('online', function (data) {
        //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
        socket.name = data.user;
        //users 对象中不存在该用户名则插入该用户名
        if (!global.users[data.user]) {
            global.users[data.user] = data.user;
        }
        //向所有用户广播该用户上线信息
        io.sockets.emit('online', {users: global.users, user: data.user});
    });

    //有人发话
    socket.on('say', function (data) {
        if (data.to == 'all') {
            //向其他所有用户广播该用户发话信息
            socket.broadcast.emit('say', data);
        } else {
            //向特定用户发送该用户发话信息
            //clients 为存储所有连接对象的数组
            var clients = io.sockets.sockets;
            //遍历找到该用户
            var keys = Object.keys(clients);
            keys.map(function (item,index) {
                if (clients[item].name == data.to) {
                    //触发该用户客户端的 say 事件
                    clients[item].emit('say', data);
                }
            });
        }
    });

    //有人下线
    socket.on('disconnect', function() {
        //若 users 对象中保存了该用户名
        if (global.users[socket.name]) {
            //从 users 对象中删除该用户名
            delete global.users[socket.name];
            //向其他所有用户广播该用户下线信息
            socket.broadcast.emit('offline', {users: global.users, user: socket.name});
        }
    });
});

server.listen(3000, function(){
    console.log('Express server listening on port 3000');
});