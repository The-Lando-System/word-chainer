var chainer = require('./chainer');

var uuid = require('uuid');

module.exports = function(app) {

	var db = app.get('db');

  	db.on('connect', function() {
    	console.log('Connected to Redis');
    });

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	app.post('/longest-chain', function(req,res){
		var words = req.body;
		var execId = uuid.v4();

		db.hmset([execId, "chain", "none", "complete", "false"], function(err,data){
			if (err) {
				console.log(err);
			} else {
				console.log("Successfully initialized chain with key " + execId);
				res.send({uuid:execId});
				var chain = chainer.getLongestChain(words);
				db.hmset([execId, "chain", JSON.stringify(chain), "complete", "true"], function(err,data){
					if (err) {
						console.log(err);
					} else {
						console.log("Chain completed for key " + execId);
					}
				});
			}
		});
	});
	app.get('/longest-chain/:id', function(req,res){
		db.hgetall(req.params.id, function (err, obj) {
			if (err) {
				console.log(err);
			} else {
				console.log("successfully got chain object: " + obj);
				res.send(JSON.stringify(eval("(" + obj.chain + ")")));
			}
		});
	});
};