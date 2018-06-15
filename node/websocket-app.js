/*
var fs = require('fs');
var http = require('http');
var server = http.createServer();

server.on('request', function(req, res) {
  var stream = fs.createReadStream('/var/www/html/websocket.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  stream.pipe(res);
});
var io = require('socket.io').listen(server);
server.listen(3001);

io.sockets.on('connection', function(socket) {
  socket.emit('greeting', {message: 'hello'}, function (data) {
    console.log('result: ' + data);
  });
});
*/

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

// HTTP サーバのポートを指定する
app.listen(3000);


function handler (req, res) {
  fs.readFile('../websocket.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  // クライアントへデータ送信
  // emit を使うとイベント名を指定できる
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    // クライアントから受け取ったデータを出力する
    console.log(data);
  });
});
