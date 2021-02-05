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
		var dzcxGrid = null, store = null;

		var columns = {
			checkbox: {label: '选择', renderCell: function (item) {
				var div = dc.create('div', {});
				dc.place(dc.create('input', {type: 'checkbox', name: 'tableCheckBox', id: item.GP_ID}), div);
				return div;
			}},
			dojoId: {label: '序号'},
			PNAME: {label: '目标地址'},
			GPNAME: {label: '定位地址'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/querydz",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					console.log(data);
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
					dzcxGrid.totalCount = data.length;
					dzcxGrid.set('collection', store);
					$("#dzts").html(data.length);
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
				if (dzcxGrid) { dzcxGrid = null; dojo.empty('dzcxTabel') }
				dzcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "dzcxTabel");
				
				
				query('#dzcxbtn').on('click', function () {
						var postData = {};
						postData.cxgjz=$("#dzcx_cxgjz").val();
						loading('#dzcxTabel');
						dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				query('#dzcxAdd').on('click', function() {
					dzcxDialogPanel.set('href', 'app/html/editor/dzcxEditor.html');
					dzcxDialog.show().then(function() {
						dzcxDialog.set('title', '添加');
						query('#dztcbtn').on('click', function() {
							dzcxDialog.hide();
						});
						query('#dzczbtn').on('click', function() {
							if($("#dzmb").val()==""){
								layer.msg("地址目标不能为空！");
							}else{
								if($("#dzdwdz").val()==""){
									layer.msg("定位地址不能为空！");
								}else{
										dojo.xhrPost({
											url : basePath + "kb/adddz",
											postData :"postData={'dzmb':'"+$("#dzmb").val()+"','dwdz':'"+$("#dzdwdz").val()+"','note':'"+$("#dzbz").val()+"'}",
											handleAs : "json",
											Origin : self.location.origin,
											preventCache : true,
											withCredentials : true,
											load : function(data) {
												dzcxDialog.hide();
												layer.msg(data.msg);
												dojo.xhrPost(xhrArgsTabel);
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
				query('#dzcxUpd').on('click', function() {
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
					dzcxDialogPanel.set('href', 'app/html/editor/dzcxEditor.html');
					findonedz(xgids).then(function(data){
						
						dzcxDialog.show().then(function() {
							$("#dzmb").val(data.PNAME);
							$("#dzdwdz").val(data.GPNAME);
							$("#dzbz").val(data.NOTE);
							dzcxDialog.set('title', '修改');
							query('#dztcbtn').on('click', function() {
								dzcxDialog.hide();
							});
							query('#dzczbtn').on('click', function() {
								dojo.xhrPost({
									url : basePath + "kb/editdz",
									postData :"postData={'id':'"+xgids+"','dzmb':'"+$("#dzmb").val()+"','dwdz':'"+$("#dzdwdz").val()+"','note':'"+$("#dzbz").val()+"'}",
									handleAs : "json",
									Origin : self.location.origin,
									preventCache : true,
									withCredentials : true,
									load : function(data) {
										dzcxDialog.hide();
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
				
				query('#dzcxDel').on('click', function() {
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
							url: encodeURI('kb/deldz'),
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