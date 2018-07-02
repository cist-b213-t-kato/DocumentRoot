/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express");
var app = express();
var app2 = require('http').createServer(handler);
var io = require('socket.io')(app2);
var fs = require('fs');
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");



/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});



// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ limit:'5mb',extended: true }));


app.get("/shuttlebus", function(req, res, next){
		var json = require('./shuttlebus.json');
		res.json(json);
	});


app2.listen(3001);
function handler (req, res) {
  fs.readFile('../index.html',
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
		//socket.emit('message', {message:'hello'});
		//socket.broadcast.emit('message', {message:'world'});
		//console.log('socket.emit()');
		socket.on('clientToServer', function (data) {
			// クライアントから受け取ったデータを出力する
			console.log('client: '+data);
			// 全員に送信
			socket.emit('message', {message:'hello'});
			socket.broadcast.emit('message', {message:'world'});
			console.log('socket.emit()');
		});

		socket.on('draw', function (data) {
			// クライアントから受け取ったデータを出力する
			// console.log('client: ' + data.startX);
			// 全員に送信
			socket.broadcast.emit('drawEmit', data);
		});

});

// 接続文字列
var url = "mongodb://localhost:27017/sampledb";

// MongoDB へ 接続
MongoClient.connect(url, (error, client) => {

		const db = client.db('test');

				console.log('socket connected.');
				// コレクションの取得
				db.collection('message', (err, collection) => {
						app.get("/get-message", function(req, res, next){
								// console.log(req.query);
								collection.find({thread:req.query.thread}).toArray((err, docs) => {
										// console.log(docs);
										res.json(docs);
										});
								});
						
						app.post("/add-message", function(req, res){
								// console.log(req.body);
								res.send();

								collection.insertOne(req.body);
								/*
								collection.insertOne({
										"name": req.body.name,
										"body": req.body.body,
										"thread": req.body.thread
										});
								*/

						});

				
				});

		db.collection('draw', (err, collection) => {
			app.post("/add-draw", function(req, res, next) {
				collection.insertOne(req.body);
				res.send();
			});
			app.get("/get-draw", function(req, res, next){
				// collection.find({}, {sort:{_id:-1}, limit:10000}).toArray((err, docs) => {
				collection.find().sort({_id:-1}).limit(30000).toArray((err, docs) => {
					docs.sort( ( a, b )=>{
						if ( a._id < b._id ) return -1;
						else if ( a._id > b._id ) return +1;
						else return 0;
					});
					for ( var i in docs ) {
						delete docs[i]._id;
						delete docs[i].time;
					}
					res.json(docs);
				});
			});
		});

		db.collection('img', (err, collection) => {
			app.post("/add-img", function(req, res, next) {
				res.send();
				collection.updateOne({}, {$set:req.body}, {upsert:true});
			});

			app.get("/get-img", function(req, res, next) {
				collection.find().sort({_id:-1}).limit(1).toArray((err, docs) => {
					res.json(docs);
				})
			});

		});

		db.collection('counter', (err, collection) => {
			app.get("/counter", function(req, res, next){
				collection.find().toArray((err, docs) => {
					var c = docs[0].count + 1;
					collection.update({}, { $set:{count:c} });
					res.json({"count":c});
				});
				//console.log(c);
				//collection.find()
			});
		});

		db.collection('thread', (err, collection) => {
			app.get("/get-thread", function(req, res, next) {
				collection.find().toArray((err, docs)=>{
					res.json(docs);
				});
			});
			app.post("/add-thread", function(req, res){
				res.send();

				collection.insertOne({
					"name": req.body.name
				});

			});
		});

});


