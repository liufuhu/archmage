var mysql		= require('../service').mysql;
var util		= require('../util');

// index page
exports.index = function(req, res, next){
	mysql.excute('show tables;', function(err, rows, field){
		if(!err){
			var tables = util.transRowsToArr(rows);
		}

		res.render('index', {
	    	tables:  tables,
	    	env: process.env.server || ""
	    });
	})
}