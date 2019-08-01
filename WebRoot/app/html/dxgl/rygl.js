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
		var ryglGrid = null, store = null;
		var queryCondition={},	settime=null;
		var loadindex=null;
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			TELEPHONE: {label: '电话号码'},
			TELNAME: {label: '姓名'}
		};
		var xhrArgsTabel = {
				url : basePath + "xxfs/findry",
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
					ryglGrid.totalCount = data.count;
					ryglGrid.set('collection', store);
					ryglGrid.pagination.refresh(data.data.length);
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
				queryCondition.keyword=$("#rygl_cxgjz").val();
				pageii = new Pagination(ryglGrid,xhrArgsTabel,queryCondition,30);
				dc.place(pageii.first(),'ryglTabel','after');
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				var _self = this;
				if (ryglGrid) { ryglGrid = null; dojo.empty('ryglTabel') }
				ryglGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "ryglTabel");

				query('#ryglbtn').on('click', function () {
					loadindex = layer.load(1);
					pageii.queryCondition.keyword=$("#rygl_cxgjz").val();
					pageii.first();
				});
				
				query('#ryglAdd').on('click', function() {
					ryDialogPanel.set('href', 'app/html/dxgl/ryglEditor.html');
					ryDialog.show().then(function() {
						ryDialog.set('title', '添加人员');
						query('#ryglEditor-qux').on('click', function() {
							ryDialog.hide();
						});
						query('#ryglEditor-qued').on('click', function() {
							if($("#telname").val()==""){
								layer.msg("姓名不能为空！");
							}else{
								if($("#telephone").val()==""){
									layer.msg("电话不能为空！");
								}else{
										dojo.xhrPost({
											url : basePath + "xxfs/addry",
											postData :"postData={'xm':'"+$("#telname").val()+"','dh':'"+$("#telephone").val()+"'}",
											handleAs : "json",
											Origin : self.location.origin,
											preventCache : true,
											withCredentials : true,
											load : function(data) {
												ryDialog.hide();
												layer.msg(data.msg);
												pageii.first();
											},
											error : function(error) {
												console.log(error);
											}
										});
								}
							}
						});
					});
				});
				query('#ryglUpd').on('click', function() {
					var hs=0;
                	var postData={};
    	        	dojo.forEach(ryglGrid.collection.data, function(item,index) {
    					if (ryglGrid.isSelected(item)) {
    						hs++;
    						postData=item;
    					}
    				});
    				if(hs==0){
    					layer.msg("请选择一条数据！");
    				}else if(hs>1){
    					layer.msg("只能选择一条数据！");
    				}else{
    					ryDialogPanel.set('href', 'app/html/dxgl/ryglEditor.html');
    					ryDialog.show().then(function() {
    						ryDialog.set('title', '修改人员');
    						$("#telname").val(postData.TELNAME);
    						$("#telephone").val(postData.TELEPHONE)
    						query('#ryglEditor-qux').on('click', function() {
    							ryDialog.hide();
    						});
    						query('#ryglEditor-qued').on('click', function() {
    							if($("#telname").val()==""){
    								layer.msg("姓名不能为空！");
    							}else{
    								if($("#telephone").val()==""){
    									layer.msg("电话不能为空！");
    								}else{
    										dojo.xhrPost({
    											url : basePath + "xxfs/updry",
    											postData :"postData={'xm':'"+$("#telname").val()+"','dh':'"+$("#telephone").val()+"','id':'"+postData.ID+"'}",
    											handleAs : "json",
    											Origin : self.location.origin,
    											preventCache : true,
    											withCredentials : true,
    											load : function(data) {
    												ryDialog.hide();
    												layer.msg(data.msg);
    												pageii.first();
    											},
    											error : function(error) {
    												console.log(error);
    											}
    										});
    								}
    							}
    						});
    					});
    				}
				});
				
				query('#ryglDel').on('click', function() {
					var hs=0;
                	var xgids="";
    	        	dojo.forEach(ryglGrid.collection.data, function(item,index) {
    					if (ryglGrid.isSelected(item)) {
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
							url: encodeURI('xxfs/delry'),
							handleAs : "json",
							preventCache:true,
							withCredentials :  true,
							load : function(data) {
									layer.msg(data.msg);
									pageii.first();
							}
						});
					})
				})
				});
			}
		})
	});