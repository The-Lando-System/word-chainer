var chainer = require('./chainer');

module.exports = function(app) {
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
	app.post('/longest-chain', function(req,res){
		res.send(chainer.getChain(req.body));
	});
};