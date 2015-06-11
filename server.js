/*************************************
//
// notikube app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var device  = require('express-device');

var runningPortNumber = process.env.PORT;

var Cylon = require('cylon');

var ledColor = "000000";

var robot = Cylon.robot({
	connections: {
	    arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem1421' }
	  },
	  devices: {
	    leds: { driver: 'rgb-led', redPin: 3, greenPin: 5, bluePin: 6 },
	  },
	  work: function(my) {
	     every((1).second(), function() {     
	      my.leds.setRGB(ledColor);
	    });
	  }
}).start();

app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));

	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');

	app.use(device.capture());
});


// logs every request
app.use(function(req, res, next){
	// output every request in the array
	console.log({method:req.method, url: req.url, device: req.device});

	// goes onto the next function in line
	next();
});

app.get("/", function(req, res){
	res.render('index', {});
});


io.sockets.on('connection', function (socket) {

	socket.on('set_color', function(data, fn){
		console.log(data);
		ledColor = data.msg;
		fn();//call the client back to clear out the field
	});

});





server.listen(runningPortNumber);

