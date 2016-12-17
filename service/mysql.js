var mysql      		= require('mysql');
var config		 	= require('../config');

console.log(config.host);
var connection = mysql.createConnection({
  host     	: config.host,
  user     	: config.user,
  port		: config.port,
  password 	: config.password,
  database 	: config.database
});

connection.connect();



exports.excute = function(sql, callback){
	connection.query(sql, function(err, rows, field){
		callback(err, rows, field);
	});
}