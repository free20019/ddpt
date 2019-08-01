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
		var dhcxGrid = null, store = null;

		var columns = {
			checkbox: {label: '选择', renderCell: function (item) {
				var div = dc.create('div', {});
				dc.place(dc.create('input', {type: 'checkbox', name: 'tableCheckBox', id: item.AB_ID}), div);
				return div;
			}},
			dojoId: {label: '序号'},
			CUST_NAME: {label: '客户名字'},
			CUST_TEL: {label: '客户电话'},
			CUST_ADDR: {label: '客户地址'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/querydh",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
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
					dhcxGrid.totalCount = data.length;
					dhcxGrid.set('collection', store);
					$("#dhts").html(data.length);
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
				if (dhcxGrid) { dhcxGrid = null; dojo.empty('dhcxTabel') }
				dhcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "dhcxTabel");
				
				query('#dhcxbtn').on('click', function () {
						var postData = {};
						postData.dhkhmz=$("#dhkhmz").val();
						loading('#dhcxTabel');
						dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				
				query('#dhtjbtn').on('click', function() {
					dhcxDialogPanel.set('href', 'app/html/editor/dhcxEditor.html');
					
					dhcxDialog.show().then(function() {
						dhcxDialog.set('title', '添加');
						query('#dhtcbtn').on('click', function() {
							dhcxDialog.hide();
						});
						query('#dhczbtn').on('click', function() {
							if($("#czkhmz").val()==""){
								$("#czjg").html("客户姓名不能为空！");
								dijit.byId('qd_dialog').show();
							}else{
								if($("#czkhdh").val()==""){
									$("#czjg").html("客户电话不能为空！");
									dijit.byId('qd_dialog').show();
								}else {
									if($("#czkhdz").val()==""){
										$("#czjg").html("客户地址不能为空！");
										dijit.byId('qd_dialog').show();
									}else{
										dojo.xhrPost({
											url : basePath + "kb/adddh",
											postData :"postData={'hkmz':'"+$("#czkhmz").val()+"','khdh':'"+$("#czkhdh").val()+"','khdz':'"+$("#czkhdz").val()+"','khbz':'"+$("#czkhbz").val()+"'}",
											handleAs : "json",
											Origin : self.location.origin,
											preventCache : true,
											withCredentials : true,
											load : function(data) {
												dhcxDialog.hide();
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
				query('#dhxgbtn').on('click', function() {
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
					xgids = xgids.substring(0,xgids.length-1);
					dhcxDialogPanel.set('href', 'app/html/editor/dhcxEditor.html');
					findonedh(xgids).then(function(data){
						
						dhcxDialog.show().then(function() {
							$("#czkhmz").val(data.CUST_NAME);
							$("#czkhdh").val(data.CUST_TEL);
							$("#czkhdz").val(data.CUST_ADDR);
							$("#czkhbz").val(data.NOTE);
							dhcxDialog.set('title', '修改');
							query('#dhtcbtn').on('click', function() {
								dhcxDialog.hide();
							});
							query('#dhczbtn').on('click', function() {
								dojo.xhrPost({
									url : basePath + "kb/editdh",
									postData :"postData={'id':'"+xgids+"','hkmz':'"+$("#czkhmz").val()+"','khdh':'"+$("#czkhdh").val()+"','khdz':'"+$("#czkhdz").val()+"','khbz':'"+$("#czkhbz").val()+"'}",
									handleAs : "json",
									Origin : self.location.origin,
									preventCache : true,
									withCredentials : true,
									load : function(data) {
										dhcxDialog.hide();
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
				
				query('#dhscbtn').on('click', function() {
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
							url: encodeURI('kb/deldh'),
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