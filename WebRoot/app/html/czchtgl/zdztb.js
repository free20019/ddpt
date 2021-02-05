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
		var zdztbGrid = null, store = null;
		var zdztb_data;
		var columns = {
			checkbox: {label: '选择', renderCell: function (item) {
				var div = dc.create('div', {});
				dc.place(dc.create('input', {type: 'checkbox', name: 'zdztb-tableCheckBox', id: item.id, value:item.MS_ID}), div);
				return div;
			}},
			dojoId: {label: '序号'},
//			MS_ID: {label: '终端状态ID'},
			MS_NAME: {label: '终端状态名'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
			url : basePath + "back/findmdtstate",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				zdztb_data = data;
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
//				zdztbGrid.totalCount = data.count;
				zdztbGrid.set('collection', store);
//				zdztbGrid.pagination.refresh(data.length);
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
			get: function () {
				dojo.xhrPost(xhrArgsTabel);
			},
			initToolBar:function(){
				var _self = this;
				if (zdztbGrid) { zdztbGrid = null; dojo.empty('zdztbTabel') }
				zdztbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'zdztbTabel');
				query('#zdztbAdd').on('click', function() {
					zdztbDialogPanel.set('href', 'app/html/czchtgl/editor/zdztbEditor.html');
					zdztbDialog.show().then(function () {
						zdztbDialog.set('title', '新增终端状态');
						query('#zdztb-quit').on('click', function() {zdztbDialog.hide();});
						query('#zdztb-add').on('click', function() {
							var FormJson = getFormJson("zdztb-form");
							if ('' == FormJson.MS_NAME) {
								dijit.byId('qd_dialog').show().then(function() {
									$("#czjg").html('请输入终端状态名后添加！');
								});
								return;
							}
							var datap = JSON.stringify(FormJson);
							var xhrArgs2 = {
								url : basePath  + "back/addmdtstate",
								postData : {
									"postData" : datap
								},
								handleAs : "json",
								Origin : self.location.origin,
								preventCache:true,
								withCredentials :  true,
								load : function(data) {
									dijit.byId('qd_dialog').show().then(function() {
										$("#czjg").html(data.info);
										dojo.xhrPost(xhrArgsTabel);
										zdztbDialog.hide();
									})
								}
							}
							dojo.xhrPost(xhrArgs2);
						});
					})
				});
				query('#zdztbUpd').on('click', function() {
					var id_array=new Array();  
					$('input[name="zdztb-tableCheckBox"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});
					if (id_array.length==0) {
						dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个终端状态后修改！');
						});
						return;
					}else if(id_array.length>1){
						dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个终端状态！');
						});
						return;
					}
					zdztbDialogPanel.set('href', 'app/html/czchtgl/editor/zdztbEditor.html');
					zdztbDialog.show().then(function () {
						zdztbDialog.set('title', '编辑终端状态');
						var id_array=new Array();  
						$('input[name="zdztb-tableCheckBox"]:checked').each(function(){  
						    id_array.push($(this).val());//向数组中添加元素
						}); 
						var idstr=id_array.join(',');
						for(var i=0;i<zdztb_data.length;i++){
							if(zdztb_data[i].MS_ID==idstr){
								$("#MS_NAME").val(zdztb_data[i].MS_NAME);
								$("#NOTE").val(zdztb_data[i].NOTE);
							}
						}
						query('#zdztb-quit').on('click', function() {zdztbDialog.hide();});
						query('#zdztb-add').on('click', function() {
							
							var FormJson = getFormJson("zdztb-form");
							if ('' == FormJson.MS_NAME) {
								dijit.byId('qd_dialog').show().then(function() {
									$("#czjg").html('请输入终端状态名后添加！');
								});
								return;
							}
							FormJson.ID = idstr;
							var datap = JSON.stringify(FormJson);
							var xhrArgs2 = {
								url : basePath  + "back/editmdtstate",
								postData : {
									"postData" : datap
								},
								handleAs : "json",
								Origin : self.location.origin,
								preventCache:true,
								withCredentials :  true,
								load : function(data) {
									dijit.byId('qd_dialog').show().then(function() {
										$("#czjg").html(data.info);
										dojo.xhrPost(xhrArgsTabel);
										zdztbDialog.hide();
									})
								}
							}
							dojo.xhrPost(xhrArgs2);
						});
					})
				});
				query('#zdztbDel').on('click', function() {
					var id_array=new Array();  
					$('input[name="zdztb-tableCheckBox"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});
					if (id_array.length==0) {
						dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个终端状态后删除！');
						});
						return;
					}
					var idstr=id_array.join(',');
					var xhrArgs2 = {
						url : basePath  + "back/delmdtstate",
						postData : {
							"id" : idstr
						},
						handleAs : "json",
						Origin : self.location.origin,
						preventCache:true,
						withCredentials :  true,
						load : function(data) {
							dijit.byId('qd_dialog').show().then(function() {
								$("#czjg").html(data.info);
								dojo.xhrPost(xhrArgsTabel);
							})
						}
					}
					dojo.xhrPost(xhrArgs2);
				});
			}
		})
	});