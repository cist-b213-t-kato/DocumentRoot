/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express");
var app = express();
var app2 = require('http').createServer(handler);
var io = require('socket.io')(app2);
var fs = require('fs');
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
var Canvas = require('canvas');



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

// 接続文字列
var url = "mongodb://localhost:27017/sampledb";

var imgCollection;

// MongoDB へ 接続
MongoClient.connect(url, (error, client) => {

		const db = client.db('test');

		console.log('socket connected.');

		// コレクションの取得
		db.collection('message', (err, collection) => {
				app.get("/get-message", function(req, res, next) {
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

				});

		
		});

		db.collection('draw', (err, collection) => {
			app.post("/add-draw", function(req, res, next) {
				//collection.insertOne(req.body);
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
			imgCollection = collection;
			app.post("/add-img", function(req, res, next) {
				res.send();
				imgCollection.updateOne({}, {$set:req.body}, {upsert:true});
				console.log(req.body);
			});

			app.get("/get-img", function(req, res, next) {
				imgCollection.find().sort({_id:-1}).limit(1).toArray((err, docs) => {
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
/*			app.post("/add-thread", function(req, res){
				res.send();

				collection.insertOne({
					"name": req.body.name
				});

			});
*/
		});

});


io.on('connection', function (socket) {
		//socket.emit('message', {message:'hello'});
		//socket.broadcast.emit('message', {message:'world'});
		//console.log('socket.emit()');
		socket.on('clientToServer', function (data) {
			// クライアントから受け取ったデータを出力する
			console.log('client: ' + data);
			// 全員に送信
			socket.emit('message', {message:'hello'});
			socket.broadcast.emit('message', {message:'world'});
			console.log('socket.emit()');
		});

		socket.on('drawListToServer', function(drawList) {

			/* https://qiita.com/redshoga/items/d5afef65081b7fdf60cc */

			// console.log(drawList);
			
			//ここでDBに入れる
			//dbに登録しようとした
			imgCollection.find().sort({_id:-1}).limit(1).toArray((err, docs) => {
					var canvas = new Canvas(2000, 2000);//document.getElementById('canvas');
					Image = Canvas.Image;
					var ctx = canvas.getContext('2d');

					var img = new Image();
					img.crossOrigin = "Anonymous";
					img.src = docs[0].dat;
					//console.log(docs[0].dat);
					//console.log('img:'+img);
					//console.log('img.src:'+img.src);

					//img.onload = function() {
					//console.log('image loaded');
					ctx.drawImage(img, 0, 0);
					ctx.beginPath();

					for ( var i in drawList ) {
						var drawData = drawList[i];
						// console.log(drawData);
						//マウス継続値によって場合分け、直線の moveTo（スタート地点）を決定
						//継続値が初期値ではない場合は、前回のゴール位置を次のスタート位置とする
						//lineTo（ゴール地点）の決定、現在のマウス位置をゴール地点とする
						ctx.moveTo(drawData.startX, drawData.startY);
						ctx.lineTo(drawData.endX, drawData.endY);

						//直線の角を「丸」、サイズと色を決める
						ctx.lineCap = "round";
						ctx.lineWidth = drawData.size;
						ctx.strokeStyle = drawData.color;
						ctx.stroke();
					}
					
					
					var png = canvas.toDataURL('image/png');

					// console.log('png: '+png);

					imgCollection.updateOne({}, {$set:{dat:png}}, {upsert:true});
					//};

			})
		});

		socket.on('draw', function (drawData) {
			// クライアントから受け取ったデータを出力する
			// console.log('client: ' + data.startX);
			// 全員に送信
			socket.broadcast.emit('drawEmit', drawData);


		});

		socket.on('shokken', function(data) {
			scoket.broadcast.emit('shokkenEmit', data);
		})

});


