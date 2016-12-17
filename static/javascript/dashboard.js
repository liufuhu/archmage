
	//初始化
	var tablename;
	var tables=[];
	var columnNames=[];
	var querytype='where';
	var currentMode ='view';
	var columnArr =[];

	$("#dbTables>li>a").each(function (){
		tables.push($(this).html())
	});

	// 快捷键绑定
	document.onkeydown = chang_page; 
    function chang_page(event) { 
        // if (event.keyCode == 37 || event.keyCode == 38) location = '<MTEntryPrevious><$MTEntryPermalink$></MTEntryPrevious>'; 
        // if (event.keyCode == 39 || event.keyCode == 40) location = '<MTEntryNext><$MTEntryPermalink$></MTEntryNext>' 
    //快捷键禁用
   //      for (var i = 0; i < window.winkeyCodeData.length; i++) {
   //      	if (event.keyCode == window.winkeyCodeData[i].key){
			// 	$("#"+window.winkeyCodeData[i].id).focus();
			// }
   //      };
    } 
	//绑定表名的点击
	function bindItem(){
		$(".table_node").click(function(){
			tablename = $(this).html();
			$("#board_table_name").html(tablename)
			var cParent = $("#result_col")
	    	cParent.empty()
	    	var parent = $("#result_col_value")
	    	parent.empty()
	    	$("#view_mode").attr('mode','view')
	    	$("#view_mode").html('查看模式')
	    	queryWhere("",null,false)
		})
	}
	bindItem();

	//绑定筛选框
	$("#search_filter").keyup(function(event) {
		//if (event.keyCode == 13) {
			var tbKeyword = $(this).val();
			$("#dbTables").empty();
			for (var i = 0; i < tables.length; i++) {
				if (tables[i].toUpperCase().indexOf(tbKeyword.toUpperCase())>=0) {
					var temp = $('<li><a class="table_node" href="#">'+tables[i]+'</a></li>')
					$("#dbTables").append(temp);
				}; 
			};
			bindItem();
		//}else{

			//快捷键注册
			if(!!window.domkeyCodeData['search_filter']){
				var keyArr = window.domkeyCodeData['search_filter'];
				for (var i = 0; i < keyArr.length; i++) {
					if(event.keyCode == keyArr[i].key){
						$("#"+keyArr[i].id).focus();
					}
				};
			}
		//};
			
		
	})
	//绑定查询表结构
	$("#show_create").click(function(){
		$.post("showCreate",{tableName:tablename},function(result){
			str = $.parseJSON(result)
			var content = "<div style='width:600px'>" + str[0] +"</div>";
			content = content.replace(tablename+',','')
			content =content.replace(/\n/g,'<br>')
			$('#show_create').attr("data-original-title",content)
			$('#show_create').tooltip({html:true,trigger:'click'})
		})
	})	
	//绑定编辑模式
	$("#view_mode").click(function(){
		if(!tablename) return;
		if (currentMode=='view') {
			$(this).attr('mode','edit')
			$(this).html('编辑模式')
			$("#insertBtn").show();
			queryWhere(null,null,true)
		}else{
			$(this).attr('mode','view')
			$(this).html('查看模式')
			$("#insertBtn").hide();
			queryWhere(null,null,false)
		}
		currentMode = $(this).attr('mode')
	});
	//绑定插入模式
	$("#insertBtn").click(function(){
		var $form = $("#modalBody"), 
		 	htm = "";
		for (var i = 0; i < columnArr.length; i++) {
			htm += "<label>"+columnArr[i]+"：</label><input class='form-control newColItem' type='text' "+((i==0)?'disabled':'')+">";
		};
		$form.html(htm);

	})
	//保存一条新纪录
	$("#saveNewRecord").click(function(){
		var $newValues = $(".newColItem"), 
		 	newValArr = [],
		 	newColArr = [columnArr[0]],
		 	itemVal = '';
		for (var i = 1; i < $newValues.length; i++) {
			itemVal = $.trim($newValues[i].value);
			if(itemVal != ''){
				itemVal = "\'" + itemVal + "\'";
				newColArr.push(columnArr[i]);
				newValArr.push(itemVal);
			}else if(columnArr[i] == 'gmt_create' || columnArr[i] == 'gmt_Create' || columnArr[i] == 'gmt_modified' || columnArr[i] == 'gmt_Modified' ){
				//gmt_create && gmt_modified 为空时置默认值		
				var _tdTime = new Date();
				itemVal = _tdTime.getTime();
				newColArr.push(columnArr[i]);
				newValArr.push(itemVal);
			}
		};
			
	 	var insertquery = 'insert into '+tablename+' ('+newColArr.join(',')+')  values (seq , '+newValArr.join(',')+');'
		execQuery(insertquery);
		queryWhere(null,null,false);
		$('#inserModal').modal('hide');
		$("#insertBtn").hide();
		var view_mode_node = $("#view_mode");
		view_mode_node.html('查看模式');
		view_mode_node.attr('mode','view');
		currentMode = view_mode_node.attr('mode');

	})
	//绑定查询方式按钮
	$(".query_type").click(function(){
		$("#query_type").html($(this).html()+"<span class='caret'></span>");
		if ($(this).html() == "完整sql") {
			querytype='full';
			$("#query").attr("placeholder",'输入完整sql语句')
		};
		if ($(this).html() == "where条件") {
			querytype='where';
			$("#query").attr("placeholder","查询条件，可以不输(全匹配)' ,输入举例：'id=1';'id=1 and name='abc'")
		};
		
	})

	//绑定查询框
	$("#query").keyup(function(e){
		if (e.keyCode == 13) {
			$("#go").click();
		}else{
			if(!!window.domkeyCodeData['query']){
				var keyArr = window.domkeyCodeData['query'];
				for (var i = 0; i < keyArr.length; i++) {
					if(event.keyCode == keyArr[i].key){
						$("#"+keyArr[i].id).focus();
					}
				};
			}
		};
	})

	//绑定查询按钮 go
	$("#go").click(function(){
		queryWhere(null,null,false);
	})

	//绑定删除按钮D 
	function bindDeleteButton(){
		$(".rowDelete").click(function(){
			//加个确认按钮？TODO
			var deletequery = 'delete from '+tablename+' where id = '+$(this).attr('dataid')+';'
			execQuery(deletequery)
			queryWhere(null,null,false);
			if (currentMode=='edit') {
				$(this).attr('mode','view')
				$("#view_mode").html('查看模式')
				$("#insertBtn").hide();
				currentMode = $(this)
				.attr('mode')
			}
		})
	}
	//绑定update按钮U
	function bindUpdateButton(){
		$(".rowUpdate").keyup(function(e){
			if (e.keyCode == 13) {
				var currentValue =$(this).attr('value')
				currentValue=currentValue.replace(/"/g,"\\\"")
				currentValue=currentValue.replace(/'/g,"\\'")
				var updatequery = 'update '+tablename+ ' set ' +$(this).attr('columnname') +"='" +currentValue+"' where id = "+$(this).attr('dataid')+';'
				execQuery(updatequery)
				queryWhere(null,null,false);
				if (currentMode=='edit') {
					$(this).attr('mode','view')
					$(this).html('查看模式')
					currentMode = $(this).attr('mode')
				}
			};
		})
	}

	function queryWhere(query,orderCondition,isEdit){
		if (query == null) {
		    query = $("#query").val();
		}
		if(!tablename) return;
		window.Util._$showLoading();
		$.post("query",{tableName:tablename,condition:query,queryType:querytype,orderCondition:orderCondition},function(result){
			window.Util._$hideLoading();

			columnArr = [];
	    	data = $.parseJSON(result)
	    	head = data.k
	    	value = data.v
	    	//process k
	    	var cParent = $("#result_col")
	    	cParent.empty()
	    	if (isEdit) {
		    	var actionth = $("<th><span style='display:block;width:50px'>删除</span></th>")
		    	cParent.append(actionth)
	    	}
	    	columnNames = head
	    	for (var i = 0; i < head.length; i++) {
	    		var th = $("<th data="+head[i]+">"+head[i]+ "<br><span><span style='font-size:5px;cursor: pointer;' class='glyphicon glyphicon-chevron-up order-up'></span><span style='font-size:5px;cursor: pointer;' class='glyphicon glyphicon-chevron-down order-down'></span></span></th>")
	    		cParent.append(th);
	    		columnArr.push(head[i]);
	    	}
	    	//process v
	    	var parent = $("#result_col_value")
	    	parent.empty()
	    	for (var i = 0; i < value.length; i++) {
	    		var tr = $("<tr></tr>")
	    		var arr = value[i]
	    		for(var j = 0; j < arr.length; j++){
	    			var col = arr[j]
	    			if (columnNames[j]=='id' && isEdit) {
	    				var dataid = col
	    				var actiontd = $("<td><button type='button' class='btn btn-danger rowDelete' dataid="+col+">D</button></td>")
	    				tr.append(actiontd)
	    			}
	    			if (isEdit) {
	    				var td = $("<td>"+"<input type='text' class='form-control rowUpdate' dataid='"+dataid+"' columnName='"+columnNames[j]+"' value='"+col+"'>"+"</td>")
	    			}else{
	    				var td = $("<td>"+col+"</td>")
	    			}
	    			tr.append(td)
	    		}
	    		parent.append(tr)
	    	}

	    	bindOrderClick();
	    	bindDeleteButton();
	    	bindUpdateButton();
	  	});
	}
	function execQuery(query){
		window.Util._$showLoading();
		$.post("query",{condition:query,queryType:'full'},function(result){
			window.Util._$hideLoading();
			queryWhere(null,null,false);
		});
	}

	function bindOrderClick(){
		$(".order-up").click(function(){
			var col = $(this).parent().parent().attr('data')
			queryWhere(null,col + ' asc',currentMode=='edit');
		});	
		$(".order-down").click(function(){
			var col = $(this).parent().parent().attr('data')
			queryWhere(null,col + ' desc',currentMode=='edit');
		});	

	}

