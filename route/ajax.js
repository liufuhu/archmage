var mysql		= require('../service').mysql;
var util		= require('../util');

exports.query = function(req, res, next){
	var tableName 		= req.body.tableName;
	var condition 		= req.body.condition || '1=1';
	var queryType 		= req.body.queryType;
	var orderCondition 	= req.body.orderCondition = "id desc";

	var sql;
	if(queryType == 'where'){
		sql = 'select * from ' + tableName +' where ' + condition +' order by '+orderCondition +' limit 0, 30';
	}else if(queryType == 'full'){
		sql = req.body.condition;
		if(!!sql){
			if(sql.indexOf('limit') == -1){
				sql += " limit 0, 30";
			}
		}
	}

	if(!!sql){
		mysql.excute(sql, function(err, rows, field){
			if(!err){
				var fields = [];
				for(var i=0; i<field.length; i++){
					fields.push(field[i].name);
				}
				var Rows = [];
				for(var i=0; i<rows.length; i++){
					var row = [];
					for(var j=0; j<fields.length; j++){
						row.push(rows[i][fields[j]]);
					}
					Rows.push(row);
				}

				var result = {
					k: fields,
					v: Rows
				};

				res.send(JSON.stringify(result));
			}
		});
	}else{
		res.send("");
	}
}

exports.showCreate = function(req, res, next){
	var tableName = req.body.tableName;
	var sql = "show create table "+ tableName;

	mysql.excute(sql, function(err, rows, field){
		if(!err){
			res.send(JSON.stringify([rows[0]["Create Table"]]));
		}
		// res.send(rows);
	});
}

