var util = {
	transRowsToArr: function(rows){
		var tables = [];
		for(var i=0; i<rows.length; i++){
			for(var item in rows[i]){
				if(rows[i].hasOwnProperty(item)){
					tables.push(rows[i][item]);
				}
			}
		}
		return tables;
	}
}


module.exports = util;