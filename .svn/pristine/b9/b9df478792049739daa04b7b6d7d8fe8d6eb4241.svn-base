define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer]);
		var jlcxGrid = null, store = null;

		var columns = {
			checkbox: {label: '选择', renderCell: function (item) {
				var div = dc.create('div', {});
				dc.place(dc.create('input', {type: 'checkbox', name: 'tableCheckBox', id: item.DIS_ID}), div);
				return div;
			}},
			dojoId: {label: '序号'},
			CITY: {label: '城市'},
			DISTANCE: {label: '距离'},
			FEE: {label: '费用'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/queryjl",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
//					console.log(data);
					unloading();
					for (var i = 0; i < data.length; i++) {
						data[i] = dojo.mixin({
							dojoId : i + 1
						}, data[i]);
					}
					store = new Memory({
						data : {
							identifier : 'dojoId',
							label : 'dojoId',
							items : data
						}
					});
					jlcxGrid.totalCount = data.length;
					jlcxGrid.set('collection', store);
					$("#jlts").html(data.length);
//					jlcxGrid.pagination.refresh(data.length);
				},
				error : function(error) {
					console.log(error);
				}
			};
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				var _self = this;
				if (jlcxGrid) { jlcxGrid = null; dojo.empty('jlcxTabel') }
				jlcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jlcxTabel');
				query('#jlcxbtn').on('click', function () {
						var postData = {};
						postData.jlcxgjz=$("#jlcxgjz").val();
						loading('#jlcxTabel');
						dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
//					}
				});
				
				
				query('#jlcxAdd').on('click', function() {
					jlcxDialogPanel.set('href', 'app/html/editor/jlcxEditor.html');
					
					jlcxDialog.show().then(function() {
						jlcxDialog.set('title', '添加');
						query('#jltcbtn').on('click', function() {
							jlcxDialog.hide();
						});
						query('#jlczbtn').on('click', function() {
							if($("#czcs").val()==""){
								layer.msg("城市不能为空！");
							}else{
								if($("#czjl").val()==""){
									layer.msg("距离不能为空！");
								}else {
									if($("#czfy").val()==""){
										layer.msg("费用不能为空！");
									}else{
										dojo.xhrPost({
											url : basePath + "kb/addjl",
											postData :"postData={'city':'"+$("#czcs").val()+"','distance':'"+$("#czjl").val()+"','fee':'"+$("#czfy").val()+"','note':'"+$("#czbz").val()+"'}",
											handleAs : "json",
											Origin : self.location.origin,
											preventCache : true,
											withCredentials : true,
											load : function(data) {
												jlcxDialog.hide();
												layer.msg(data.msg);
												dojo.xhrPost(xhrArgsTabel);
											},
											error : function(error) {
												console.log(error);
											}
										});
									}
								}
							}
						});
					});
				});
				query('#jlcxUpd').on('click', function() {
					var xgids="";
					$('input[name="tableCheckBox"]:checked').each(function(){ 
						xgids+=this.id+",";
           		 	}); 
					if(xgids==""){
							layer.msg("请选择一条记录！");
						return;
					}
					var ids = xgids.split(",");
					if(ids.length>2){
							layer.msg("只能选择一条记录！");
						return;
					}
					jlcxDialogPanel.set('href', 'app/html/editor/jlcxEditor.html');
					findonejl(xgids).then(function(data){
						
						jlcxDialog.show().then(function() {
							$("#czcs").val(data.CITY);
							$("#czjl").val(data.DISTANCE);
							$("#czfy").val(data.FEE);
							$("#czbz").val(data.NOTE);
							jlcxDialog.set('title', '修改');
							query('#jltcbtn').on('click', function() {
								jlcxDialog.hide();
							});
							query('#jlczbtn').on('click', function() {
								dojo.xhrPost({
									url : basePath + "kb/editjl",
									postData :"postData={'id':'"+xgids+"','city':'"+$("#czcs").val()+"','distance':'"+$("#czjl").val()+"','fee':'"+$("#czfy").val()+"','note':'"+$("#czbz").val()+"'}",
									handleAs : "json",
									Origin : self.location.origin,
									preventCache : true,
									withCredentials : true,
									load : function(data) {
										jlcxDialog.hide();
										layer.msg(data.msg);
										dojo.xhrPost(xhrArgsTabel);
									},
									error : function(error) {
										console.log(error);
									}
								});
								
							});
						
						});
					});
				});
				
				query('#jlcxDel').on('click', function() {
					var xgids="";
					$('input[name="tableCheckBox"]:checked').each(function(){ 
						xgids+="'"+this.id+"',";
           		 	}); 
					if(xgids==""){
							layer.msg("请选择一条记录！");
						return;
					}
                  dijit.byId('sc_dialog').show().then(function() {
					on.once(dojo.byId("sc_dialog_submit"),'click',function () {
					dijit.byId('sc_dialog').set('title', '删除该任务');
						dojo.xhrPost({
							postData: 'postData={"id" :"'+xgids+'"}',
							url: encodeURI('kb/deljl'),
							handleAs : "json",
							preventCache:true,
							withCredentials :  true,
							load : function(data) {
									layer.msg(data.msg);
									dojo.xhrPost(xhrArgsTabel);
							}
						});
					})
				})
				});
			}
		})
	});