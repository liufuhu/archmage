var mysql      		= require('mysql');
var config		 	= require('../config');

var connection;

function connect(){
	connection = mysql.createConnection({
	  host     	: config.host,
	  user     	: config.user,
	  port		: config.port,
	  password 	: config.password,
	  database 	: config.database
	});

	connection.connect();	

	connection.on('error', function(err){
		if(err.code == 'PROTOCOL_CONNECTION_LOST'){
			connect();
		}else{
			console.log(err.stack || err);
		}
	})
}

connect();



exports.excute = function(sql, callback){
	connection.query(sql, function(err, rows, field){
		callback(err, rows, field);
	});
}