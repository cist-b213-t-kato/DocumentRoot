var express = require("express");
var http = require('http');

//サーバインスタンス作成
var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end('server connected');
});
var io = require('socket.io').listen(server);

  server.listen(3001);//8888番ポートで起動

  //接続確立時の処理
  io.sockets.on('connection', function (socket) {
    // この中でデータのやり取りを行う
    console.log('connected');
	
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
		    // クライアントから受け取ったデータを出力する
		    console.log(data);
		    });
  });
