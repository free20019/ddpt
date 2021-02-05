define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
        "dgrid/Keyboard", "dgrid/extensions/ColumnResizer",'dgrid/Selector',
        "dojo/store/Memory","cbtree/model/TreeStoreModel",
        "dstore/Memory","dijit/form/NumberTextBox",
        "dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
        "dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
        "cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
    function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
             SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
             Pagination, Selection, Keyboard, ColumnResizer,Selector,
             Memory2,TreeStoreModel,
             Memory,NumberTextBox, DijitRegistry, registry, domStyle,
             declare, dc, on,ObjectStoreModel, Tree,
             ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer,Selector]);
		var qzglGrid = null, store = null;
		var queryCondition={},	settime=null;
		var loadindex=null;
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			TEAMNAME: {label: '群组名称'},
			YHS: {label: '电话号码组'}
		};
		var xhrArgsTabel = {
				url : basePath + "xxfs/findqz",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					if(loadindex!=null){
						layer.close(loadindex);
					}
					for (var i = 0; i < data.data.length; i++) {
						data.data[i] = dojo.mixin({
							dojoId : i + 1
						}, data.data[i]);
					}
					store = new Memory({
						data : {
							identifier : 'dojoId',
							label : 'dojoId',
							items : data.data
						}
					});
					qzglGrid.totalCount = data.count;
					qzglGrid.set('collection', store);
					qzglGrid.pagination.refresh(data.data.length);
				},
				error : function(error) {
					console.log(error);
				}
			};
		var pageii;
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				loadindex = layer.load(1);
				queryCondition.keyword=$("#qzgl_cxgjz").val();
				pageii = new Pagination(qzglGrid,xhrArgsTabel,queryCondition,30);
				dc.place(pageii.first(),'qzglTabel','after');
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				var _self = this;
				if (qzglGrid) { qzglGrid = null; dojo.empty('qzglTabel') }
				qzglGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "qzglTabel");

				query('#qzglbtn').on('click', function () {
					loadindex = layer.load(1);
					pageii.queryCondition.keyword=$("#qzgl_cxgjz").val();
					pageii.first();
				});
				
				query('#qzglAdd').on('click', function() {
					qzDialogPanel.set('href', 'app/html/dxgl/qzglEditor.html');
					qzDialog.show().then(function() {
						findryxx().then(function(data){
							for (var i = 0; i < data.length; i++) {
								var str = '<li><input type="checkbox" style="width:18px;vertical-align: middle;" name="ryxxchk" id="chk'+data[i].ID+'"><label for="chk'+data[i].ID+'" style="vertical-align:middle">'+data[i].TELEPHONE+'('+data[i].TELNAME+')</label></li>';
								$("#ryxx").append(str);
							}
						});
						qzDialog.set('title', '添加群组');
						query('#qzglEditor-qux').on('click', function() {
							qzDialog.hide();
						});
						query('#qzglEditor-qued').on('click', function() {
							var dhids = "";
							
							$("input[name='ryxxchk']:checked").each(function(){
								dhids+=this.id.replace('chk','')+",";
							});
							
							if($("#qzname").val()==""){
								layer.msg("群组名称不能为空！");
							}else if(dhids==""){
								layer.msg("请至少选择一个电话！");
							}else{
								dojo.xhrPost({
									url : basePath + "xxfs/addqz",
									postData :"postData={'mc':'"+$("#qzname").val()+"','dh':'"+dhids+"'}",
									handleAs : "json",
									Origin : self.location.origin,
									preventCache : true,
									withCredentials : true,
									load : function(data) {
										qzDialog.hide();
										layer.msg(data.msg);
										pageii.first();
										queryqzlist();
									},
									error : function(error) {
										console.log(error);
									}
								});
							}
						});
					});
				});
				query('#qzglUpd').on('click', function() {
					var hs=0;
                	var postData={};
    	        	dojo.forEach(qzglGrid.collection.data, function(item,index) {
    					if (qzglGrid.isSelected(item)) {
    						hs++;
    						postData=item;
    					}
    				});
    				if(hs==0){
    					layer.msg("请选择一条数据！");
    				}else if(hs>1){
    					layer.msg("只能选择一条数据！");
    				}else{
    					qzDialogPanel.set('href', 'app/html/dxgl/qzglEditor.html');
    					qzDialog.show().then(function() {
    						findryxx().then(function(data){
    							for (var i = 0; i < data.length; i++) {
    								var str = '<li><input type="checkbox" style="width:18px;vertical-align: middle;" name="ryxxchk" id="chk'+data[i].ID+'"><label for="chk'+data[i].ID+'" style="vertical-align:middle">'+data[i].TELEPHONE+'('+data[i].TELNAME+')</label></li>';
    								$("#ryxx").append(str);
    							}
    							for (var j = 0; j < postData.YHIDS.length; j++) {
    								$("#chk"+postData.YHIDS[j]).attr("checked",true); 
    							}
    						});
    						$("#qzname").val(postData.TEAMNAME);
    						qzDialog.set('title', '修改群组');
    						query('#qzglEditor-qux').on('click', function() {
    							qzDialog.hide();
    						});
    						query('#qzglEditor-qued').on('click', function() {
    							var dhids = "";
    							
    							$("input[name='ryxxchk']:checked").each(function(){
    								dhids+=this.id.replace('chk','')+",";
    							});
    							
    							if($("#qzname").val()==""){
    								layer.msg("群组名称不能为空！");
    							}else if(dhids==""){
    								layer.msg("请至少选择一个电话！");
    							}else{
    								dojo.xhrPost({
    									url : basePath + "xxfs/updqz",
    									postData :"postData={'mc':'"+$("#qzname").val()+"','dh':'"+dhids+"','id':'"+postData.ID+"'}",
    									handleAs : "json",
    									Origin : self.location.origin,
    									preventCache : true,
    									withCredentials : true,
    									load : function(data) {
    										qzDialog.hide();
    										layer.msg(data.msg);
    										pageii.first();
    										queryqzlist();
    									},
    									error : function(error) {
    										console.log(error);
    									}
    								});
    							}
    						});
    					});
    				}
				});
				
				query('#qzglDel').on('click', function() {
					var hs=0;
                	var xgids="";
    	        	dojo.forEach(qzglGrid.collection.data, function(item,index) {
    					if (qzglGrid.isSelected(item)) {
    						hs++;
    						xgids+=item.ID+",";
    					}
    				});
    				if(hs==0){
    					layer.msg("请选择一条数据！");
    					return;
    				}
                  dijit.byId('sc_dialog').show().then(function() {
					on.once(dojo.byId("sc_dialog_submit"),'click',function () {
					dijit.byId('sc_dialog').set('title', '删除该任务');
						dojo.xhrPost({
							postData: 'postData={"id" :"'+xgids+'"}',
							url: encodeURI('xxfs/delqz'),
							handleAs : "json",
							preventCache:true,
							withCredentials :  true,
							load : function(data) {
									layer.msg(data.msg);
									pageii.first();
									queryqzlist();
							}
						});
					})
				})
				});
			}
		})
	});