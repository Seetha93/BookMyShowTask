var express = require("express");
var fs = require('fs');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded()); // to support URL-encoded bodies

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var redis = require("redis").createClient();

// Serve up our static resources
app.get('/', function(req, res) {
  fs.readFile('./public/index.html', function(err, data) {
    res.end(data);
  });
});

app.get('/getArray', function(req, res){
	var json = '{"numbers" :["1000","2000","4000","2001","2017","4012","1010","3104"]}'
	res.end(json);
});
var count = 0;

app.post('/save', function(req, res){
	/*I have used Hash Set , so that even if any duplicates present in final array,
	they will be skipped */
	
	redis.sadd([count++, req.body.numbers], function(err, reply) {
    console.log(reply); // To know the status from redis 
	if(err){
		message = "Sorry , task failed. Please report it to the admin. "
		res.send(err);
	}
	else {
		message = "Success";
		var msg = JSON.stringify(message); //respons messge
		res.send(msg);
	}
	
	});
	
	console.log("Entering into message api");
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});