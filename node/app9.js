/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express");
var app = express();
var app2 = require('http').createServer(handler);
var io = require('socket.io')(app2);
var fs = require('fs');
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var bodyParser = require("body-parser");
// var Canvas = require('canvas');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'K/tPexcel57',
  database : 'ygg'
});




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

app.use(bodyParser.urlencoded({ limit:'10mb',extended: true }));


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


app.get("/asset/list", function(req, res, next) {
	var sql = "SELECT * FROM asset";
	connection.query(sql, [], function(error, results, fields) {
		res.json(results);
	});
});

app.get("/asset/get", function(req, res, next) {
	var sql = "SELECT * FROM asset WHERE id = ?";
	connection.query(sql, [req.query.id], function(error, results, fields) {
		res.json(results);
	});
});

app.post("/asset/create", function(req, res, next) {
	var sql = "INSERT INTO asset (html, script, answer, css) VALUES (?, ?, ?, ?)";
	console.log(req.body);
	// connection.query(sql, [req.body.html, req.body.script, req.body.answer, req.body.css], function(error, results, fields) {
	connection.query(sql, [req.body.html, req.body.script, "{}", req.body.css], function(error, results, fields) {
	});
});


app.post("/asset/update", function(req, res, next) {
	var sql = "UPDATE asset SET html = ?, script = ?, css = ? WHERE id = ?";
	connection.query(sql, [req.body.html, req.body.script, req.body.css, req.body.id], function(error, results, fields) {
		res.json({});
	});
});


// MongoDB へ 接続
MongoClient.connect(url, (error, client) => {

		const db = client.db('test');

		console.log('socket connected.');

		// コレクションの取得
		db.collection('message', (err, collection) => {
			app.get("/get-message", function(req, res, next) {
				// console.log(req.query);
			//	collection.find({thread:req.query.thread, date:{$exists: true}}).sort({date: -1}).limit(100).toArray((err, docs) => {
			//		// console.log(docs);
			//		res.json(docs);
			//	});
				var sql = "SELECT name, body, created_at AS date, thread FROM message WHERE thread = ? AND created_at IS NOT NULL ORDER BY created_at DESC LIMIT 100";
				connection.query(sql, [req.query.thread], function(error, results, fields) {
					res.json(results);
				});
			});
			
			app.post("/add-message", function(req, res){
				// console.log(req.body);
				res.send();

				collection.insertOne(req.body);
                                // insert using mysql
                                connection.query("insert into message values(default, ?, ?, ?, ?)",
                                    [req.body.name, req.body.body, req.body.date, req.body.thread], function (error, results, fields) {
                                });
			});

		
		});

/*
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
*/
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

		db.collection('file', (err, collection) => {
				app.get("/file", function(req, res, next) {
						const opt = {body: 0};
						// console.log(req.query);
						// collection.find({thread:req.query.thread}).toArray((err, docs) => {
						collection.find({}, {body:0}).project(opt).toArray((err, docs) => {
								res.json(docs);
								// res.send(docs[0].body);
							});
				});

				app.get("/file/id/:id", (req, res, next) => {
					collection.find({_id:new mongo.ObjectID(req.params.id)}).toArray((err, data) => {res.json(data);});
				});

				app.post("/file", function(req, res){
						res.send();

						collection.insertOne(req.body);

				});

		
		});
});

const pp_hash = {};

io.set('heartbeat interval', 5000);
io.set('heartbeat timeout', 15000);
io.on('connection', function (socket) {
		//socket.emit('message', {message:'hello'});
		//socket.broadcast.emit('message', {message:'world'});
		//console.log('socket.emit()');
		socket.on('clientToServer', function (data) {
			// クライアントから受け取ったデータを出力する
/*
			console.log('client: ' + data);
			for (var i in data) {
				console.log(data[i]);
			} 
*/
			// 全員に送信
//			socket.emit('message', data);
			socket.broadcast.emit('message', data);
//			console.log('socket.emit()');
		});

/*

		socket.on('drawListToServer', function(drawList) {

			// https://qiita.com/redshoga/items/d5afef65081b7fdf60cc

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

*/

    socket.on('disconnect', function (data) {
      console.log("disconnected: " + socket.conn.id);
      if (socket.conn.id in pp_hash) {
        delete pp_hash[socket.conn.id];
        res_output();
      }
    });

    function res_output() {
      const keys = Object.keys(pp_hash);
      const uninput = keys.filter(key => pp_hash[key] == '').length;
      if (keys.length != 0 && uninput == 0) {
        // 公開
		  	socket.emit('res-pp-open', {});
		  	socket.broadcast.emit('res-pp-open', {});
        setTimeout(function() {
		  	  socket.emit('res-pp-open', pp_hash);
		  	  socket.broadcast.emit('res-pp-open', pp_hash);
        }, 5 * 1000);
      } else {
        const pp_hidden_hash = {};
        keys.forEach(key => {
          if (pp_hash[key] != '') {
            pp_hidden_hash[key] = {
              name: pp_hash[key].name,
              value: "OK"
            };
          }
        });
        console.log("pp_hidden_hash");
        console.log(pp_hidden_hash);
		    socket.emit('res-pp-wait', pp_hidden_hash);
		    socket.broadcast.emit('res-pp-wait', pp_hidden_hash);
      }
    }

    socket.on('req-pp-output', function(data) {
      pp_hash[socket.conn.id] = data;
			console.log(pp_hash);
      res_output();
    });

    socket.on('req-pp-login', function(data) {
      console.log("pp-login: " + socket.conn.id);
      pp_hash[socket.conn.id] = '';
      res_output();
    });

		socket.on('shokken', function(data) {
			console.log(data);
			socket.emit('shokkenEmit', data);
			socket.broadcast.emit('shokkenEmit', data);
		});


});


